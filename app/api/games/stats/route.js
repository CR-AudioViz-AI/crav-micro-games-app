import { NextResponse } from 'next/server';

let generated = { auto: [] };
try {
  generated = (await import('@/content/games/generated.json')).default;
} catch (e) {
  console.error('Failed to load generated.json:', e);
}

export async function GET() {
  const auto = Array.isArray(generated?.auto) ? generated.auto : [];

  const all = auto.map(g => ({
    slug: g.slug,
    title: g.title || g.slug,
    category: g.slug.startsWith('extreme/') ? 'extreme' : 'standard',
    supportsPremium: true
  }));

  const totals = {
    total: all.length,
    alwaysFree: all.length,
    premium: all.filter(g => g.supportsPremium).length,
    extreme: all.filter(g => g.category === 'extreme').length
  };

  const perCategory = {};
  for (const g of all) {
    const c = g.category || 'standard';
    perCategory[c] = (perCategory[c] || 0) + 1;
  }

  return NextResponse.json({ totals, perCategory, games: all });
}
