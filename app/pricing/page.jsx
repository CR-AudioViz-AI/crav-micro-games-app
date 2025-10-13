'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, Chrome as Home, CreditCard } from 'lucide-react';
import { PRODUCTS, PLAN_FEATURES } from '@/lib/pricing';
import { metrics } from '@/lib/metrics';

import AdSlot from '@/components/games/AdSlot';
import { toast } from 'sonner';

export default function Pricing() {
  const [userSession] = useState({ userId: null, plan: "FREE" });
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (productId, planName) => {
    setLoading(productId);
    
    try {
      metrics.upsellViewed(productId, 'pricing_page', userSession.userId);
      
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          plan: planName,
          provider: 'stripe',
          userId: userSession.userId || 'anonymous'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // In a real app, redirect to Stripe checkout
        toast.success('Redirecting to checkout...');
        // window.location.href = data.checkoutUrl;
        
        // For demo, simulate successful purchase
        setTimeout(() => {
          toast.success('Purchase successful! (Demo mode)');
          setLoading(null);
        }, 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  const plans = [
    {
      name: 'FREE',
      title: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for casual gaming',
      features: PLAN_FEATURES.FREE,
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      popular: false,
      icon: <Star className="w-6 h-6" />
    },
    {
      name: 'PRO',
      title: 'Pro',
      price: '$9.99',
      period: 'annual',
      description: 'Unlock premium features',
      features: PLAN_FEATURES.PRO,
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default',
      popular: true,
      icon: <Zap className="w-6 h-6" />,
      productId: 'pro_upgrade'
    },
    {
      name: 'ELITE',
      title: 'Elite',
      price: '$19.99',
      period: 'annual',
      description: 'The ultimate gaming experience',
      features: PLAN_FEATURES.ELITE,
      buttonText: 'Go Elite',
      buttonVariant: 'default',
      popular: false,
      icon: <Crown className="w-6 h-6" />,
      productId: 'elite_upgrade'
    }
  ];

  const addOns = [
    {
      ...PRODUCTS.find(p => p.id === 'season_pass'),
      icon: '🎫',
      features: ['Access to Extreme games', 'Seasonal events', 'Exclusive rewards']
    },
    {
      ...PRODUCTS.find(p => p.id === 'cosmetic_pack'),
      icon: '🎨',
      features: ['Exclusive skins', 'Custom themes', 'Visual effects']
    },
    {
      ...PRODUCTS.find(p => p.id === 'credit_topup'),
      icon: '💰',
      features: ['100 game credits', 'Premium challenges', 'Bonus rounds']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/games'}
                className="mb-4"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
              <p className="text-gray-600 mt-1">Unlock premium features and exclusive content</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Plan</div>
              <Badge className="bg-blue-100 text-blue-800">
                {userSession.plan}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''
              } ${userSession.plan === plan.name ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  plan.name === 'FREE' ? 'bg-gray-100 text-gray-600' :
                  plan.name === 'PRO' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <div className="text-sm text-gray-600">{plan.period}</div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full"
                  variant={plan.buttonVariant}
                  disabled={userSession.plan === plan.name || loading === plan.productId}
                  onClick={() => plan.productId && handleUpgrade(plan.productId, plan.name)}
                >
                  {loading === plan.productId ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ad Slot */}
        <AdSlot position="banner" className="mb-16" />

        {/* Add-ons */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Add-ons & Extras</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <Card key={addon.id}>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{addon.icon}</div>
                  <CardTitle>{addon.name}</CardTitle>
                  <div className="text-2xl font-bold text-green-600">
                    ${addon.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{addon.description}</p>
                  <ul className="space-y-2 mb-6">
                    {addon.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={loading === addon.id}
                    onClick={() => handleUpgrade(addon.id, 'addon')}
                  >
                    {loading === addon.id ? 'Processing...' : 'Purchase'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  We accept all major credit cards through Stripe and PayPal payments.
                </p>
                
                <h4 className="font-semibold mb-2">Can I upgrade or downgrade anytime?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! You can upgrade to a higher plan anytime. Downgrades take effect at the end of your billing period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is there a  guarantee?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Yes, we offer a 30-day  guarantee on all plans.
                </p>
                
                <h4 className="font-semibold mb-2">Do I keep my progress if I upgrade?</h4>
                <p className="text-gray-600 text-sm">
                  Absolutely! All your scores, achievements, and progress are preserved when you upgrade.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}