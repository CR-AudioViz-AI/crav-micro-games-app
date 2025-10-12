'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Trophy, Chrome as Home, RotateCcw } from 'lucide-react';
import { metrics } from '@/lib/metrics';
import { createUserSession } from '@/lib/entitlements';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import PaywallGate from '@/components/games/PaywallGate';
import Leaderboard from '@/components/games/Leaderboard';
import { toast } from 'sonner';

const LETTER_GRIDS = [
  ['C', 'A', 'T', 'S', 'D', 'O', 'G', 'R', 'A'],
  ['B', 'I', 'R', 'D', 'F', 'I', 'S', 'H', 'A'],
  ['T', 'R', 'E', 'E', 'L', 'E', 'A', 'F', 'P'],
  ['S', 'U', 'N', 'M', 'O', 'O', 'N', 'S', 'T'],
  ['B', 'O', 'O', 'K', 'P', 'E', 'N', 'C', 'I']
];

const VALID_WORDS = {
  0: ['CAT', 'CATS', 'DOG', 'RAT', 'SAT', 'COG', 'COT'],
  1: ['BIRD', 'FISH', 'FIR', 'SIR', 'AID', 'RID'],
  2: ['TREE', 'LEAF', 'EEL', 'REAL', 'FEAR', 'FARE'],
  3: ['SUN', 'MOON', 'SOON', 'NUN', 'MOM', 'MUST'],
  4: ['BOOK', 'PEN', 'COOK', 'NOON', 'ICON', 'KEEP']
};

export default function WordSnap() {
  const [userSession] = useState(createUserSession());
  const [gameState, setGameState] = useState('menu');
  const [currentGrid, setCurrentGrid] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userInput, setUserInput] = useState('');
  const [foundWords, setFoundWords] = useState([]);
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
    setCurrentGrid(0);
    setScore(0);
    setTimeLeft(premium ? 90 : 60);
    setUserInput('');
    setFoundWords([]);

    metrics.playStarted('word-snap', userSession.userId);
  };

  const submitWord = () => {
    const word = userInput.toUpperCase().trim();
    const validWords = VALID_WORDS[currentGrid];

    if (word.length < 3) {
      toast.error('Word must be at least 3 letters!');
      return;
    }

    if (foundWords.includes(word)) {
      toast.error('Already found this word!');
      setUserInput('');
      return;
    }

    if (validWords.includes(word)) {
      const points = (isPremiumMode ? 150 : 100) * word.length;
      setScore(score + points);
      setFoundWords([...foundWords, word]);
      toast.success(`Great! +${points} points`);
      setUserInput('');
    } else {
      toast.error('Not a valid word!');
      setUserInput('');
    }
  };

  const nextGrid = () => {
    if (currentGrid < LETTER_GRIDS.length - 1) {
      setCurrentGrid(currentGrid + 1);
      setFoundWords([]);
      setUserInput('');
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setGameState('finished');

    try {
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'word-snap',
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
    setCurrentGrid(0);
    setScore(0);
    setTimeLeft(60);
    setUserInput('');
    setFoundWords([]);
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

                <h1 className="text-4xl font-bold mb-2">📝 Word Snap</h1>
                <p className="text-gray-600">Find words as fast as you can!</p>
              </div>

              <AdSlot position="banner" gameId="word-snap" className="mb-8" />

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
                      <li>• 60 seconds per grid</li>
                      <li>• 100 points per letter</li>
                      <li>• 5 letter grids</li>
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
                  feature="Premium Word Snap"
                  gameId="word-snap"
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
                        <li>• 90 seconds per grid</li>
                        <li>• 150 points per letter</li>
                        <li>• Bonus word hints</li>
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
                    <p>• Look at the 3x3 letter grid</p>
                    <p>• Type words you can form using the letters</p>
                    <p>• Words must be at least 3 letters long</p>
                    <p>• Longer words score more points!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <UpsellSidebar
                userPlan={userSession.plan}
                gameId="word-snap"
                context="game_page"
              />
              <Leaderboard
                gameId="word-snap"
                userPlan={userSession.plan}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const grid = LETTER_GRIDS[currentGrid];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">📝 Word Snap</h1>
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
            <p className="text-sm text-gray-600">Grid {currentGrid + 1} of {LETTER_GRIDS.length}</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
                {grid.map((letter, idx) => (
                  <div
                    key={idx}
                    className="aspect-square flex items-center justify-center bg-blue-100 rounded-lg text-3xl font-bold text-blue-900"
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <div className="max-w-md mx-auto">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && submitWord()}
                  placeholder="Type a word..."
                  className="text-center text-lg mb-4"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={submitWord} className="flex-1">
                    Submit Word
                  </Button>
                  <Button onClick={nextGrid} variant="outline">
                    Next Grid →
                  </Button>
                </div>
              </div>

              {foundWords.length > 0 && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Found Words:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {foundWords.map((word, idx) => (
                      <Badge key={idx} variant="secondary">{word}</Badge>
                    ))}
                  </div>
                </div>
              )}
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

              <div className="mb-8">
                <div className="text-2xl font-bold">{foundWords.length}</div>
                <div className="text-gray-600">Total Words Found</div>
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
