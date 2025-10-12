'use client';
import React from 'react';

export default function GamesStats({ autofill=true, showPerCategory=true }) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/games/stats')
      .then(r => r.json())
      .then(data => {
        console.log('Stats API response:', data);
        setData(data);
      })
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  React.useEffect(() => {
    if (!autofill || !data) return;
    const map = {
      total: data.totals?.total ?? 0,
      alwaysFree: data.totals?.alwaysFree ?? 0,
      premium: data.totals?.premium ?? 0,
      extreme: data.totals?.extreme ?? 0
    };
    console.log('Auto-filling stats:', map);
    Object.entries(map).forEach(([k,v]) => {
      const elements = document.querySelectorAll(`[data-stat="${k}"]`);
      console.log(`Found ${elements.length} elements for data-stat="${k}"`);
      elements.forEach(el => { el.textContent = String(v); });
    });
  }, [data, autofill]);

  if (!data) return <div className="text-sm opacity-60">Loading game stats…</div>;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
      <Card label="Total Games" value={data.totals.total} sub="Registry + generated (deep scan)" />
      <Card label="Always Free" value={data.totals.alwaysFree} sub="Every game has a free core" />
      <Card label="Premium-capable" value={data.totals.premium} sub="Upsell-ready" />
      <Card label="Extreme" value={data.totals.extreme} sub="Exclusive deep experiences" />
      {showPerCategory && (
        <div className="sm:col-span-2 md:col-span-4 border rounded-lg p-3">
          <div className="font-semibold mb-2">Per Category</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.perCategory).map(([k,v])=>(
              <div key={k} className="px-3 py-1 border rounded">{k}: <span className="font-semibold">{v}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({label, value, sub}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="opacity-70">{label}</div>
      {sub && <div className="text-xs opacity-60 mt-1">{sub}</div>}
    </div>
  );
}
