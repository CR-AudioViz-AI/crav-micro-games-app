'use client';
import React from 'react';
export default function GamesQuickStats({autofill=true}){
  const [d,setD]=React.useState(null);
  React.useEffect(()=>{ fetch('/api/games/stats').then(r=>r.json()).then(setD); },[]);
  React.useEffect(()=>{ if(!autofill||!d) return;
    const m={ total:d.totals?.total??0, alwaysFree:d.totals?.alwaysFree??0, premium:d.totals?.premium??0, extreme:d.totals?.extreme??0 };
    Object.entries(m).forEach(([k,v])=>document.querySelectorAll(`[data-stat="${k}"]`).forEach(el=>el.textContent=String(v)));
  },[d,autofill]);
  if(!d) return null;
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 my-4">
      <Card label="All Games" value={d.totals.total}/>
      <Card label="Always Free" value={d.totals.alwaysFree}/>
      <Card label="Premium-capable" value={d.totals.premium}/>
      <Card label="Extreme" value={d.totals.extreme}/>
    </div>
  );
}
function Card({label,value}){ return <div className="border rounded p-3"><div className="text-2xl font-bold">{value}</div><div className="opacity-70">{label}</div></div>; }
