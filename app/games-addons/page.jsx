'use client';
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Flame, Star, ArrowLeft } from 'lucide-react';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';

const games = [
  { slug: "cryptic-cross", title: "Cryptic Cross Mini", category: "Word" },
  { slug: "word-ladder", title: "Word Ladder Rush", category: "Word" },
  { slug: "anagram-gauntlet", title: "Master Anagram Gauntlet", category: "Word" },
  { slug: "definition-duel", title: "Definition Duel", category: "Word" },
  { slug: "quote-cipher", title: "Quote Cipher", category: "Word" },
  { slug: "wiki-trail", title: "Wiki Trail", category: "Knowledge" },
  { slug: "geo-typo", title: "Geo Typo Hunt", category: "Knowledge" },
  { slug: "flag-forge", title: "Flag Forge", category: "Knowledge" },
  { slug: "formula-fix", title: "Formula Fix", category: "Puzzle" },
  { slug: "rogue-riddle", title: "Rogue Riddle", category: "Puzzle" },
  { slug: "killer-sudoku", title: "Killer Sudoku Mini", category: "Puzzle" },
  { slug: "nonogram", title: "Nonogram Vault", category: "Puzzle" },
  { slug: "kakuro", title: "Kakuro Sprint", category: "Puzzle" },
  { slug: "lights-out", title: "Lights Out Labs", category: "Puzzle" },
  { slug: "river-crossing", title: "River Crossing+", category: "Logic" },
  { slug: "circuit-trace", title: "Circuit Trace", category: "Logic" },
  { slug: "tetrio-logic", title: "Tetrio Logic", category: "Logic" },
  { slug: "rush-hour", title: "Rush Hour Remix", category: "Logic" },
  { slug: "island-count", title: "Island Count", category: "Logic" },
  { slug: "pathfinder", title: "Pathfinder Maze", category: "Logic" },
  { slug: "vector-drift", title: "Vector Drift", category: "Action" },
  { slug: "grapple-run", title: "Grapple Run", category: "Action" },
  { slug: "bullet-weave", title: "Bullet Weave", category: "Action" },
  { slug: "portal-putter", title: "Portal Putter", category: "Action" },
  { slug: "time-splitter", title: "Time Splitter", category: "Action" },
  { slug: "mirror-dash", title: "Mirror Dash", category: "Action" },
  { slug: "orbital-catch", title: "Orbital Catch", category: "Action" },
  { slug: "rhythm-reactor", title: "Rhythm Reactor", category: "Action" },
  { slug: "stacksmith", title: "Stacksmith", category: "Action" },
  { slug: "vector-sniper", title: "Vector Sniper", category: "Action" },
  { slug: "tower-forge", title: "Mini Tower Forge", category: "Strategy" },
  { slug: "deck-duel", title: "Deck Duel Micro", category: "Strategy" },
  { slug: "hex-conquest", title: "Hex Conquest", category: "Strategy" },
  { slug: "relic-run", title: "Relic Run", category: "Strategy" },
  { slug: "factory-flow", title: "Factory Flow", category: "Strategy" },
  { slug: "nano-colony", title: "Nano Colony", category: "Strategy" },
  { slug: "crypt-raider", title: "Crypt Raider", category: "Strategy" },
  { slug: "signal-jam", title: "Signal Jam", category: "Strategy" },
  { slug: "blitz-draw", title: "Blitz Draw", category: "Social" },
  { slug: "trivia-arena", title: "Trivia Arena Live", category: "Social" },
  { slug: "word-snipe", title: "Word Snipe", category: "Social" },
  { slug: "tap-dueler", title: "Tap Dueler", category: "Social" },
  { slug: "emoji-heist", title: "Emoji Heist", category: "Social" },
  { slug: "bluff-tell", title: "Bluff & Tell", category: "Social" },
  { slug: "sound-match", title: "Sound Match Pro", category: "Perception" },
  { slug: "palette-pilot", title: "Palette Pilot", category: "Perception" },
  { slug: "zoom-id", title: "Zoom ID Expert", category: "Perception" },
  { slug: "pattern-prophet", title: "Pattern Prophet", category: "Perception" },
  { slug: "memory-labyrinth", title: "Memory Labyrinth", category: "Memory" },
  { slug: "reflex-gauntlet", title: "Reflex Gauntlet", category: "Reflex" }
];

const categories = [...new Set(games.map(g => g.category))].sort();

export default function AddonsHub(){
  const [filter, setFilter] = React.useState('All');

  const filteredGames = filter === 'All'
    ? games
    : games.filter(g => g.category === filter);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/games'}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Main Games
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <h1 className="text-4xl font-bold">Challenging Add-Ons</h1>
            </div>
            <p className="text-gray-600">
              50 harder games with Pro/Elite upsells. Free starter modes always available.
            </p>
          </div>

          <AdSlot id="addons-top" />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'All' ? 'default' : 'outline'}
              onClick={() => setFilter('All')}
              size="sm"
            >
              All Games
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={filter === cat ? 'default' : 'outline'}
                onClick={() => setFilter(cat)}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Games Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredGames.map(game => (
              <Link key={game.slug} href={`/${game.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {game.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4" />
                      <span>Challenge Mode</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Premium Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Harder difficulty modes</li>
                <li>• Global leaderboards</li>
                <li>• Streak multipliers</li>
                <li>• Season challenges</li>
                <li>• Exclusive cosmetics</li>
              </ul>
              <Button className="w-full mt-4" onClick={() => window.location.href = '/pricing'}>
                Upgrade Now
              </Button>
            </CardContent>
          </Card>

          <UpsellSidebar />
          <AdSlot id="addons-side" />
        </div>
      </div>
    </div>
  );
}
