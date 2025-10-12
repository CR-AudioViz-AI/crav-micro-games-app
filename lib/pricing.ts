import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'pro_upgrade',
    code: 'PRO_UPGRADE',
    name: 'Pro Upgrade',
    price: 9.99,
    currency: 'USD',
    description: 'Unlock premium game modes, global leaderboards, and cosmetics'
  },
  {
    id: 'elite_upgrade',
    code: 'ELITE_UPGRADE', 
    name: 'Elite Upgrade',
    price: 19.99,
    currency: 'USD',
    description: 'All Pro features plus Extreme game access and Season Pass'
  },
  {
    id: 'season_pass',
    code: 'SEASON_PASS',
    name: 'Season Pass',
    price: 14.99,
    currency: 'USD',
    description: 'Access to Extreme game seasons, events, and exclusive content'
  },
  {
    id: 'cosmetic_pack',
    code: 'COSMETIC_PACK',
    name: 'Cosmetic Pack',
    price: 4.99,
    currency: 'USD',
    description: 'Unlock exclusive skins, themes, and visual customizations'
  },
  {
    id: 'credit_topup',
    code: 'CREDIT_TOPUP',
    name: 'Credit Top-up',
    price: 2.99,
    currency: 'USD',
    description: '100 game credits for premium challenges'
  }
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(product => product.id === id);
}

export function getProductByCode(code: string): Product | undefined {
  return PRODUCTS.find(product => product.code === code);
}

export const PLAN_FEATURES = {
  FREE: [
    'All micro-games playable',
    'Local leaderboards',
    'Basic game modes',
    'Limited premium trials'
  ],
  PRO: [
    'All FREE features',
    'Premium game modes',
    'Global leaderboards', 
    'Streak multipliers',
    'Weekly ladders',
    'Cosmetic unlocks'
  ],
  ELITE: [
    'All PRO features',
    'Extreme game access',
    'Season Pass included',
    'Events and clans',
    'Priority support',
    'Exclusive content'
  ]
};