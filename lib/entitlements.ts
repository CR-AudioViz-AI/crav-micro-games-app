export type Entitlement =
  | 'FREE'
  | 'PRO'
  | 'ELITE'
  | `GAME:${string}`
  | 'SEASON_PASS';

export type EntitlementsState = {
  userId?: string | null;
  plan: 'FREE' | 'PRO' | 'ELITE';
  grants: Entitlement[];
};

export async function getEntitlements(_req?: Request): Promise<EntitlementsState> {
  return { userId: null, plan: 'FREE', grants: ['FREE'] };
}

export function hasEntitlement(state: EntitlementsState, need: Entitlement): boolean {
  if (need === 'FREE') return true;
  if (state.plan === 'ELITE') return true;
  if (state.plan === 'PRO' && (need === 'PRO' || need === 'SEASON_PASS')) return true;
  return state.grants.includes(need);
}
