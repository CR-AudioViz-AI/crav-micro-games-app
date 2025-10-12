'use client';
import React from 'react';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import PaywallGate from '@/components/games/PaywallGate';
import ChallengeEngine from '@/components/games/ChallengeEngine';
import Leaderboard from '@/components/games/Leaderboard';

export default function Page(){
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-12 gap-6">
      <div className="md:col-span-8 space-y-4">
        <h1 className="text-3xl font-bold">Deck Duel Micro</h1>
        <AdSlot id="top" />
        <div className="border rounded-lg p-4 space-y-4">
          <ChallengeEngine gameId="deck-duel" mode="reflex" title="Deck Duel Micro" />
        </div>
        <PaywallGate featureId="DECK_DUEL">
          <div className="border rounded-lg p-4">
            <div className="font-semibold mb-2">Deck Duel Micro — Pro/Elite</div>
            <ul className="list-disc pl-6 text-sm">
              <li>Harder modes, streak multipliers</li>
              <li>Global leaderboards & events</li>
              <li>Cosmetics & season challenges</li>
            </ul>
          </div>
        </PaywallGate>
        <AdSlot id="mid" />
      </div>
      <div className="md:col-span-4 space-y-4">
        <Leaderboard gameId="deck-duel" />
        <UpsellSidebar />
        <AdSlot id="side" />
      </div>
    </div>
  );
}
