import type { Metadata } from 'next';
import { jobs } from '@/config/experience';
import { site } from '@/config/site';
import { socials } from '@/config/socials';

/** The share card from src/app/opengraph-image.tsx (static export writes it without an extension). */
const OG_IMAGE = '/opengraph-image';

/**
 * Per-page metadata: title, description, canonical URL and matching Open Graph fields.
 * (Next replaces a parent's `openGraph`/`alternates` wholesale, so every page sets its own.)
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_IN',
      url: path,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  };
}

const now = jobs[0]!;

/** schema.org graph for every page: who Aniket is and what this site is (JSON-LD). */
export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${site.url}/#person`,
      name: site.author,
      alternateName: site.name,
      url: site.url,
      image: `${site.url}${OG_IMAGE}`,
      description: site.description,
      jobTitle: now.roles[0]!.title,
      worksFor: { '@type': 'Organization', name: now.company, url: now.website },
      homeLocation: { '@type': 'Place', name: 'Indore, India' },
      // TODO(content): add Aniket's personal LinkedIn URL here and in config/socials.
      sameAs: socials.map((s) => s.href),
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: 'en',
      author: { '@id': `${site.url}/#person` },
    },
  ],
};
