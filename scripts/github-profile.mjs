// Saves Aniket's GitHub contribution calendar (last 12 months) and profile numbers to
// src/data/github-profile.json, so the static build never calls GitHub at runtime.
// Run: pnpm github-profile   (token: GITHUB_TOKEN or `gh auth token`)
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const USER = 'anik8-codes';
const token = process.env.GITHUB_TOKEN ?? execSync('gh auth token').toString().trim();
const query = `query($login: String!) {
  user(login: $login) {
    name login followers { totalCount }
    repositories(ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, first: 100) {
      totalCount nodes { stargazerCount }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;
const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'anik8-site' },
  body: JSON.stringify({ query, variables: { login: USER } }),
});
const { data, errors } = await res.json();
if (errors) throw new Error(JSON.stringify(errors));
const u = data.user;
const LEVEL = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};
const weeks = u.contributionsCollection.contributionCalendar.weeks.map((w) =>
  w.contributionDays.map((d) => [d.date, d.contributionCount, LEVEL[d.contributionLevel] ?? 0]),
);
const out = {
  login: u.login,
  name: u.name,
  generatedAt: new Date().toISOString().slice(0, 10),
  followers: u.followers.totalCount,
  publicRepos: u.repositories.totalCount,
  stars: u.repositories.nodes.reduce((n, r) => n + r.stargazerCount, 0),
  contributions: u.contributionsCollection.contributionCalendar.totalContributions,
  /** weeks → days as [date, count, level 0-4] */
  weeks,
};
writeFileSync('src/data/github-profile.json', JSON.stringify(out) + '\n');
console.log(
  `${out.contributions} contributions · ${out.publicRepos} repos · ${out.stars} ★ · ${out.followers} followers`,
);
