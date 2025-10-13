'use client';
import React from 'react';
import Link from 'next/link';

export default function GamesExplorer(){
  const [data,setData]=React.useState({totals:{}, perCategory:{}, games:[]});
  const [filter,setFilter]=React.useState('all');
  React.useEffect(()=>{ fetch('/api/games/stats').then(r=>r.json()).then(setData); }, []);
  const cats=['all', ...Object.keys(data.perCategory||{})];
  const list=(data.games||[]).filter(g=>filter==='all'?true:g.category===filter);
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Games</h1>
        <div className="text-sm opacity-70">Total: <b>{data.totals.total||0}</b></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 border rounded ${filter===c?'bg-gray-100':''}`}>
            {c.charAt(0).toUpperCase()+c.slice(1)} {c!=='all' && <span className="opacity-70">({data.perCategory[c]||0})</span>}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {list.map(g=>(
          <Link key={g.slug} href={`/${g.slug}`} className="border rounded p-3 hover:shadow">
            <div className="font-semibold">{g.title}</div>
            <div className="text-xs opacity-70">/{g.slug} • {g.category}</div>
          </Link>
        ))}
        {list.length===0 && <div className="opacity-60">No games in this category yet.</div>}
      </div>
    </div>
  );
}
