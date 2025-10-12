'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, Crown, Play, Gamepad2 } from 'lucide-react';
import { GAMES, EXTREME_GAME } from '@/lib/games';
import { createUserSession } from '@/lib/entitlements';
import GameCard from '@/components/games/GameCard';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import motmData from '@/content/games_motm.json';

export default function GamesHub() {
  const [games, setGames] = useState(GAMES);
  const [filteredGames, setFilteredGames] = useState(GAMES);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [userSession, setUserSession] = useState(createUserSession());

  useEffect(() => {
    filterGames();
  }, [searchTerm, categoryFilter, difficultyFilter, games]);

  const filterGames = () => {
    let filtered = games;

    if (searchTerm) {
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(game => game.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(game => game.difficulty === difficultyFilter);
    }

    setFilteredGames(filtered);
  };

  const categories = [...new Set(games.map(game => game.category))];
  const freeGames = filteredGames.filter(game => !game.isPremium);
  const premiumGames = filteredGames.filter(game => game.isPremium);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Gamepad2 className="w-8 h-8 text-blue-600" />
                CRAudioVizAI Games
              </h1>
              <p className="text-gray-600 mt-1">75 games plus 50+ challenging add-ons and exclusive Extreme challenges</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/games-addons'}
              >
                <Star className="w-4 h-4 mr-2" />
                50+ Add-Ons
              </Button>
              <Badge variant="outline" className="text-sm">
                Plan: {userSession.plan}
              </Badge>
              {userSession.plan === 'FREE' && (
                <Button onClick={() => window.location.href = '/pricing'}>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Game of the Month */}
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="w-6 h-6" />
                  {motmData.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-purple-100 mb-4">{motmData.description}</p>
                    <ul className="space-y-2 mb-6">
                      {motmData.features.map((feature, index) => (
                        <li key={index} className="text-sm text-purple-100">{feature}</li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => window.location.href = `/${motmData.gameSlug}`}
                      className="bg-white text-purple-600 hover:bg-purple-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play Now
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <img 
                      src={motmData.imageUrl} 
                      alt="Game of the Month"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad Slot */}
            <AdSlot position="banner" />

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Find Your Perfect Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search games..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                      setDifficultyFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Games Grid */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Games ({filteredGames.length})</TabsTrigger>
                <TabsTrigger value="free">
                  Always Free ({freeGames.length})
                </TabsTrigger>
                <TabsTrigger value="premium">
                  Premium ({premiumGames.length})
                  <Star className="w-4 h-4 ml-1 text-yellow-500" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      userPlan={userSession.plan}
                      userId={userSession.userId}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="free" className="mt-6">
                <div className="mb-4">
                  <Badge className="bg-green-100 text-green-800">
                    Always Free - No Account Required
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {freeGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      userPlan={userSession.plan}
                      userId={userSession.userId}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="premium" className="mt-6">
                <div className="mb-4">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Premium Games - Upgrade Required
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {premiumGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      userPlan={userSession.plan}
                      userId={userSession.userId}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Extreme Game Section */}
            <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Crown className="w-7 h-7" />
                  Extreme Challenge: {EXTREME_GAME.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-100 mb-4">{EXTREME_GAME.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-white/20 text-white">Season-based</Badge>
                  <Badge className="bg-white/20 text-white">Elite Exclusive</Badge>
                  <Badge className="bg-white/20 text-white">Leaderboards</Badge>
                  <Badge className="bg-white/20 text-white">Events</Badge>
                </div>
                {userSession.plan === 'ELITE' ? (
                  <Button 
                    onClick={() => window.location.href = '/extreme/ascension'}
                    className="bg-white text-red-600 hover:bg-red-50"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Enter Ascension
                  </Button>
                ) : (
                  <Button 
                    onClick={() => window.location.href = '/pricing'}
                    className="bg-white text-red-600 hover:bg-red-50"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Elite
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Footer Ad */}
            <AdSlot position="footer" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UpsellSidebar 
              userPlan={userSession.plan}
              context="games_hub"
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Games</span>
                  <span className="font-semibold">{GAMES.length + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Always Free</span>
                  <span className="font-semibold text-green-600">{freeGames.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium</span>
                  <span className="font-semibold text-yellow-600">{premiumGames.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Plan</span>
                  <Badge variant="outline">{userSession.plan}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}