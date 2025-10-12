'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Trophy, Chrome as Home, RotateCcw } from 'lucide-react';
import { metrics } from '@/lib/metrics';

import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import PaywallGate from '@/components/games/PaywallGate';
import Leaderboard from '@/components/games/Leaderboard';
import { toast } from 'sonner';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

export default function MemoryFlip() {
  const [userSession] = useState({ userId: null, plan: "FREE" });
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
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

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      setMoves(moves + 1);

      if (cards[first] === cards[second]) {
        setMatchedPairs([...matchedPairs, cards[first]]);
        const points = isPremiumMode ? 200 : 100;
        setScore(score + points);
        toast.success(`Match! +${points} points`);
        setFlippedIndices([]);

        if (matchedPairs.length + 1 === 8) {
          setTimeout(() => endGame(), 500);
        }
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  }, [flippedIndices]);

  const startGame = (premium = false) => {
    if (premium && userSession.plan === 'FREE') {
      toast.error('Premium mode requires Pro or Elite plan');
      return;
    }

    const emojiSet = EMOJIS;
    const gameCards = [...emojiSet, ...emojiSet].sort(() => Math.random() - 0.5);

    setIsPremiumMode(premium);
    setGameState('playing');
    setScore(0);
    setMoves(0);
    setTimeLeft(premium ? 90 : 60);
    setCards(gameCards);
    setFlippedIndices([]);
    setMatchedPairs([]);

    metrics.playStarted('memory-flip', userSession.userId);
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index])) return;

    setFlippedIndices([...flippedIndices, index]);
  };

  const endGame = async () => {
    setGameState('finished');

    try {
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'memory-flip',
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
    setMoves(0);
    setTimeLeft(60);
    setCards([]);
    setFlippedIndices([]);
    setMatchedPairs([]);
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

                <h1 className="text-4xl font-bold mb-2">🃏 Memory Flip</h1>
                <p className="text-gray-600">Classic memory card matching game</p>
              </div>

              <AdSlot position="banner" gameId="memory-flip" className="mb-8" />

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
                      <li>• 60 seconds timer</li>
                      <li>• 8 pairs to match</li>
                      <li>• 100 points per match</li>
                      <li>• Track your moves</li>
                    </ul>
                    <Button onClick={() => startGame(false)} className="w-full">
                      Play Free Mode
                    </Button>
                  </CardContent>
                </Card>

                <PaywallGate
                  isBlocked={userSession.plan === 'FREE'}
                  requiredPlan="PRO"
                  feature="Premium Memory Flip"
                  gameId="memory-flip"
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
                        <li>• 90 seconds timer</li>
                        <li>• 8 pairs to match</li>
                        <li>• 200 points per match</li>
                        <li>• Global leaderboard</li>
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

              <Card>
                <CardHeader>
                  <CardTitle>How to Play</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Click cards to flip them over</p>
                    <p>• Find matching pairs of cards</p>
                    <p>• Complete all pairs before time runs out</p>
                    <p>• Use fewer moves for a better score!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <UpsellSidebar
                userPlan={userSession.plan}
                gameId="memory-flip"
                context="game_page"
              />
              <Leaderboard
                gameId="memory-flip"
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
              <h1 className="text-2xl font-bold">🃏 Memory Flip</h1>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timeLeft}s
                </Badge>
                <Badge className="bg-blue-600">
                  Score: {score.toLocaleString()}
                </Badge>
                <Badge variant="secondary">
                  Moves: {moves}
                </Badge>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {cards.map((emoji, index) => {
                  const isFlipped = flippedIndices.includes(index);
                  const isMatched = matchedPairs.includes(emoji);

                  return (
                    <button
                      key={index}
                      onClick={() => handleCardClick(index)}
                      disabled={isMatched}
                      className={`aspect-square rounded-lg text-4xl font-bold transition-all duration-300 ${
                        isFlipped || isMatched
                          ? 'bg-white border-2 border-blue-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } ${isMatched ? 'opacity-50' : ''}`}
                    >
                      {isFlipped || isMatched ? emoji : '?'}
                    </button>
                  );
                })}
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Matched: {matchedPairs.length} / 8
                </p>
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
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {score.toLocaleString()} Points
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div>
                  <div className="text-2xl font-bold">{moves}</div>
                  <div className="text-gray-600">Total Moves</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{matchedPairs.length}</div>
                  <div className="text-gray-600">Pairs Matched</div>
                </div>
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
