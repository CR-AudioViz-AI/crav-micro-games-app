import { NextResponse } from 'next/server';
import { generateCorrelationId, metrics } from '@/lib/metrics';

// Mock score storage (replace with database in production)
const mockScores = [];

export async function POST(request) {
  const correlationId = generateCorrelationId();
  
  try {
    const body = await request.json();
    const { gameId, score, userId, name } = body;
    
    if (!gameId || typeof score !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: gameId and score',
        correlationId
      }, { status: 400 });
    }
    
    const scoreEntry = {
      id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gameId,
      score,
      userId: userId || null,
      name: name || 'Anonymous',
      timestamp: new Date()
    };
    
    mockScores.push(scoreEntry);
    
    // Track completion event
    metrics.playCompleted(gameId, score, userId);
    
    return NextResponse.json({
      success: true,
      score: scoreEntry,
      correlationId
    });
    
  } catch (error) {
    console.error('Error saving score:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to save score',
      correlationId
    }, { status: 500 });
  }
}