import type { MetadataRoute } from 'next';
import { jobs } from '@/config/experience';
import { site } from '@/config/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now },
    { url: `${site.url}/resume/`, lastModified: now },
    { url: `${site.url}/office/`, lastModified: now },
    ...jobs.map((j) => ({ url: `${site.url}/experience/${j.slug}/`, lastModified: now })),
  ];
}
