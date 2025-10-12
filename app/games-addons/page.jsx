'use client';
import React from 'react';
import Link from 'next/link';
import AdSlot from '@/components/games/AdSlot';
import UpsellSidebar from '@/components/games/UpsellSidebar';
import registryJson from '@/content/games/registry.json';

function useDiscovered() {
  return [];
}

export default function AddonsHub(){
  const discovered = useDiscovered();
  const groups = registryJson.groups ?? [];
  const hidden = new Set(registryJson.hidden ?? []);
  const list = groups.flatMap(g => g.slugs.map(slug => ({ group:g.title, slug })))
    .filter(x => !hidden.has(x.slug))
    .concat(discovered.map(slug => ({ group:'Generated', slug })));

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-12 gap-6">
      <div className="md:col-span-8 space-y-4">
        <h1 className="text-3xl font-bold">Games — Add-Ons</h1>
        <p className="opacity-80">Harder games with free starter play. Upgrade for Pro/Elite features.</p>
        <AdSlot id="addons-top" />
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map(({slug}) => (
            <Link key={slug} href={`/${slug}`} className="border rounded-lg p-4 hover:shadow">
              <div className="font-semibold">{slug.replace(/-/g,' ')}</div>
              <div className="text-sm opacity-70">Play now</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <UpsellSidebar />
        <AdSlot id="addons-side" />
      </div>
    </div>
  );
}
