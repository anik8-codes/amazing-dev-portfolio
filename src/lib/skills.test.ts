import { expect, test } from 'vitest';
import type { Job } from '@/config/experience';
import { skillFacts } from './skills';

const job = (company: string, start: string, stack: Job['stack']) =>
  ({ company, roles: [{ title: 'x', start, end: null }], stack }) as unknown as Job;

test('merges github evidence with jobs; earliest year wins', () => {
  const data = { postgresql: { repos: 2, stars: 3, firstYear: 2026, repoNames: ['a', 'b'] } };
  const f = skillFacts('postgresql', data, [
    job('Unjob.ai', '2025-06', ['postgresql']),
    job('X', '2024-09', ['python']),
  ]);
  expect(f).toEqual({
    repos: 2,
    stars: 3,
    since: 2025,
    usedAt: ['Unjob.ai'],
    sampleRepos: ['a', 'b'],
  });
});

test('a skill only used at work still has a year; unknown skills are empty', () => {
  expect(skillFacts('aws lambda', {}, [job('MaxCode', '2026-06', ['aws lambda'])]).since).toBe(
    2026,
  );
  expect(skillFacts('svelte' as never, {}, []).since).toBeNull();
});
