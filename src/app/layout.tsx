import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Hud } from '@/components/layout/Hud';
import { RunnerCursor } from '@/components/layout/RunnerCursor';
import { SwarmLoader } from '@/components/layout/SwarmLoader';
import { SoundLayer } from '@/components/layout/SoundLayer';
import { jsonLd } from '@/lib/seo';
import { swarmScript } from '@/lib/swarm';
import { themeScript } from '@/lib/theme';
import { site } from '@/config/site';
import { manrope, pressStart } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.author} (${site.name}) · ${site.headline}`,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author, url: site.url }],
  creator: site.author,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${manrope.variable}`}
      // the theme script sets data-theme before React hydrates
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: swarmScript }} />
        {/* the whole site as Markdown, for AI assistants (GEO) */}
        <link rel="alternate" type="text/markdown" href="/index.md" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <Hud />
        <div className="flex flex-1 flex-col bg-white bg-pixel-grid">
          <main id="main">{children}</main>
          <Footer />
        </div>
        <RunnerCursor />
        <SoundLayer />
        <SwarmLoader />
      </body>
    </html>
  );
}
