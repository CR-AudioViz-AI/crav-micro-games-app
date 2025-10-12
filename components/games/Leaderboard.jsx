'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, Globe, MapPin, Crown } from 'lucide-react';

export default function Leaderboard({ 
  gameId,
  userPlan = 'FREE',
  currentScore = null,
  className = ''
}) {
  const [localScores, setLocalScores] = useState([]);
  const [globalScores, setGlobalScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboards();
  }, [gameId]);

  const loadLeaderboards = async () => {
    setLoading(true);
    try {
      // Load local leaderboard
      const localResponse = await fetch(`/api/games/leaderboard?gameId=${gameId}&scope=local`);
      const localData = await localResponse.json();
      setLocalScores(localData.scores || []);

      // Load global leaderboard (if user has access)
      if (userPlan !== 'FREE') {
        const globalResponse = await fetch(`/api/games/leaderboard?gameId=${gameId}&scope=global`);
        const globalData = await globalResponse.json();
        setGlobalScores(globalData.scores || []);
      }
    } catch (error) {
      console.error('Failed to load leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const ScoreList = ({ scores, type }) => (
    <div className="space-y-2">
      {scores.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No scores yet. Be the first!</p>
        </div>
      ) : (
        scores.map((score, index) => (
          <div 
            key={score.id} 
            className={`flex items-center gap-3 p-3 rounded-lg ${
              currentScore && score.score === currentScore ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0">
              {getRankIcon(index + 1)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{score.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(score.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{score.score.toLocaleString()}</div>
              {type === 'global' && (
                <Badge variant="outline" className="text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  Global
                </Badge>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="local" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="local" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Local
            </TabsTrigger>
            <TabsTrigger 
              value="global" 
              disabled={userPlan === 'FREE'}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Global
              {userPlan === 'FREE' && <Crown className="w-3 h-3 text-yellow-500" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="local" className="mt-4">
            <ScoreList scores={localScores} type="local" />
          </TabsContent>
          
          <TabsContent value="global" className="mt-4">
            {userPlan === 'FREE' ? (
              <div className="text-center py-8">
                <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-semibold mb-2">Global Leaderboard</h3>
                <p className="text-gray-600 mb-4">
                  Compete with players worldwide! Upgrade to Pro or Elite to access global rankings.
                </p>
                <Button onClick={() => window.location.href = '/pricing'}>
                  Upgrade Now
                </Button>
              </div>
            ) : (
              <ScoreList scores={globalScores} type="global" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}