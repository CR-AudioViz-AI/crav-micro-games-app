import { MetadataRoute } from 'next';
import registry from '@/content/games/registry.json';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const items: MetadataRoute.Sitemap = [
    { url: `${site}/games`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${site}/games-addons`, changeFrequency: 'daily', priority: 0.7 }
  ];

  const hidden = new Set(registry.hidden || []);
  for (const group of registry.groups) {
    for (const slug of group.slugs || []) {
      if (!hidden.has(slug)) {
        items.push({ url: `${site}/${slug}`, changeFrequency: 'weekly', priority: 0.6 });
      }
    }
  }
  return items;
}
