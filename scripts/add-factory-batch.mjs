import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const START = parseInt(process.env.START || '201', 10);
const END   = parseInt(process.env.END   || '300', 10);
const PREFIX = process.env.PREFIX || 'challenge';
const FACTORY_DIR = 'app';

const ENGINES = ['reflex','anagram','stacker','pathfind','tileslide','memory'];
const THEMES  = ['vector','cipher','quantum','nebula','signal','matrix','rocket','jungle','aurora','kernel','plasma','cobalt','orbit','cosmic','delta','omega','riddle','forge','atlas','nova','lyra','phoenix','onyx','titan','zephyr','terra','lumen','axiom','prime','echo'];

const pad = n => n >= 1000 ? String(n) : String(n).padStart(3,'0');
const pretty = s => s.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const hasPage = dir => ['page.js','page.jsx','page.ts','page.tsx'].some(f => existsSync(join(dir,f)));

const pageTpl = (title, slug, engine) => `'use client';
import React from 'react';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import PaywallGate from '@/components/games/PaywallGate';
import Leaderboard from '@/components/games/Leaderboard';
import Engine from '@/components/games/EnginesV2';

export default function Page(){
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-12 gap-6">
      <div className="md:col-span-8 space-y-4">
        <h1 className="text-3xl font-bold">${title}</h1>
        <AdSlot id="top" />
        <div className="border rounded-lg p-4 space-y-4">
          <Engine type="${engine}" gameId="${slug}" title="${title}" />
        </div>
        <PaywallGate featureId="${slug.toUpperCase()}" mode="premium" />
        <AdSlot id="mid" />
      </div>
      <div className="md:col-span-4 space-y-4">
        <Leaderboard gameId="${slug}" />
        <UpsellSidebar />
        <AdSlot id="side" />
      </div>
    </div>
  );
}
`;

let created=0, skipped=0;
for (let i=START; i<=END; i++){
  const engine = ENGINES[(i-1) % ENGINES.length];
  const theme  = THEMES[(i-1) % THEMES.length];
  const slug   = `${PREFIX}-${theme}-${pad(i)}`;
  const dir    = join(FACTORY_DIR, slug);
  if (!existsSync(dir)) mkdirSync(dir, { recursive:true });
  if (!hasPage(dir)) {
    writeFileSync(join(dir, 'page.jsx'), pageTpl(`${pretty(theme)} Challenge`, slug, engine));
    created++;
  } else {
    skipped++;
  }
}
console.log(JSON.stringify({ ok:true, range:`${START}..${END}`, prefix:PREFIX, created, skipped }, null, 2));
