import type { Metadata } from 'next';
import Link from 'next/link';
import { ResumeViewer } from '@/components/resume/ResumeViewer';
import { resume } from '@/config/resume';

export const metadata: Metadata = { title: 'resume · anik8', description: resume.description };

export default function ResumePage() {
  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12">
      <Link href={resume.back.href} className="w-fit text-muted hover:text-ink">
        ← {resume.back.label}
      </Link>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-pixel-24 uppercase">{resume.title}</h1>
          <p className="mt-4 max-w-xl text-muted">{resume.description}</p>
        </div>
        <Link
          href={resume.office.href}
          prefetch={false}
          className="text-sm font-semibold underline underline-offset-4"
        >
          {resume.office.label} →
        </Link>
      </header>
      <ResumeViewer />
    </article>
  );
}
