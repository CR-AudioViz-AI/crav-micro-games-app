import { NextResponse } from 'next/server';
import { getEntitlements } from '@/lib/entitlements';

export async function GET() {
  const ent = await getEntitlements();
  return NextResponse.json(ent, { status: 200 });
}
