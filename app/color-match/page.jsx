'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Trophy, Chrome as Home, RotateCcw } from 'lucide-react';
import { metrics } from '@/lib/metrics';
import { createUserSession } from '@/lib/entitlements';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import PaywallGate from '@/components/games/PaywallGate';
import Leaderboard from '@/components/games/Leaderboard';
import { toast } from 'sonner';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export default function ColorMatch() {
  const [userSession] = useState(createUserSession());
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetColor, setTargetColor] = useState('');
  const [colorOptions, setColorOptions] = useState([]);
  const [isPremiumMode, setIsPremiumMode] = useState(false);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const startGame = (premium = false) => {
    if (premium && userSession.plan === 'FREE') {
      toast.error('Premium mode requires Pro or Elite plan');
      return;
    }

    setIsPremiumMode(premium);
    setGameState('playing');
    setScore(0);
    setTimeLeft(premium ? 45 : 30);
    generateRound();

    metrics.playStarted('color-match', userSession.userId);
  };

  const generateRound = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    const options = [target];
    while (options.length < 4) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (!options.includes(color)) options.push(color);
    }
    setTargetColor(target);
    setColorOptions(options.sort(() => Math.random() - 0.5));
  };

  const handleColorClick = async (color) => {
    if (color === targetColor) {
      const points = isPremiumMode ? 150 : 100;
      setScore(score + points);
      toast.success(`Correct! +${points} points`);
      generateRound();
    } else {
      toast.error('Wrong color!');
    }
  };

  const endGame = async () => {
    setGameState('finished');

    try {
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'color-match',
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
    setGameState('menu');
    setScore(0);
    setTimeLeft(30);
    setIsPremiumMode(false);
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/games'}
                  className="mb-4"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>

                <h1 className="text-4xl font-bold mb-2">🎨 Color Match</h1>
                <p className="text-gray-600">Match colors before time runs out!</p>
              </div>

              <AdSlot position="banner" gameId="color-match" className="mb-8" />

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
                      <li>• 30 seconds timer</li>
                      <li>• 100 points per match</li>
                      <li>• Local leaderboard</li>
                    </ul>
                    <Button onClick={() => startGame(false)} className="w-full">
                      Play Free Mode
                    </Button>
                  </CardContent>
                </Card>

                <PaywallGate
                  isBlocked={userSession.plan === 'FREE'}
                  requiredPlan="PRO"
                  feature="Premium Color Match"
                  gameId="color-match"
                >
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        Premium Mode
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4 text-sm">
                        <li>• 45 seconds timer</li>
                        <li>• 150 points per match</li>
                        <li>• Global leaderboard access</li>
                      </ul>
                      <Button
                        onClick={() => startGame(true)}
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        Play Premium Mode
                      </Button>
                    </CardContent>
                  </Card>
                </PaywallGate>
              </div>
            </div>

            <div className="space-y-6">
              <UpsellSidebar
                userPlan={userSession.plan}
                gameId="color-match"
                context="game_page"
              />

              <Leaderboard
                gameId="color-match"
                userPlan={userSession.plan}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">🎨 Color Match</h1>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timeLeft}s
                </Badge>
                <Badge className="bg-blue-600">
                  Score: {score.toLocaleString()}
                </Badge>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-4">Match this color:</h3>
                <div
                  className="w-32 h-32 mx-auto rounded-lg shadow-lg"
                  style={{ backgroundColor: targetColor }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {colorOptions.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleColorClick(color)}
                    className="h-24 rounded-lg shadow-md hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="outline" onClick={resetGame}>
              <Home className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className="text-3xl">Game Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 mb-8">
                {score.toLocaleString()} Points
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button onClick={resetGame} size="lg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/games'}
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  More Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
