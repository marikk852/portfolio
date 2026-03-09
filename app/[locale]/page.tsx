import { HeroScene } from '@/components/sections/HeroScene';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { FeaturedProjectsSection } from '@/components/sections/FeaturedProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { SectionDivider } from '@/components/animations/SectionDivider';
import { getProjectsForLocale } from '@/lib/project-i18n';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const featuredProjects = await getProjectsForLocale(locale, true);

  return (
    <>
      <HeroScene />
      <SectionDivider variant="gradient" className="my-0" />
      <AboutSection />
      <SectionDivider variant="line" />
      <SkillsSection />
      <FeaturedProjectsSection projects={featuredProjects} />
      <SectionDivider variant="gradient" />
      <ExperienceSection />
      <SectionDivider variant="line" />
      <ContactSection />
    </>
  );
}
