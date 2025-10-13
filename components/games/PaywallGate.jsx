'use client';
import React from 'react';
export default function PaywallGate({ requirePlan='PRO', mode='premium', children }) {
  const [ent,setEnt]=React.useState({loading:true, plan:'FREE', credits:0, termEnd:'', isAdmin:false});
  const [pricing,setPricing]=React.useState(null);
  React.useEffect(()=>{ Promise.all([
    fetch('/api/entitlements').then(r=>r.json()).catch(()=>({})),
    fetch('/pricing.json').then(r=>r.json()).catch(()=>null)
  ]).then(([e,p])=>{ setEnt({loading:false, ...e}); setPricing(p); }); },[]);
  if(ent.loading) return <div className="border rounded p-3 text-sm">Checking access…</div>;
  if(ent.isAdmin) return children;

  const hasPlan=(ent.plan==='ELITE')||(requirePlan==='PRO'&&ent.plan==='PRO');
  const cost = (pricing?.costs?.[mode==='extreme'?'extremeSession':'premiumSession']) ?? 1;
  if(hasPlan) return children;

  async function useCredit(){ const r=await fetch('/api/entitlements/consume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cost})}); if(r.ok) location.reload(); }
  async function buy(id){ await fetch('/api/payments/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:id})}); location.reload(); }

  const P=pricing?.plans||[];
  const proM=P.find(p=>p.id==='pro_monthly'), proY=P.find(p=>p.id==='pro_annual');
  const elM=P.find(p=>p.id==='elite_monthly'), elY=P.find(p=>p.id==='elite_annual');

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="font-semibold">Premium Mode</div>
      <div className="text-sm opacity-80">Monthly or annual plans with credits. No refunds. Cancel anytime — access continues until term end{ent.termEnd?' (' + new Date(ent.termEnd).toLocaleDateString() + ')':''}.</div>
      <div className="text-sm">Credits: <b>{ent.credits}</b> • Needed: <b>{cost}</b></div>
      {ent.credits>=cost
        ? <button onClick={useCredit} className="border rounded px-3 py-2">Spend {cost} Credit & Play</button>
        : <div className="space-x-2">
            <button onClick={()=>buy('topup_500')} className="border rounded px-3 py-2">Top-Up 500</button>
            <button onClick={()=>buy('topup_2000')} className="border rounded px-3 py-2">Top-Up 2000</button>
          </div>}
      <div className="space-y-1">
        {proM && <button onClick={()=>buy('pro_monthly')} className="border rounded px-3 py-2 w-full text-left">Pro Monthly — ${proM.price}/mo • {proM.includedCredits} credits/mo</button>}
        {proY && <button onClick={()=>buy('pro_annual')} className="border rounded px-3 py-2 w-full text-left">Pro Annual — ${proY.price}/yr • {proY.includedCredits} credits/yr</button>}
        {elM && <button onClick={()=>buy('elite_monthly')} className="border rounded px-3 py-2 w-full text-left">Elite Monthly — ${elM.price}/mo • {elM.includedCredits} credits/mo</button>}
        {elY && <button onClick={()=>buy('elite_annual')} className="border rounded px-3 py-2 w-full text-left">Elite Annual — ${elY.price}/yr • {elY.includedCredits} credits/yr</button>}
      </div>
      <div className="text-xs opacity-70">Admins always free. Everyone has a free intro core.</div>
    </div>
  );
}
