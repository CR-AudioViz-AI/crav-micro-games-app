import { TelemetryEvent } from './types';

// Mock telemetry storage (replace with analytics service in production)
const mockEvents: TelemetryEvent[] = [];

export function trackEvent(kind: string, payload: Record<string, any> = {}): void {
  const event: TelemetryEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    kind,
    payload: {
      ...payload,
      timestamp: new Date().toISOString(),
      correlationId: generateCorrelationId()
    },
    timestamp: new Date()
  };
  
  mockEvents.push(event);
  
  // In production, send to analytics service
  console.log('📊 Event tracked:', event);
}

export function generateCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Common event tracking functions
export const metrics = {
  playStarted: (gameId: string, userId?: string) => 
    trackEvent('play_started', { gameId, userId }),
    
  playCompleted: (gameId: string, score: number, userId?: string) => 
    trackEvent('play_completed', { gameId, score, userId }),
    
  upsellViewed: (productId: string, context: string, userId?: string) => 
    trackEvent('upsell_view', { productId, context, userId }),
    
  upsellConverted: (productId: string, context: string, userId?: string) => 
    trackEvent('upsell_convert', { productId, context, userId }),
    
  checkoutStarted: (productId: string, provider: string, userId?: string) => 
    trackEvent('checkout_started', { productId, provider, userId }),
    
  checkoutSucceeded: (productId: string, provider: string, userId?: string) => 
    trackEvent('checkout_succeeded', { productId, provider, userId }),
    
  checkoutFailed: (productId: string, provider: string, error: string, userId?: string) => 
    trackEvent('checkout_failed', { productId, provider, error, userId }),
    
  gameError: (gameId: string, error: string, userId?: string) => 
    trackEvent('game_error', { gameId, error, userId }),
    
  featureFlagViewed: (flagKey: string, enabled: boolean, userId?: string) => 
    trackEvent('feature_flag_viewed', { flagKey, enabled, userId })
};

export function getEventsByKind(kind: string): TelemetryEvent[] {
  return mockEvents.filter(event => event.kind === kind);
}

export function getEventsByUser(userId: string): TelemetryEvent[] {
  return mockEvents.filter(event => event.payload.userId === userId);
}