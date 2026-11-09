import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Hud } from '@/components/layout/Hud';
import { RunnerCursor } from '@/components/layout/RunnerCursor';
import { SoundLayer } from '@/components/layout/SoundLayer';
import { themeScript } from '@/lib/theme';
import { site } from '@/config/site';
import { manrope, pressStart } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
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
      </body>
    </html>
  );
}
