import { quests } from '@/config/quests';
import { QuestCard } from './QuestCard';
import { Section } from './Section';

/** World 1-2: projects, as a compact grid. The first one is what's being built right now. */
export function QuestLog() {
  return (
    <Section
      defer
      id="projects"
      stage="1-2"
      title="projects"
      kicker="what i'm building now, and what i've shipped."
    >
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {quests.map((q, i) => (
          <li key={q.slug}>
            <QuestCard quest={q} now={i === 0 && q.status === 'in progress'} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
