import { pageMeta } from '@/lib/seo';
import { site } from '@/config/site';
import { HeroCanvas } from '@/components/hero/HeroCanvas';
import { ContinueScreen } from '@/components/sections/ContinueScreen';
import { Faq } from '@/components/sections/Faq';
import { GithubSection } from '@/components/github/GithubSection';
import { SkillGrid } from '@/components/skills/SkillGrid';
import { Roadmap } from '@/components/experience/Roadmap';
import { QuestLog } from '@/components/sections/QuestLog';
import { ScrollRunner } from '@/components/sections/ScrollRunner';
import { WorkspaceSection } from '@/components/office/WorkspaceSection';

export const metadata = pageMeta({
  title: `${site.author} (${site.name}) · ${site.headline}`,
  description: site.description,
  path: '/',
});

/** Home = one level, top to bottom (requirements §4a + §4b). */
export default function Home() {
  return (
    <>
      <HeroCanvas />
      <Roadmap />
      <WorkspaceSection />
      <QuestLog />
      <GithubSection />
      <SkillGrid />
      <Faq />
      <ContinueScreen />
      <ScrollRunner />
    </>
  );
}
