import type { Metadata } from 'next';
import Link from 'next/link';
import { VirtualOffice } from '@/components/office/VirtualOffice';
import { office } from '@/config/office';

export const metadata: Metadata = {
  title: 'virtual workspace · anik8',
  description: office.description,
};

export default function OfficePage() {
  return (
    <article className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <Link href={office.home.href} className="w-fit text-sm text-muted hover:text-ink">
        ← {office.home.label}
      </Link>
      <header>
        <h1 className="font-display text-pixel-16 uppercase sm:text-pixel-24">{office.title}</h1>
        <p className="mt-4 text-muted">{office.description}</p>
      </header>
      <VirtualOffice />
      <p className="text-xs text-muted">
        <a
          href={office.credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          {office.credit.label}
        </a>
        {' · '}
        <a href={office.credit.license} className="underline underline-offset-4">
          MIT
        </a>
      </p>
    </article>
  );
}
