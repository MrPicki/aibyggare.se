import { Hero } from "@/components/home/Hero";
import { TabStrip } from "@/components/home/TabStrip";
import { StatementBlock } from "@/components/home/StatementBlock";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { StuckBanner } from "@/components/home/StuckBanner";
import { PromptShowcase } from "@/components/home/PromptShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { CommunityMarquee } from "@/components/home/CommunityMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TabStrip />
      <StatementBlock />
      <ProjectShowcase />
      <StuckBanner />
      <PromptShowcase />
      <Testimonials />
      <CommunityMarquee />
    </>
  );
}
