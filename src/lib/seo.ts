import type { Metadata } from 'next';
import { jobs } from '@/config/experience';
import { site } from '@/config/site';
import { socials } from '@/config/socials';

/** The site-wide share card from src/app/opengraph-image.tsx. */
const OG_IMAGE = '/opengraph-image';

/**
 * Per-page metadata: title, description, canonical URL, Markdown twin and Open Graph fields.
 * (Next replaces a parent's `openGraph`/`alternates` wholesale, so every page sets its own.
 * Each page pairs this metadata with its route's `opengraph-image.tsx`.)
 */
export function pageMeta({
  title,
  description,
  path,
  markdown = '/index.md',
}: {
  title: string;
  description: string;
  path: string;
  /** Markdown twin for AI assistants (GEO); defaults to the whole-site file. */
  markdown?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, types: { 'text/markdown': markdown } },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_IN',
      url: path,
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** schema.org BreadcrumbList from home down to the current page. */
export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'home', path: '/' }, ...trail].map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${site.url}${c.path}`,
  })),
});

/** A project page as schema.org CreativeWork, credited to the site's Person. */
export const projectLd = (q: { title: string; pitch: string; slug: string; href?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: q.title,
  description: q.pitch,
  url: `${site.url}/projects/${q.slug}/`,
  image: `${site.url}/projects/${q.slug}/opengraph-image`,
  ...(q.href && { sameAs: q.href }),
  creator: { '@id': `${site.url}/#person` },
});

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
