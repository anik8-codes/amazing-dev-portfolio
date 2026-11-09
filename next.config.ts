import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static HTML in out/, served by Cloudflare Pages. The API lives in worker/ (Hono).
  output: 'export',
  // No image optimiser in a static export; assets are pre-sized by the scripts in scripts/.
  images: { unoptimized: true },
  // /blog → out/blog/index.html: plain folders any static host (and the link checker) understands.
  trailingSlash: true,
  // Baked in at build time; read through src/lib/build-info.ts. GITHUB_SHA is set in Actions.
  env: {
    BUILD_SHA: process.env.GITHUB_SHA ?? 'local',
    BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
