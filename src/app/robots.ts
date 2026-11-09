import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

export const dynamic = 'force-static';

// TODO(decision-5): AI crawlers are allowed (better GEO) until Aniket decides otherwise.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/kit/', '/office/screen/'] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
