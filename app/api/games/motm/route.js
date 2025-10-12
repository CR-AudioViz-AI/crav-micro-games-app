import { NextResponse } from 'next/server';
import { generateCorrelationId } from '@/lib/metrics';
import motmData from '@/content/games_motm.json';

export async function GET() {
  const correlationId = generateCorrelationId();
  
  try {
    const currentDate = new Date();
    const startDate = new Date(motmData.startDate);
    const endDate = new Date(motmData.endDate);
    
    const isActive = currentDate >= startDate && currentDate <= endDate;
    
    return NextResponse.json({
      success: true,
      motm: {
        ...motmData,
        isActive,
        daysRemaining: isActive ? Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24)) : 0
      },
      correlationId
    });
    
  } catch (error) {
    console.error('Error fetching MOTM:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Game of the Month',
      correlationId
    }, { status: 500 });
  }
}