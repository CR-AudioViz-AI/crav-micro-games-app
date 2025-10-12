import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Crown, Star, Gamepad2, Users, Trophy, Zap } from 'lucide-react';
import AdSlot from '@/components/games/AdSlot';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Gamepad2 className="w-12 h-12" />
              <h1 className="text-5xl font-bold">CRAudioVizAI Games</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              25+ micro-games, premium challenges, and exclusive Extreme modes. 
              Play for free or upgrade for the ultimate gaming experience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/games'}
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Play Now - Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = '/pricing'}
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
              >
                <Crown className="w-5 h-5 mr-2" />
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Always Free Games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Play 15+ games completely free, no account required. Perfect for quick entertainment.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Premium Modes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Unlock advanced features, global leaderboards, and exclusive game modes with Pro.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Extreme Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Elite members get access to season-based Extreme games with events and exclusive content.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ad Slot */}
        <AdSlot position="banner" className="mb-16" />

        {/* Game Categories Preview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Game Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Puzzle Games', icon: '🧩', count: 6 },
              { name: 'Brain Training', icon: '🧠', count: 5 },
              { name: 'Word Games', icon: '📝', count: 4 },
              { name: 'Reflex Games', icon: '⚡', count: 3 },
              { name: 'Social Games', icon: '👥', count: 5 },
              { name: 'Classic Games', icon: '🎯', count: 2 },
              { name: 'Visual Games', icon: '👁️', count: 3 },
              { name: 'Extreme', icon: '🔥', count: 1 }
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} games</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">By the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Total Games</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Always Free</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10+</div>
              <div className="text-gray-600">Premium Games</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">1</div>
              <div className="text-gray-600">Extreme Challenge</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start with free games or upgrade for the complete experience
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/games'}
              className="text-lg px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              Browse All Games
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/pricing'}
              className="text-lg px-8 py-3"
            >
              <Crown className="w-5 h-5 mr-2" />
              See Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
