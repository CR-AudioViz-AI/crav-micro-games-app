'use client';
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
        <h1 className="text-3xl font-bold">Axiom Challenge</h1>
        <AdSlot id="top" />
        <div className="border rounded-lg p-4 space-y-4">
          <Engine type="pathfind" gameId="challenge-axiom-448" title="Axiom Challenge" />
        </div>
        <PaywallGate featureId="CHALLENGE-AXIOM-448" mode="premium" />
        <AdSlot id="mid" />
      </div>
      <div className="md:col-span-4 space-y-4">
        <Leaderboard gameId="challenge-axiom-448" />
        <UpsellSidebar />
        <AdSlot id="side" />
      </div>
    </div>
  );
}
