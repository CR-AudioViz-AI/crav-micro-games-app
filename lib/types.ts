export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  flag: string;
  status: 'active' | 'inactive';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  isPremium: boolean;
  createdAt: Date;
}

export interface Score {
  id: string;
  gameId: string;
  userId?: string;
  name: string;
  score: number;
  timestamp: Date;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  currency: string;
  description: string;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  provider: 'stripe' | 'paypal';
  externalId: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface Entitlement {
  id: string;
  userId: string;
  kind: 'PRO' | 'ELITE' | 'SEASON_PASS' | string;
  value: string;
  startsAt: Date;
  endsAt?: Date;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rollout: number;
}

export interface TelemetryEvent {
  id: string;
  kind: string;
  payload: Record<string, any>;
  timestamp: Date;
}

export interface GameOfTheMonth {
  gameSlug: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
}

export type Plan = 'FREE' | 'PRO' | 'ELITE';

export interface UserSession {
  userId?: string;
  plan: Plan;
  entitlements: string[];
}