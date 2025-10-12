import { NextResponse } from 'next/server';
import { generateCorrelationId, metrics } from '@/lib/metrics';
import { grantEntitlement } from '@/lib/entitlements';
import { getProductById } from '@/lib/pricing';

export async function POST(request) {
  const correlationId = generateCorrelationId();
  
  try {
    const body = await request.json();
    const { type, data } = body;
    
    // Mock webhook processing (replace with actual Stripe webhook verification)
    if (type === 'checkout.session.completed') {
      const session = data.object;
      const productId = session.metadata?.productId;
      const userId = session.metadata?.userId;
      
      if (productId && userId) {
        const product = getProductById(productId);
        
        if (product) {
          // Grant appropriate entitlement based on product
          switch (product.code) {
            case 'PRO_UPGRADE':
              grantEntitlement(userId, 'PRO');
              break;
            case 'ELITE_UPGRADE':
              grantEntitlement(userId, 'ELITE');
              break;
            case 'SEASON_PASS':
              grantEntitlement(userId, 'SEASON_PASS');
              break;
            case 'COSMETIC_PACK':
              grantEntitlement(userId, 'COSMETICS');
              break;
            case 'CREDIT_TOPUP':
              grantEntitlement(userId, 'CREDITS', '100');
              break;
          }
          
          // Track successful checkout
          metrics.checkoutSucceeded(productId, 'stripe', userId);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      received: true,
      correlationId
    });
    
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process webhook',
      correlationId
    }, { status: 500 });
  }
}