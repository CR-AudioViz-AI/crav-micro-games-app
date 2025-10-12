'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, Star, X } from 'lucide-react';
import { metrics } from '@/lib/metrics';

export default function PaywallGate({ 
  isBlocked = false,
  requiredPlan = 'PRO',
  feature = 'Premium Feature',
  gameId = null,
  children,
  className = ''
}) {
  const [showUpgrade, setShowUpgrade] = useState(isBlocked);

  if (!isBlocked) {
    return <div className={className}>{children}</div>;
  }

  const handleUpgradeClick = (productId) => {
    metrics.upsellViewed(productId, 'paywall_gate', gameId);
    window.location.href = `/pricing?plan=${requiredPlan}&feature=${feature}`;
  };

  const planDetails = {
    PRO: {
      id: 'pro_upgrade',
      title: 'Upgrade to Pro',
      price: '$9.99',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: ['Premium game modes', 'Global leaderboards', 'Streak multipliers', 'Weekly challenges']
    },
    ELITE: {
      id: 'elite_upgrade',
      title: 'Upgrade to Elite', 
      price: '$19.99',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      features: ['All Pro features', 'Extreme games', 'Season Pass', 'Exclusive events', 'Priority support']
    }
  };

  const plan = planDetails[requiredPlan] || planDetails.PRO;

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content behind paywall */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Paywall overlay */}
      {showUpgrade && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <Card className="max-w-md w-full mx-4 border-2 shadow-xl">
            <CardHeader className="text-center relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgrade(false)}
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mb-4`}>
                {plan.icon}
              </div>
              
              <CardTitle className="text-xl mb-2">
                <Lock className="w-5 h-5 inline mr-2" />
                Premium Feature Locked
              </CardTitle>
              
              <Badge variant="secondary" className="mb-2">
                Requires {requiredPlan} Plan
              </Badge>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Unlock <strong>{feature}</strong> and many more premium features
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">{plan.title}</h4>
                <div className="text-3xl font-bold text-green-600 mb-3">{plan.price}</div>
                
                <ul className="text-sm space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                onClick={() => handleUpgradeClick(plan.id)}
                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3`}
              >
                {plan.title} - {plan.price}
              </Button>
              
              <p className="text-xs text-gray-500 mt-3">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}