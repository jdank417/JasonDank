import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';

export const dynamic = 'force-static';

const SITE = 'https://jasondank.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/sailing/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/resume/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/terminal/`, changeFrequency: 'yearly', priority: 0.3 },
    ...projects.map((p) => ({ url: `${SITE}/projects/${p.id}/`, changeFrequency: 'yearly' as const, priority: 0.6 })),
  ];
}
