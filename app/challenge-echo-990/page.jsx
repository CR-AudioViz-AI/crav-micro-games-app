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
        <h1 className="text-3xl font-bold">Echo Challenge</h1>
        <AdSlot id="top" />
        <div className="border rounded-lg p-4 space-y-4">
          <Engine type="memory" gameId="challenge-echo-990" title="Echo Challenge" />
        </div>
        <PaywallGate featureId="CHALLENGE-ECHO-990" mode="premium" />
        <AdSlot id="mid" />
      </div>
      <div className="md:col-span-4 space-y-4">
        <Leaderboard gameId="challenge-echo-990" />
        <UpsellSidebar />
        <AdSlot id="side" />
      </div>
    </div>
  );
}
