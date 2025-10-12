import { Entitlement, Plan, UserSession } from './types';

// Mock entitlements storage (replace with database in production)
const mockEntitlements: Record<string, Entitlement[]> = {};

export function hasEntitlement(userId: string, kind: string): boolean {
  const userEntitlements = mockEntitlements[userId] || [];
  return userEntitlements.some(ent => 
    ent.kind === kind && 
    ent.startsAt <= new Date() && 
    (!ent.endsAt || ent.endsAt > new Date())
  );
}

export function grantEntitlement(userId: string, kind: string, value: string = '', duration?: number): void {
  if (!mockEntitlements[userId]) {
    mockEntitlements[userId] = [];
  }
  
  const entitlement: Entitlement = {
    id: `ent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    kind,
    value,
    startsAt: new Date(),
    endsAt: duration ? new Date(Date.now() + duration) : undefined
  };
  
  mockEntitlements[userId].push(entitlement);
}

export function getUserPlan(userId?: string): Plan {
  if (!userId) return 'FREE';
  
  if (hasEntitlement(userId, 'ELITE')) return 'ELITE';
  if (hasEntitlement(userId, 'PRO')) return 'PRO';
  return 'FREE';
}

export function getUserEntitlements(userId?: string): string[] {
  if (!userId) return [];
  return (mockEntitlements[userId] || [])
    .filter(ent => 
      ent.startsAt <= new Date() && 
      (!ent.endsAt || ent.endsAt > new Date())
    )
    .map(ent => ent.kind);
}

export function createUserSession(userId?: string): UserSession {
  return {
    userId,
    plan: getUserPlan(userId),
    entitlements: getUserEntitlements(userId)
  };
}

export function canAccessPremiumFeature(session: UserSession, feature: string): boolean {
  return session.plan !== 'FREE' || session.entitlements.includes(feature);
}

export function canAccessExtremeGame(session: UserSession): boolean {
  return session.plan === 'ELITE' || session.entitlements.includes('SEASON_PASS');
}