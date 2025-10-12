import { readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const APP = './app';
const OUT = './content/games/generated.json';
const EXCLUDE = new Set(['api','pay','games','games-addons','dashboard']);

function hasPage(dir){
  try {
    const files = readdirSync(dir);
    return files.some(f => /^page\.(jsx?|tsx?)$/.test(f));
  } catch { return false; }
}

function walk(base=''){
  const dir = join(APP, base);
  let results = [];
  let entries = [];
  try { entries = readdirSync(dir); } catch { return results; }
  for (const d of entries) {
    if (EXCLUDE.has(d)) continue;
    const full = join(dir, d);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      const slug = base ? `${base}/${d}` : d;
      if (hasPage(full)) results.push(slug);
      results = results.concat(walk(slug));
    }
  }
  return results;
}

const titleOf = (slug) => slug.split('/').slice(-1)[0]
  .replace(/-/g,' ')
  .replace(/\b\w/g,c=>c.toUpperCase());

const slugs = walk().sort();
const auto = slugs.map(s => ({ slug: s, title: titleOf(s) }));
writeFileSync(OUT, JSON.stringify({ auto }, null, 2));
console.log(`Reindexed ${auto.length} games -> ${OUT}`);
