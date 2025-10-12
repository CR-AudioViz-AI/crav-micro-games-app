'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Star, ArrowRight } from 'lucide-react';
import { metrics } from '@/lib/metrics';

export default function UpsellSidebar({ 
  userPlan = 'FREE', 
  gameId = null,
  context = 'sidebar',
  className = '' 
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || userPlan === 'ELITE') return null;

  const handleUpsellClick = (productId, plan) => {
    metrics.upsellViewed(productId, context);
    // Redirect to pricing or checkout
    window.location.href = `/pricing?plan=${plan}&game=${gameId}`;
  };

  const upsells = {
    FREE: [
      {
        id: 'pro_upgrade',
        plan: 'PRO',
        title: 'Upgrade to Pro',
        price: '$9.99',
        icon: <Zap className="w-5 h-5" />,
        features: ['Premium game modes', 'Global leaderboards', 'Streak multipliers'],
        highlight: 'Most Popular'
      },
      {
        id: 'elite_upgrade', 
        plan: 'ELITE',
        title: 'Go Elite',
        price: '$19.99',
        icon: <Crown className="w-5 h-5" />,
        features: ['All Pro features', 'Extreme games', 'Season Pass'],
        highlight: 'Best Value'
      }
    ],
    PRO: [
      {
        id: 'elite_upgrade',
        plan: 'ELITE', 
        title: 'Upgrade to Elite',
        price: '$10.00',
        icon: <Crown className="w-5 h-5" />,
        features: ['Extreme game access', 'Season Pass', 'Exclusive events'],
        highlight: 'Unlock Everything'
      }
    ]
  };

  const availableUpsells = upsells[userPlan] || [];

  return (
    <div className={`space-y-4 ${className}`}>
      {availableUpsells.map((upsell) => (
        <Card key={upsell.id} className="relative overflow-hidden border-2 border-dashed border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
          {upsell.highlight && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
              {upsell.highlight}
            </Badge>
          )}
          
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {upsell.icon}
              {upsell.title}
            </CardTitle>
            <div className="text-2xl font-bold text-green-600">{upsell.price}</div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <ul className="space-y-2 mb-4">
              {upsell.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button 
              onClick={() => handleUpsellClick(upsell.id, upsell.plan)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(false)}
        className="w-full text-gray-500 hover:text-gray-700"
      >
        Hide suggestions
      </Button>
    </div>
  );
}