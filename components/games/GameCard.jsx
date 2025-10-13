'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Play, Star, Clock, Users } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/feature-flags';

export default function GameCard({ 
  game, 
  userPlan = 'FREE',
  userId = null,
  className = '' 
}) {
  const isEnabled = isFeatureEnabled(game.flag, userId);
  const canPlay = isEnabled && (game.isPremium ? userPlan !== 'FREE' : true);
  
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    hard: 'bg-red-100 text-red-800'
  };

  const categoryIcons = {
    puzzle: '🧩',
    brain: '🧠',
    word: '📝',
    visual: '👁️',
    memory: '🧠',
    knowledge: '📚',
    reflex: '⚡',
    audio: '🎵',
    arcade: '🎮',
    social: '👥',
    creative: '🎨',
    classic: '🎯',
    extreme: '🔥'
  };

  if (!isEnabled) {
    return (
      <Card className={`opacity-50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-500">
            <span className="text-2xl">{categoryIcons[game.category] || '🎮'}</span>
            {game.name}
            <Badge variant="secondary">available now</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">{game.description}</p>
          <Button disabled className="w-full">
            available now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[game.category] || '🎮'}</span>
          {game.name}
          {game.isPremium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardTitle>
        <div className="flex gap-2">
          <Badge className={difficultyColors[game.difficulty]}>
            {game.difficulty}
          </Badge>
          <Badge variant="outline">
            {game.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4">{game.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            2-5 min
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Single player
          </div>
        </div>
        
        {canPlay ? (
          <Button 
            onClick={() => window.location.href = `/${game.slug}`}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Play Now
          </Button>
        ) : (
          <div className="space-y-2">
            <Button 
              disabled 
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Premium Required
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/pricing'}
              className="w-full"
            >
              Upgrade to Play
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}