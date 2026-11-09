import { jobs, span } from './experience';
import { quests } from './quests';
import { site } from './site';
import { categories } from './skills';
import { tech } from './tech';

/*
 * Questions people (and AI assistants) ask about Aniket, answered first-sentence-first.
 * Every answer is built from the other config files, so it can't drift from the rest of the site.
 */
const now = jobs[0]!;
const prev = jobs[1]!;
const month = (iso: string) =>
  new Date(`${iso}-01T00:00:00Z`).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
const stack = categories
  .slice(0, 5)
  .map(
    (c) =>
      `${c.name}: ${c.groups
        .flatMap((g) => g.skills.slice(0, 2).map((s) => tech[s.id].label))
        .slice(0, 4)
        .join(', ')}`,
  )
  .join('; ');

export const faq: readonly { q: string; a: string }[] = [
  {
    q: `Who is ${site.author}?`,
    a: `${site.author} (${site.name}) is a ${site.headline} from Indore, India. He is ${now.roles[0]!.title} at ${now.company}, and before that led projects at ${prev.company}: ${prev.summary}`,
  },
  {
    q: `Where is ${site.author} based?`,
    a: `Indore, India. He has also worked from Noida (Delhi NCR) and remotely.`,
  },
  {
    q: `Where does ${site.author} work?`,
    a: `He has been ${now.roles[0]!.title} at ${now.company} since ${month(span(now).start)}, ${now.summary}`,
  },
  {
    q: `What is ${site.author}'s tech stack?`,
    a: `Mostly TypeScript and Python on AWS. By area: ${stack}. The full list is in the skills section.`,
  },
  {
    q: `What has ${site.author} built?`,
    a: quests.map((p) => `${p.title}: ${p.pitch}`).join(' '),
  },
  {
    q: `Has ${site.author} won hackathons?`,
    a: `Yes: he won HackWave with Fyrebit, and has competed at Hack the Mountains 5.0, HackIndore, Smart India Hackathon and the ISRO Bharatiya Antariksh Hackathon.`,
  },
  {
    q: `How do I contact ${site.author}?`,
    a: `Book a 30-minute call at ${site.booking}, or find him as anik8-codes on GitHub and @anik8codes on X.`,
  },
];
