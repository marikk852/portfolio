'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ProjectScene } from '@/components/animations/ProjectScene';
import { ParticlesLayer } from '@/components/animations/ParticlesLayer';
import { ScrollFadeSection } from '@/components/animations/ScrollFadeSection';
import { LiquidGlassButton } from '@/components/ui/LiquidGlassButton';
import { PROJECTS_PARTICLES_CONFIG } from '@/hooks/useParticlesAnimation';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  technologies: string[];
  images: string[];
  videoUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
}

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const getPath = (slug: string) => `/${locale}/portfolio/${slug}`;

  return (
    <section id="projects" className="relative overflow-hidden py-24 md:py-32">
      <ParticlesLayer {...PROJECTS_PARTICLES_CONFIG} />
      <div className="container relative z-10 mx-auto px-6">
        <ScrollFadeSection start="top 85%" duration={0.8} y={40}>
          <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                {t('title')}
              </h2>
              <h3 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                {t('subtitle')}
              </h3>
            </div>
            <LiquidGlassButton
              href={`/${locale}/portfolio`}
              variant="magenta"
              size="md"
            >
              {t('viewAll')}
            </LiquidGlassButton>
          </div>
        </ScrollFadeSection>

        <div className="grid gap-12 sm:grid-cols-1 lg:grid-cols-2">
          {projects.length === 0 ? (
            <p className="col-span-full py-12 text-center text-muted-foreground">
              {t('noProjects')}
            </p>
          ) : (
            projects.map((project, index) => (
              <ProjectScene
                key={project.id}
                href={getPath(project.slug)}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                mediaUrl={project.videoUrl ?? project.images[0] ?? null}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
                accentHue={220 + (index % 4) * 25}
                revealStart="top 88%"
                viewLabel={t('viewProject')}
                liveLabel={t('live')}
                codeLabel={t('code')}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
