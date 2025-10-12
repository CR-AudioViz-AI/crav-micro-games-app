export type Provider = 'stripe' | 'paypal';
export type CheckoutBody = { productId: string; plan?: 'PRO'|'ELITE'; provider: Provider; returnUrl?: string; };

export async function createCheckoutSession(body: CheckoutBody): Promise<{ url: string }> {
  const u = body.returnUrl || '/games';
  return { url: u + '?checkout=mock&product=' + encodeURIComponent(body.productId) + '&provider=' + body.provider };
}
