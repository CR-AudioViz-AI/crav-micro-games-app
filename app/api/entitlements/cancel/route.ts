import { NextResponse } from 'next/server';
export async function POST(){
  const res = NextResponse.json({ ok:true, cancel_at_period_end:true });
  res.cookies.set('crav_cancel','1',{ httpOnly:false, sameSite:'lax', path:'/' });
  return res;
}
