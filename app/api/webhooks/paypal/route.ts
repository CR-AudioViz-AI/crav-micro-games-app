import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const payload = await req.text();
  console.log('[paypal.webhook] payload length', payload.length);
  return NextResponse.json({ ok: true }, { status: 200 });
}
