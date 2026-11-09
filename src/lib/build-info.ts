/** Which commit is live and when it was built. Shown on /infra (T20); served at /build.json. */
export const buildInfo = {
  sha: process.env.BUILD_SHA ?? 'local',
  time: process.env.BUILD_TIME ?? '',
} as const;
