import type { Job } from '@/config/experience';

const pill =
  'inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold transition hover:bg-ink hover:text-white';

/** The company's website and LinkedIn page, when known. */
export function CompanyLinks({ job }: { job: Job }) {
  if (!job.website && !job.linkedin) return null;
  return (
    <p className="flex flex-wrap gap-2">
      {job.website && (
        <a href={job.website} target="_blank" rel="noopener noreferrer" className={pill}>
          website ↗<span className="sr-only"> of {job.company} (opens in a new tab)</span>
        </a>
      )}
      {job.linkedin && (
        <a href={job.linkedin} target="_blank" rel="noopener noreferrer" className={pill}>
          linkedin ↗<span className="sr-only"> page of {job.company} (opens in a new tab)</span>
        </a>
      )}
    </p>
  );
}
