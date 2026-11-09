import { jobs, span } from '@/config/experience';
import { quests } from '@/config/quests';
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

const experience = (detail: boolean) =>
  `## Experience

${jobs
  .map((j) => {
    const { start, end } = span(j);
    const head = `### ${j.company} (${month(start)} – ${month(end)}, ${j.place})

${j.roles.map((r) => `- ${r.title}: ${month(r.start)} – ${month(r.end)}`).join('\n')}

${j.summary} Details: ${site.url}/experience/${j.slug}/`;
    if (!detail) return head;
    return `${head}

What he did:
${j.shipped.map((s) => `- ${s}`).join('\n')}

Stack: ${j.stack.map((t) => tech[t].label).join(', ')}`;
  })
  .join('\n\n')}`;

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
