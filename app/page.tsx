import { SiteHeader } from "@/components/global/site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { SkillsGrid } from "@/components/sections/skills-grid";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { SiteFooter } from "@/components/sections/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen w-full overflow-x-clip bg-black selection:bg-cyan-500/30 selection:text-cyan-200">
        <section id="home">
          <HeroSection />
        </section>
        <section id="skills">
          <SkillsGrid />
        </section>
        <section id="projects">
          <ProjectGallery />
        </section>
        <section id="timeline">
          <ExperienceTimeline />
        </section>
        <SiteFooter />
      </main>
    </>
  );
}
