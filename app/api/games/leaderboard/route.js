import { NextResponse } from 'next/server';
import { generateCorrelationId } from '@/lib/metrics';

// Mock score storage (replace with database in production)
const mockScores = [
  { id: '1', gameId: 'emoji-charades', userId: 'user1', name: 'Alex', score: 1250, timestamp: new Date('2025-01-15') },
  { id: '2', gameId: 'emoji-charades', userId: 'user2', name: 'Sam', score: 980, timestamp: new Date('2025-01-14') },
  { id: '3', gameId: 'emoji-charades', userId: null, name: 'Anonymous', score: 750, timestamp: new Date('2025-01-13') },
  { id: '4', gameId: 'fast-math', userId: 'user1', name: 'Alex', score: 2100, timestamp: new Date('2025-01-15') },
  { id: '5', gameId: 'fast-math', userId: 'user3', name: 'Jordan', score: 1850, timestamp: new Date('2025-01-14') }
];

export async function GET(request) {
  const correlationId = generateCorrelationId();
  
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const scope = searchParams.get('scope') || 'local';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!gameId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: gameId',
        correlationId
      }, { status: 400 });
    }
    
    let scores = mockScores.filter(score => score.gameId === gameId);
    
    // For demo purposes, local and global return same data
    // In production, implement proper scoping logic
    
    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);
    
    // Limit results
    scores = scores.slice(0, limit);
    
    return NextResponse.json({
      success: true,
      scores,
      scope,
      correlationId
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leaderboard',
      correlationId
    }, { status: 500 });
  }
}