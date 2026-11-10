import { looks } from '@/assets/sprites';
import { Sprite } from '@/components/pixel/Sprite';
import { Section } from '@/components/sections/Section';
import { categories } from '@/config/skills';
import { tech } from '@/config/tech';
import { skillFacts } from '@/lib/skills';
import { SkillCard, cardId } from './SkillCard';
import { TechMark } from './TechMark';

/** Wide categories take two columns of the bento grid on large screens. */
const WIDE = new Set(['frontend', 'aws', 'cloud & devops', 'auth']);

/**
 * World 1-4: everything Aniket builds with, as a bento grid of category cards. Each skill is a
 * logo tile; tapping it opens its card (native popover, zero JS) with Aniket's take, GitHub
 * numbers and where it was used at work.
 */
export function SkillGrid() {
  const total = categories.reduce(
    (n, c) => n + c.groups.reduce((m, g) => m + g.skills.length, 0),
    0,
  );
  return (
    <Section
      defer
      id="skills"
      stage="1-4"
      title="skills"
      kicker="everything i build with. tap any skill for the numbers and my take."
    >
      <p className="mb-8 flex items-center gap-3">
        <Sprite src={looks.default.head} alt="" scale={0.25} />
        <span className="font-display text-pixel-8 uppercase">
          player 1 · {total} skills unlocked
        </span>
      </p>

      <div className="grid gap-5 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = cat.groups.reduce((n, g) => n + g.skills.length, 0);
          return (
            <section
              key={cat.name}
              aria-labelledby={`cat-${cat.name.replace(/\W+/g, '-')}`}
              className={`rounded-3xl border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-haze)] ${WIDE.has(cat.name) ? 'lg:col-span-2' : ''}`}
            >
              <h3
                id={`cat-${cat.name.replace(/\W+/g, '-')}`}
                className="mb-4 flex items-baseline justify-between font-display text-pixel-8 uppercase"
              >
                {cat.name}
                <span className="text-muted">{count}</span>
              </h3>
              <div className="flex flex-col gap-4">
                {cat.groups.map((group, gi) => (
                  <div key={group.name ?? gi}>
                    {group.name && (
                      <p className="mb-2 font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                        {group.name}
                      </p>
                    )}
                    <ul className="flex flex-wrap gap-2">
                      {group.skills.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            popoverTarget={cardId(s.id)}
                            className="flex items-center gap-2 rounded-xl border-2 border-haze bg-white py-1.5 pr-3 pl-1.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-ink focus-visible:border-ink"
                          >
                            <span className="grid size-8 place-items-center rounded-lg bg-panel">
                              <TechMark id={s.id} className="size-5" />
                            </span>
                            {tech[s.id].label}
                          </button>
                          <SkillCard id={s.id} take={s.take} facts={skillFacts(s.id)} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Section>
  );
}
