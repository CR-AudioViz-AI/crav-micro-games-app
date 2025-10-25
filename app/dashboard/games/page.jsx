'use client';

import GamesQuickStats from "@/components/games/GamesQuickStats";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, ChartBar as BarChart3, Users, Trophy, Crown, Play, Eye, EyeOff, TrendingUp, Calendar } from 'lucide-react';
import { GAMES, EXTREME_GAME } from '@/lib/games';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import GamesStats from '@/components/games/GamesStats';

export default function GamesDashboard() {
  const [userSession] = useState({ userId: null, plan: "FREE" });
  const [games, setGames] = useState([...GAMES, EXTREME_GAME]);
  const [flags, setFlags] = useState(FEATURE_FLAGS);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    // Mock metrics data (replace with real API calls)
    const mockMetrics = {
      totalPlays: 15420,
      totalPlayers: 3240,
      avgSessionTime: '4.2 min',
      topGame: 'emoji-charades',
      conversionRate: '12.3%'
    };
    setMetrics(mockMetrics);
  };

  const toggleFlag = (flagKey) => {
    setFlags(prev => ({
      ...prev,
      [flagKey]: {
        ...prev[flagKey],
        enabled: !prev[flagKey].enabled
      }
    }));
  };

  const getGameMetrics = (gameId) => {
    // Mock game-specific metrics
    return {
      plays: Math.floor(Math.random() * 1000) + 100,
      players: Math.floor(Math.random() * 500) + 50,
      avgScore: Math.floor(Math.random() * 5000) + 1000,
      conversionRate: (Math.random() * 20 + 5).toFixed(1) + '%'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GamesQuickStats />
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="w-8 h-8 text-blue-600" />
                Games Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage games, feature flags, and view analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                Admin: {userSession.plan}
              </Badge>
              <Button onClick={() => window.location.href = '/games'}>
                <Play className="w-4 h-4 mr-2" />
                View Games
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="flags">Feature Flags</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Game Stats - Live from Registry */}
            <div className="mb-8">
              <GamesStats autofill showPerCategory={false} />
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Plays</p>
                      <p className="text-2xl font-bold">{metrics.totalPlays?.toLocaleString()}</p>
                    </div>
                    <Play className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Players</p>
                      <p className="text-2xl font-bold">{metrics.totalPlayers?.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Session</p>
                      <p className="text-2xl font-bold">{metrics.avgSessionTime}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Conversion</p>
                      <p className="text-2xl font-bold">{metrics.conversionRate}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Top Game</p>
                      <p className="text-lg font-bold">Emoji Charades</p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Game Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Games</span>
                      <Badge className="bg-green-100 text-green-800">{games.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Free Games</span>
                      <Badge variant="outline">{games.filter(g => !g.isPremium).length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Games</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{games.filter(g => g.isPremium).length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Enabled Flags</span>
                      <Badge className="bg-green-100 text-green-800">
                        {Object.values(flags).filter(f => f.enabled).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Disabled Flags</span>
                      <Badge variant="outline">
                        {Object.values(flags).filter(f => !f.enabled).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Free Users</span>
                      <Badge variant="outline">2,156</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Pro Users</span>
                      <Badge className="bg-blue-100 text-blue-800">847</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Elite Users</span>
                      <Badge className="bg-purple-100 text-purple-800">237</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="games" className="mt-6">
            <div className="grid gap-4">
              {games.map(game => {
                const gameMetrics = getGameMetrics(game.id);
                const flag = flags[game.flag];
                
                return (
                  <Card key={game.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">
                            {game.category === 'extreme' ? '🔥' : '🎮'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{game.name}</h3>
                            <p className="text-gray-600 text-sm">{game.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge className={
                                game.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {game.difficulty}
                              </Badge>
                              <Badge variant="outline">{game.category}</Badge>
                              {game.isPremium && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right text-sm">
                            <div className="font-semibold">{gameMetrics.plays}</div>
                            <div className="text-gray-600">plays</div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-semibold">{gameMetrics.players}</div>
                            <div className="text-gray-600">players</div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-semibold">{gameMetrics.conversionRate}</div>
                            <div className="text-gray-600">conversion</div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/${game.slug}`}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Play
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="flags" className="mt-6">
            <div className="grid gap-4">
              {Object.entries(flags).map(([key, flag]) => (
                <Card key={key}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{key}</h3>
                        <p className="text-gray-600 text-sm">
                          Rollout: {flag.rollout}% of users
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={flag.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {flag.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFlag(key)}
                        >
                          {flag.enabled ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Enable
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Top Performing Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {games.slice(0, 5).map((game, index) => {
                      const gameMetrics = getGameMetrics(game.id);
                      return (
                        <div key={game.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold">{game.name}</div>
                              <div className="text-sm text-gray-600">{gameMetrics.plays} plays</div>
                            </div>
                          </div>
                          <Badge variant="outline">{gameMetrics.conversionRate}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Revenue Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Pro Upgrades</span>
                      <span className="font-semibold">$8,470</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Elite Upgrades</span>
                      <span className="font-semibold">$4,730</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Season Passes</span>
                      <span className="font-semibold">$3,550</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Add-ons</span>
                      <span className="font-semibold">$1,890</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Total Revenue</span>
                      <span>$18,640</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
