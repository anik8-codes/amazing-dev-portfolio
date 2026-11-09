import { ControllerButton } from '@/components/pixel/ControllerButton';
import { PixelWindow } from '@/components/pixel/PixelWindow';
import { Wordmark } from '@/components/pixel/Wordmark';
import { center, intro } from '@/config/hero';
import { site } from '@/config/site';
import { HeroVideo } from './HeroVideo';

/** Centre column: intro first, then wordmark + name, headline and A/B buttons. */
export function HeroCenter() {
  const buttons = [
    { letter: 'A', ...center.start },
    { letter: 'B', ...center.read },
  ] as const;
  return (
    <div
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center xl:absolute xl:top-(--top) xl:left-1/2 xl:-translate-x-1/2"
      style={{ '--top': `${center.top}px`, '--iw': `${intro.w}px` } as React.CSSProperties}
    >
      <PixelWindow title={intro.title} className="w-full max-w-(--iw)">
        <HeroVideo video={intro.video} preview />
      </PixelWindow>
      <h1 className="flex flex-col items-center gap-5">
        <Wordmark cell={16} className="h-auto w-[316px] xl:w-[474px] 2xl:w-[632px]" />
        <span className="font-display text-pixel-16 uppercase xl:text-pixel-24">{site.author}</span>
      </h1>
      <p className="-mt-3 text-2xl font-medium xl:text-3xl">{site.headline}</p>
      <div className="flex flex-wrap justify-center gap-8">
        {buttons.map((b) => (
          <div key={b.letter} className="flex flex-col items-center gap-3">
            <ControllerButton
              letter={b.letter}
              href={b.href}
              sfx={b.letter === 'A' ? 'start' : undefined}
            >
              {b.label}
            </ControllerButton>
            <span className="text-muted">{b.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
