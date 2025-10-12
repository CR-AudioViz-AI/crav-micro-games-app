import { NextResponse } from 'next/server';
import { generateCorrelationId } from '@/lib/metrics';
import { getUserEntitlements, getUserPlan } from '@/lib/entitlements';

export async function GET(request) {
  const correlationId = generateCorrelationId();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: userId',
        correlationId
      }, { status: 400 });
    }
    
    const entitlements = getUserEntitlements(userId);
    const plan = getUserPlan(userId);
    
    return NextResponse.json({
      success: true,
      userId,
      plan,
      entitlements,
      correlationId
    });
    
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch entitlements',
      correlationId
    }, { status: 500 });
  }
}