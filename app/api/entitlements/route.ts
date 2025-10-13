import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest){
  const plan = req.cookies.get('crav_plan')?.value || 'FREE';
  const credits = parseInt(req.cookies.get('crav_credits')?.value || '0', 10);
  const termEnd = req.cookies.get('crav_term_end')?.value || '';
  const cancelAtPeriodEnd = req.cookies.get('crav_cancel')?.value === '1';
  const isAdmin = req.cookies.get('crav_admin')?.value === '1';
  return NextResponse.json({ plan, credits, termEnd, cancelAtPeriodEnd, isAdmin });
}
