import { resume } from '@/config/resume';

/** Adapted from Aniket's old iframe viewer, with a title and direct-file fallbacks. */
export function ResumeViewer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex min-h-0 flex-col gap-4 ${compact ? 'h-full' : ''}`}>
      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <a
          href={resume.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border-2 border-ink bg-white px-4 py-2 hover:bg-panel"
        >
          {resume.open}
        </a>
        <a
          href={resume.pdf}
          download={resume.fileName}
          className="rounded-lg border-2 border-ink bg-ink px-4 py-2 text-white"
        >
          {resume.download}
        </a>
      </div>
      <iframe
        src={resume.pdf}
        title={resume.frameTitle}
        className={`w-full rounded-xl border-2 border-ink bg-panel ${compact ? 'min-h-0 flex-1' : 'h-[75svh] min-h-[480px]'}`}
      />
      {!compact && <p className="text-sm text-muted">{resume.fallback}</p>}
    </div>
  );
}
