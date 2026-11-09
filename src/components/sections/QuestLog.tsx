import { currentQuest, quests } from '@/config/quests';
import { CurrentQuestCard } from './CurrentQuestCard';
import { QuestCard } from './QuestCard';
import { Section } from './Section';

/** World 1-2: projects. The current quest is featured first, then everything else. */
export function QuestLog() {
  const rest = quests.filter((q) => q.slug !== currentQuest.slug);
  return (
    <Section
      id="projects"
      stage="1-2"
      title="projects"
      kicker="what i'm building now, and what i've shipped."
    >
      <div className="flex flex-col gap-6">
        <CurrentQuestCard />
        <ul className="grid gap-6 md:grid-cols-2">
          {rest.map((q) => (
            <li key={q.slug}>
              <QuestCard quest={q} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
