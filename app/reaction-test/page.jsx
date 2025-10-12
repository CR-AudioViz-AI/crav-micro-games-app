'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Chrome as Home, RotateCcw, Zap } from 'lucide-react';
import { metrics } from '@/lib/metrics';
import { createUserSession } from '@/lib/entitlements';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import PaywallGate from '@/components/games/PaywallGate';
import Leaderboard from '@/components/games/Leaderboard';
import { toast } from 'sonner';

export default function ReactionTest() {
  const [userSession] = useState(createUserSession());
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [testState, setTestState] = useState('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [round, setRound] = useState(0);
  const [isPremiumMode, setIsPremiumMode] = useState(false);
  const timeoutRef = useRef(null);

  const startGame = (premium = false) => {
    if (premium && userSession.plan === 'FREE') {
      toast.error('Premium mode requires Pro or Elite plan');
      return;
    }

    setIsPremiumMode(premium);
    setGameState('playing');
    setScore(0);
    setReactionTimes([]);
    setRound(0);
    setTestState('waiting');

    metrics.playStarted('reaction-test', userSession.userId);
    startRound();
  };

  const startRound = () => {
    setTestState('waiting');
    const delay = 2000 + Math.random() * 3000;

    timeoutRef.current = setTimeout(() => {
      setTestState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (testState === 'waiting') {
      toast.error('Too early! Wait for green!');
      setTestState('tooEarly');
      clearTimeout(timeoutRef.current);
      setTimeout(() => {
        if (round < 4) {
          startRound();
        } else {
          endGame();
        }
      }, 1500);
    } else if (testState === 'ready') {
      const reactionTime = Date.now() - startTime;
      const newTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newTimes);

      const points = Math.max(0, 500 - Math.floor(reactionTime / 2));
      const finalPoints = isPremiumMode ? points * 1.5 : points;
      setScore(score + finalPoints);

      toast.success(`${reactionTime}ms! +${Math.floor(finalPoints)} points`);

      setTestState('result');
      setTimeout(() => {
        if (round < 4) {
          setRound(round + 1);
          startRound();
        } else {
          endGame();
        }
      }, 1500);
    }
  };

  const endGame = async () => {
    setGameState('finished');
    clearTimeout(timeoutRef.current);

    try {
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'reaction-test',
          score,
          userId: userSession.userId,
          name: 'Player'
        })
      });
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const resetGame = () => {
    clearTimeout(timeoutRef.current);
    setGameState('menu');
    setScore(0);
    setReactionTimes([]);
    setRound(0);
    setTestState('waiting');
    setIsPremiumMode(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <Button variant="outline" onClick={() => window.location.href = '/games'} className="mb-4">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
                <h1 className="text-4xl font-bold mb-2">⚡ Reaction Test</h1>
                <p className="text-gray-600">Test your reaction speed</p>
              </div>
              <AdSlot position="banner" gameId="reaction-test" className="mb-8" />
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      Free Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4 text-sm">
                      <li>• 5 reaction tests</li>
                      <li>• Standard scoring</li>
                      <li>• Track your speed</li>
                    </ul>
                    <Button onClick={() => startGame(false)} className="w-full">Play Free Mode</Button>
                  </CardContent>
                </Card>
                <PaywallGate isBlocked={userSession.plan === 'FREE'} requiredPlan="PRO" feature="Premium Reaction Test" gameId="reaction-test">
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        Premium Mode
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4 text-sm">
                        <li>• 5 reaction tests</li>
                        <li>• 1.5x score multiplier</li>
                        <li>• Global leaderboard</li>
                      </ul>
                      <Button onClick={() => startGame(true)} className="w-full bg-yellow-600 hover:bg-yellow-700">Play Premium Mode</Button>
                    </CardContent>
                  </Card>
                </PaywallGate>
              </div>
            </div>
            <div className="space-y-6">
              <UpsellSidebar userPlan={userSession.plan} gameId="reaction-test" context="game_page" />
              <Leaderboard gameId="reaction-test" userPlan={userSession.plan} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    let bgColor = 'bg-red-500';
    let message = 'Wait...';
    if (testState === 'ready') {
      bgColor = 'bg-green-500';
      message = 'CLICK NOW!';
    } else if (testState === 'tooEarly') {
      bgColor = 'bg-orange-500';
      message = 'Too Early!';
    } else if (testState === 'result') {
      bgColor = 'bg-blue-500';
      message = `${reactionTimes[reactionTimes.length - 1]}ms`;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">⚡ Reaction Test</h1>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-600">Round: {round + 1} / 5</Badge>
                <Badge variant="secondary">Score: {Math.floor(score).toLocaleString()}</Badge>
              </div>
            </div>
          </div>
          <div onClick={handleClick} className={`${bgColor} rounded-lg cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center`} style={{ height: '400px' }}>
            <div className="text-white text-6xl font-bold mb-4">{testState === 'ready' ? <Zap className="w-24 h-24" /> : null}</div>
            <div className="text-white text-4xl font-bold">{message}</div>
          </div>
          {reactionTimes.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Your Times:</h3>
                <div className="flex flex-wrap gap-2">
                  {reactionTimes.map((time, idx) => (
                    <Badge key={idx} variant="secondary">Round {idx + 1}: {time}ms</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <div className="text-center mt-6">
            <Button variant="outline" onClick={resetGame}><Home className="w-4 h-4 mr-2" />Back to Menu</Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const avgTime = Math.floor(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
    const bestTime = Math.min(...reactionTimes);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className="text-6xl mb-4">⚡</div>
              <CardTitle className="text-3xl">Test Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 mb-8">{Math.floor(score).toLocaleString()} Points</div>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-2xl font-bold">{avgTime}ms</div>
                  <div className="text-gray-600">Average Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{bestTime}ms</div>
                  <div className="text-gray-600">Best Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{reactionTimes.length}</div>
                  <div className="text-gray-600">Tests Completed</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button onClick={resetGame} size="lg"><RotateCcw className="w-4 h-4 mr-2" />Play Again</Button>
                <Button variant="outline" onClick={() => window.location.href = '/games'} size="lg"><Home className="w-4 h-4 mr-2" />More Games</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
