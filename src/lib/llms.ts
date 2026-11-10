import { type Job, jobs, span } from '@/config/experience';
import { type Quest, quests } from '@/config/quests';
import { resume } from '@/config/resume';
import { site } from '@/config/site';
import { categories } from '@/config/skills';
import { socials } from '@/config/socials';
import { tech } from '@/config/tech';

const month = (iso: string | null) =>
  iso
    ? new Date(`${iso}-01T00:00:00Z`).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : 'present';

const now = jobs[0]!;
const intro = `# ${site.author} (${site.name})

> ${site.author}, known online as ${site.name}, is a ${site.headline} from India, currently ${now.roles[0]!.title} at ${now.company}.`;

const links = `## Links

- [Home](${site.url}/): portfolio, experience, projects, skills
- [Resume](${site.url}${resume.href}): one-page resume (PDF: ${site.url}${resume.pdf})
- [Book a 30-minute call](${site.booking})
${socials.map((s) => `- [${s.label}](${s.href})`).join('\n')}`;

const job = (j: Job, detail: boolean, h = '###') => {
  const { start, end } = span(j);
  const head = `${h} ${j.company} (${month(start)} – ${month(end)}, ${j.place})

${j.roles.map((r) => `- ${r.title}: ${month(r.start)} – ${month(r.end)}`).join('\n')}

${j.summary} Details: ${site.url}/experience/${j.slug}/`;
  if (!detail) return head;
  return `${head}

What he did:
${j.shipped.map((s) => `- ${s}`).join('\n')}

Stack: ${j.stack.map((t) => tech[t].label).join(', ')}`;
};

const experience = (detail: boolean) =>
  `## Experience

${jobs.map((j) => job(j, detail)).join('\n\n')}`;

const projects = `## Projects

${quests.map((q) => `- **${q.title}**${q.href ? ` (${q.href})` : ''}: ${q.pitch} Details: ${site.url}/projects/${q.slug}/`).join('\n')}`;

const skills = `## Skills

${categories
  .map(
    (c) =>
      `- ${c.name}: ${c.groups.flatMap((g) => g.skills.map((s) => tech[s.id].label)).join(', ')}`,
  )
  .join('\n')}`;

/** /llms.txt: the short map of the site for AI assistants (llmstxt.org). */
export const llmsTxt = [intro, links, experience(false), projects].join('\n\n') + '\n';

/** /llms-full.txt and /index.md: everything in one Markdown file. */
export const llmsFull =
  [
    intro,
    links,
    experience(true),
    projects,
    skills,
    `## Contact\n\nBook a call: ${site.booking}`,
  ].join('\n\n') + '\n';

const about = `More about ${site.author}: ${site.url}/llms.txt`;

/** /experience/<slug>/index.md: the Markdown twin of one experience page. */
export const jobMd = (j: Job) =>
  `# ${site.author} (${site.name}) at ${j.company}

${job(j, true, '##')}

${about}
`;

/** /projects/<slug>/index.md: the Markdown twin of one project page. */
export const questMd = (q: Quest) => {
  const j = q.job ? jobs.find((x) => x.slug === q.job) : undefined;
  const facts = [
    q.href && `- Link: ${q.href}`,
    q.status && `- Status: ${q.status}`,
    q.year && `- Year: ${q.year}`,
    q.result && `- Result: ${q.result}`,
    j && `- Role: ${j.roles[0]!.title} at ${j.company} (${site.url}/experience/${j.slug}/)`,
  ].filter(Boolean);
  const stack = j ? j.stack.map((t) => tech[t].label) : q.stack;
  return (
    [
      `# ${q.title}`,
      `> ${q.title} is a project by ${site.author} (${site.name}): ${q.pitch}`,
      facts.join('\n'),
      q.features && `## How it works\n\n${q.features.map((f) => `- ${f}`).join('\n')}`,
      q.publishedStats &&
        `## Numbers (published by the platform)\n\n${q.publishedStats.map((s) => `- ${s.value} ${s.label}`).join('\n')}${q.evidence ? `\n\nSource: ${q.evidence.href}, checked ${q.evidence.checked}` : ''}`,
      j && `## What he did\n\n${j.shipped.map((s) => `- ${s}`).join('\n')}`,
      stack.length > 0 && `## Stack\n\n${stack.join(', ')}`,
      about,
    ]
      .filter(Boolean)
      .join('\n\n') + '\n'
  );
};
