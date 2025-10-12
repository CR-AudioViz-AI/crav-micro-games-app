'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap, Trophy, Home, RotateCcw, Target, Clock, Star } from 'lucide-react';
import { metrics } from '@/lib/metrics';
import { createUserSession, canAccessExtremeGame } from '@/lib/entitlements';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import PaywallGate from '@/components/games/PaywallGate';
import Leaderboard from '@/components/games/Leaderboard';
import { toast } from 'sonner';

const ZONES = [
  { name: 'Meadow', color: 'from-green-400 to-green-600', difficulty: 1, theme: '🌱' },
  { name: 'Forest', color: 'from-green-600 to-green-800', difficulty: 1.2, theme: '🌲' },
  { name: 'Caverns', color: 'from-gray-600 to-gray-800', difficulty: 1.5, theme: '🕳️' },
  { name: 'Mountains', color: 'from-blue-600 to-blue-800', difficulty: 1.8, theme: '⛰️' },
  { name: 'Skyline', color: 'from-purple-600 to-purple-800', difficulty: 2.2, theme: '🏙️' },
  { name: 'Nebula', color: 'from-pink-600 to-purple-800', difficulty: 2.8, theme: '🌌' },
  { name: 'Void', color: 'from-black to-gray-900', difficulty: 3.5, theme: '🌑' }
];

export default function Ascension() {
  const [userSession] = useState(createUserSession());
  const [gameState, setGameState] = useState('menu');
  const [currentZone, setCurrentZone] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [targetPosition, setTargetPosition] = useState(50);
  const [windowPosition, setWindowPosition] = useState(50);
  const [windowSize, setWindowSize] = useState(20);
  const [speed, setSpeed] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [seasonPass, setSeasonPass] = useState(false);

  const canPlay = canAccessExtremeGame(userSession);
  const zone = ZONES[currentZone];

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && isMoving) {
      interval = setInterval(() => {
        setWindowPosition(prev => {
          const newPos = prev + (Math.random() - 0.5) * speed * zone.difficulty;
          return Math.max(0, Math.min(100, newPos));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState, isMoving, speed, zone.difficulty]);

  const startGame = () => {
    if (!canPlay) {
      toast.error('Ascension requires Elite plan or Season Pass');
      return;
    }
    
    setGameState('playing');
    setCurrentZone(0);
    setLevel(1);
    setScore(0);
    setLives(3);
    setTargetPosition(50);
    setWindowPosition(50);
    setWindowSize(20);
    setSpeed(1);
    setIsMoving(true);
    
    metrics.playStarted('extreme-ascension', userSession.userId);
  };

  const handleTap = () => {
    if (gameState !== 'playing') return;
    
    const distance = Math.abs(targetPosition - windowPosition);
    const hitZone = windowSize / 2;
    
    if (distance <= hitZone) {
      // Hit!
      const accuracy = 1 - (distance / hitZone);
      const basePoints = Math.floor(100 * accuracy * zone.difficulty);
      const levelBonus = level * 50;
      const totalPoints = basePoints + levelBonus;
      
      setScore(score + totalPoints);
      setLevel(level + 1);
      
      toast.success(`Perfect! +${totalPoints} points`);
      
      // Increase difficulty
      setSpeed(speed + 0.1);
      setWindowSize(Math.max(10, windowSize - 0.5));
      
      // Check for zone progression
      if (level % 10 === 0 && currentZone < ZONES.length - 1) {
        setCurrentZone(currentZone + 1);
        toast.success(`Entered ${ZONES[currentZone + 1].name}!`);
      }
      
      // Generate new target
      setTargetPosition(Math.random() * 80 + 10);
    } else {
      // Miss!
      setLives(lives - 1);
      toast.error('Missed! Try to hit the moving window');
      
      if (lives <= 1) {
        endGame();
      }
    }
  };

  const endGame = async () => {
    setGameState('finished');
    setIsMoving(false);
    
    try {
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'extreme-ascension',
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
    setIsMoving(false);
  };

  if (!canPlay) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PaywallGate 
            isBlocked={true}
            requiredPlan="ELITE"
            feature="Extreme Ascension Game"
            gameId="extreme-ascension"
          >
            <div className="text-center py-16">
              <Crown className="w-24 h-24 mx-auto mb-6 text-purple-600" />
              <h1 className="text-4xl font-bold mb-4">🔥 Ascension</h1>
              <p className="text-xl text-gray-600">The ultimate extreme challenge awaits...</p>
            </div>
          </PaywallGate>
        </div>
      </div>
    );
  }

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/games'}
                  className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
                
                <h1 className="text-5xl font-bold mb-2 text-white">🔥 Ascension</h1>
                <p className="text-purple-200">The ultimate extreme challenge - Elite exclusive</p>
              </div>

              <AdSlot position="banner" gameId="extreme-ascension" className="mb-8" />

              <Card className="bg-black/50 border-purple-500/50 text-white mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    Season-Based Extreme Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Game Mechanics</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Tap timing vs moving window</li>
                        <li>• Progress through 7 unique zones</li>
                        <li>• Difficulty scales dramatically</li>
                        <li>• 3 lives per attempt</li>
                        <li>• Precision-based scoring</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Elite Features</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Season Pass progression</li>
                        <li>• Exclusive cosmetic rewards</li>
                        <li>• Global extreme leaderboards</li>
                        <li>• Weekly challenge events</li>
                        <li>• Clan competitions</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={startGame}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Begin Ascension
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Zones Preview */}
              <Card className="bg-black/50 border-purple-500/50 text-white">
                <CardHeader>
                  <CardTitle>The Seven Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {ZONES.map((zone, index) => (
                      <div key={zone.name} className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${zone.color} flex items-center justify-center text-2xl mb-2`}>
                          {zone.theme}
                        </div>
                        <div className="text-sm font-semibold">{zone.name}</div>
                        <div className="text-xs text-gray-400">×{zone.difficulty}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <UpsellSidebar 
                userPlan={userSession.plan}
                gameId="extreme-ascension"
                context="extreme_game"
              />
              
              <Leaderboard 
                gameId="extreme-ascension"
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
      <div className={`min-h-screen bg-gradient-to-br ${zone.color}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Game HUD */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 text-white">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {zone.theme} {zone.name}
              </h1>
              <div className="flex items-center gap-4">
                <Badge className="bg-white/20 text-white">
                  Level {level}
                </Badge>
                <Badge className="bg-blue-600">
                  Score: {score.toLocaleString()}
                </Badge>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-6 h-6 rounded-full ${
                        i < lives ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <Progress value={(level % 10) * 10} className="mb-2" />
            <p className="text-sm text-white/80">
              Progress to next zone: {level % 10}/10
            </p>
          </div>

          {/* Game Area */}
          <Card className="bg-black/50 border-white/20 mb-6">
            <CardContent className="p-8">
              <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden">
                {/* Target */}
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-red-500 rounded-full transform -translate-y-1/2 transition-all duration-300"
                  style={{ left: `${targetPosition}%` }}
                >
                  <Target className="w-4 h-4 text-white" />
                </div>
                
                {/* Moving Window */}
                <div 
                  className="absolute top-1/2 h-16 bg-blue-500/50 border-2 border-blue-400 transform -translate-y-1/2 transition-all duration-100"
                  style={{ 
                    left: `${windowPosition - windowSize/2}%`,
                    width: `${windowSize}%`
                  }}
                />
                
                {/* Tap Area */}
                <div 
                  className="absolute inset-0 cursor-pointer flex items-center justify-center"
                  onClick={handleTap}
                >
                  <div className="text-white/50 text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <div>Tap when target is in the blue window!</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={resetGame}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center bg-black/50 border-purple-500/50 text-white">
            <CardHeader>
              <div className="text-6xl mb-4">💀</div>
              <CardTitle className="text-3xl">Ascension Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-400 mb-4">
                {score.toLocaleString()} Points
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-2xl font-bold">{level}</div>
                  <div className="text-gray-400">Levels Reached</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{zone.name}</div>
                  <div className="text-gray-400">Final Zone</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">×{zone.difficulty}</div>
                  <div className="text-gray-400">Difficulty Multiplier</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button 
                  onClick={resetGame} 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Ascend Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/games'}
                  size="lg"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
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