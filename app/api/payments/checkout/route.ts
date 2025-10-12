import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/payments';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = await createCheckoutSession(body);
    return NextResponse.json({ url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'checkout_failed' }, { status: 400 });
  }
}
