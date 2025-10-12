import registry from '@/content/games/registry.json';

export type GameRegistry = {
  motm: string;
  groups: { title: string; slugs: string[] }[];
  hidden: string[];
};

function uniq(arr: string[]) { return Array.from(new Set(arr)); }

export function getRegistry(): GameRegistry {
  return registry as GameRegistry;
}

export async function withDiscovered(slugs: string[]) {
  const r = structuredClone(getRegistry());
  const gen = r.groups.find(g => g.title === 'Generated Challenges');
  if (gen) {
    gen.slugs = uniq([...(gen.slugs || []), ...slugs]);
  }
  return r;
}

export function visibleSlugs(r: GameRegistry): string[] {
  const hidden = new Set(r.hidden || []);
  const all = r.groups.flatMap(g => g.slugs || []);
  return all.filter(s => !hidden.has(s));
}
