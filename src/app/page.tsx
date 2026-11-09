import { HeroCanvas } from '@/components/hero/HeroCanvas';
import { ContinueScreen } from '@/components/sections/ContinueScreen';
import { GithubSection } from '@/components/github/GithubSection';
import { SkillGrid } from '@/components/skills/SkillGrid';
import { Roadmap } from '@/components/experience/Roadmap';
import { QuestLog } from '@/components/sections/QuestLog';
import { ScrollRunner } from '@/components/sections/ScrollRunner';

/** Home = one level, top to bottom (requirements §4a + §4b). */
export default function Home() {
  return (
    <>
      <HeroCanvas />
      <Roadmap />
      <QuestLog />
      <GithubSection />
      <SkillGrid />
      <ContinueScreen />
      <ScrollRunner />
    </>
  );
}
