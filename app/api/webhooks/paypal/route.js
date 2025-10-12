import { NextResponse } from 'next/server';
import { generateCorrelationId, metrics } from '@/lib/metrics';
import { grantEntitlement } from '@/lib/entitlements';
import { getProductById } from '@/lib/pricing';

export async function POST(request) {
  const correlationId = generateCorrelationId();
  
  try {
    const body = await request.json();
    const { event_type, resource } = body;
    
    // Mock webhook processing (replace with actual PayPal webhook verification)
    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const productId = resource.custom_id;
      const userId = resource.payer?.payer_id;
      
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
          metrics.checkoutSucceeded(productId, 'paypal', userId);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      received: true,
      correlationId
    });
    
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process webhook',
      correlationId
    }, { status: 500 });
  }
}