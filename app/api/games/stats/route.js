import { NextResponse } from 'next/server';

let registry = { autoIncludePrefix:'', manual:[] };
let generated = { auto:[] };
try { registry = (await import('@/content/games/registry.json')).default; } catch {}
try { generated = (await import('@/content/games/generated.json')).default; } catch {}

function merge() {
  const manual = Array.isArray(registry?.manual) ? registry.manual.filter(g => g && g.slug) : [];
  const autoPrefix = registry?.autoIncludePrefix || '';
  const auto = Array.isArray(generated?.auto) ? generated.auto : [];

  const pickAuto = auto.filter(g =>
    (autoPrefix && g.slug.startsWith(autoPrefix)) || g.slug.startsWith('extreme/')
  );

  const norm = (g) => ({
    slug: g.slug,
    title: g.title || g.slug,
    category: g.category || (g.slug.startsWith('extreme/') ? 'extreme' : 'standard'),
    supportsPremium: g.supportsPremium !== false
  });

  const seen = new Set();
  const all = [];

  for (const m of manual) {
    if (!m?.slug || seen.has(m.slug)) continue;
    all.push(norm(m)); seen.add(m.slug);
  }
  for (const a of pickAuto) {
    if (!a?.slug || seen.has(a.slug)) continue;
    all.push(norm(a)); seen.add(a.slug);
  }

  return all;
}

export async function GET() {
  const all = merge();

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
