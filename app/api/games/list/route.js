export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { GAMES, EXTREME_GAME } from '@/lib/games';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { generateCorrelationId } from '@/lib/metrics';

export async function GET(request) {
  const correlationId = generateCorrelationId();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const allGames = [...GAMES, EXTREME_GAME];
    
    const gamesWithAccess = allGames.map(game => ({
      ...game,
      isEnabled: isFeatureEnabled(game.flag, userId),
      accessLevel: game.isPremium ? 'premium' : 'free'
    }));
    
    return NextResponse.json({
      success: true,
      games: gamesWithAccess,
      correlationId
    });
    
  } catch (error) {
    console.error('Error fetching games list:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch games list',
      correlationId
    }, { status: 500 });
  }
}