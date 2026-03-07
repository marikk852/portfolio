'use client';

import { useTranslations } from 'next-intl';
import { ProjectScene } from '@/components/animations/ProjectScene';

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

interface PortfolioListProps {
  projects: Project[];
  locale: string;
}

export function PortfolioList({ projects, locale }: PortfolioListProps) {
  const t = useTranslations('projects');
  const getPath = (slug: string) => `/${locale}/portfolio/${slug}`;

  return (
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
            viewLabel={t('viewProject')}
            liveLabel={t('live')}
            codeLabel={t('code')}
          />
        ))
      )}
    </div>
  );
}
