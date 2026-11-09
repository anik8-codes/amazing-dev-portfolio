import { buildInfo } from '@/lib/build-info';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildInfo);
}
