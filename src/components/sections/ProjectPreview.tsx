import Image from 'next/image';
import type { Quest } from '@/config/quests';

/** A real landing-page capture, pre-sized for the static export. */
export function ProjectPreview({ preview }: { preview: NonNullable<Quest['preview']> }) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-ink bg-panel">
      <Image
        src={preview.src}
        alt={preview.alt}
        width={preview.width}
        height={preview.height}
        loading="lazy"
        sizes="(max-width: 767px) 100vw, 50vw"
        className="aspect-video h-auto w-full object-cover"
      />
    </div>
  );
}
