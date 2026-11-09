import { jobs, span, type Job } from '@/config/experience';
import type { TechName } from '@/config/tech';
import github from '@/data/github-tech.json';

interface GithubTech {
  repos: number;
  stars: number;
  firstYear: number;
  repoNames: string[];
}

export interface SkillFacts {
  /** Public repos using it (GitHub scan). */
  repos: number;
  /** Stars on those repos. */
  stars: number;
  /** First year seen anywhere: a repo or a job. Null if neither. */
  since: number | null;
  /** Companies where it was used (experience config). */
  usedAt: string[];
  /** A few of those public repos, newest scan order. */
  sampleRepos: string[];
}

/** Merge public GitHub evidence with professional use for one technology. */
export function skillFacts(
  id: TechName,
  data: Record<string, GithubTech | undefined> = github.tech,
  work: readonly Job[] = jobs,
): SkillFacts {
  const g = data[id];
  const usedIn = work.filter((j) => j.stack.includes(id));
  const years = [
    ...(g ? [g.firstYear] : []),
    ...usedIn.map((j) => Number(span(j).start.slice(0, 4))),
  ];
  return {
    repos: g?.repos ?? 0,
    stars: g?.stars ?? 0,
    since: years.length ? Math.min(...years) : null,
    usedAt: usedIn.map((j) => j.company),
    sampleRepos: g?.repoNames.slice(0, 3) ?? [],
  };
}

export const githubUser = github.user;
