import type { Metadata } from 'next';
import { looks, type Look } from '@/assets/sprites';
import { ControllerButton } from '@/components/pixel/ControllerButton';
import { Hearts } from '@/components/pixel/Hearts';
import { PixelWindow } from '@/components/pixel/PixelWindow';
import { RunCycle } from '@/components/pixel/RunCycle';
import { SelectionCorners } from '@/components/pixel/SelectionCorners';
import { Sprite } from '@/components/pixel/Sprite';
import { Wordmark } from '@/components/pixel/Wordmark';
import { XpBar } from '@/components/pixel/XpBar';

export const metadata: Metadata = {
  title: 'pixel kit · anik8',
  description: 'Every brand component at every size.',
  robots: { index: false },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t-3 border-haze py-8">
      <h2 className="font-display text-pixel-16">{title}</h2>
      <div className="flex flex-wrap items-end gap-8">{children}</div>
    </section>
  );
}

/** Design-system sheet: the T06 done-check. Not linked from the site; noindex. */
export default function Kit() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 font-display text-pixel-24">pixel kit</h1>

      <Section title="Wordmark">
        {([4, 12, 16, 20] as const).map((cell) => (
          <figure key={cell} className="flex flex-col gap-2">
            <Wordmark cell={cell} className="max-w-full" />
            <figcaption className="text-sm text-muted">cell {cell} px</figcaption>
          </figure>
        ))}
      </Section>

      <Section title="Hearts">
        {[2, 3, 4].map((cell) => (
          <Hearts key={cell} full={4} cell={cell} />
        ))}
      </Section>

      <Section title="XP bar">
        <XpBar value={7780} max={10000} className="w-64" />
      </Section>

      <Section title="Pixel window">
        <PixelWindow title="reel_01" className="h-48 w-64">
          <p className="p-4">window body</p>
        </PixelWindow>
      </Section>

      <Section title="Controller buttons">
        <ControllerButton letter="A" href="#">
          press start
        </ControllerButton>
        <ControllerButton letter="B" href="#">
          read mode
        </ControllerButton>
      </Section>

      <Section title="Selection corners">
        <SelectionCorners selected>
          <Sprite src={looks.creator.body} alt="Creator look" scale={0.5} />
        </SelectionCorners>
        <SelectionCorners selected={false}>
          <Sprite src={looks.gamer.body} alt="Gamer look" scale={0.5} />
        </SelectionCorners>
      </Section>

      {([0.5, 1, 2] as const).map((scale) => (
        <Section key={scale} title={`Looks at ${scale}×`}>
          {(Object.keys(looks) as Look[]).map((look) => (
            <figure key={look} className="flex flex-col items-center gap-2">
              <Sprite src={looks[look].body} alt={`${look} look`} scale={scale} />
              <figcaption className="font-display text-pixel-8 uppercase">{look}</figcaption>
            </figure>
          ))}
        </Section>
      ))}

      <Section title="Heads at 0.25× and 0.5×">
        {(Object.keys(looks) as Look[]).map((look) => (
          <div key={look} className="flex items-end gap-2">
            <Sprite src={looks[look].head} alt={`${look} head`} scale={0.25} />
            <Sprite src={looks[look].head} alt="" scale={0.5} />
          </div>
        ))}
      </Section>

      <Section title="Run cycle">
        {([0.5, 1, 2] as const).map((scale) => (
          <RunCycle key={scale} scale={scale} label={`run cycle at ${scale}×`} />
        ))}
      </Section>
    </div>
  );
}
