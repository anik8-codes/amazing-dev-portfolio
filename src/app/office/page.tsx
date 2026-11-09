import type { Metadata } from 'next';
import { office } from '@/config/office';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
};

/** A static-host redirect for old links, including browsers without JavaScript. */
export default function OfficePage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${office.href}`} />
      <a href={office.href} className="m-8 inline-block underline underline-offset-4">
        {office.title} →
      </a>
    </>
  );
}
