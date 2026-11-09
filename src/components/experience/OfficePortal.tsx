import Link from 'next/link';
import { looks } from '@/assets/sprites';
import { Sprite } from '@/components/pixel/Sprite';
import type { Job } from '@/config/experience';

/** A light entry to the real 3D office; no engine or models load on the landing page. */
export function OfficePortal({ job }: { job: Job }) {
  if (!job.environment) return null;
  return (
    <div className="relative z-2 mb-14 flex max-w-sm flex-col items-center gap-6 text-center">
      <Sprite src={looks[job.look].body} alt="" scale={0.5} />
      <p className="text-sm text-muted">{job.environment.caption}</p>
      <Link
        href={job.environment.href}
        prefetch={false}
        className="rounded-xl border-3 border-ink bg-white px-6 py-4 font-semibold shadow-[6px_6px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
      >
        {job.environment.label} →
      </Link>
    </div>
  );
}
