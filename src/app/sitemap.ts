import type { MetadataRoute } from 'next';
import { jobs } from '@/config/experience';
import { quests } from '@/config/quests';
import { site } from '@/config/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now },
    { url: `${site.url}/resume/`, lastModified: now },
    ...jobs.map((j) => ({ url: `${site.url}/experience/${j.slug}/`, lastModified: now })),
    ...quests.map((q) => ({ url: `${site.url}/projects/${q.slug}/`, lastModified: now })),
  ];
}
