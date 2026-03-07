import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { getProjectWithTranslation } from '@/lib/project-i18n';
import { PortfolioDetailContent } from '@/components/portfolio/PortfolioDetailContent';

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('projects');

  let project;
  try {
    project = await prisma.project.findUnique({
      where: { slug },
      include: { translations: true },
    });
  } catch {
    notFound();
  }

  if (!project) {
    notFound();
  }

  const projectWithLocale = getProjectWithTranslation(project, locale);
  const portfolioPath = `/${locale}/portfolio`;

  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <PortfolioDetailContent
            project={projectWithLocale}
            portfolioPath={portfolioPath}
            technologiesLabel={t('technologies')}
            backLabel={t('backToPortfolio')}
            liveLabel={t('live')}
            codeLabel={t('code')}
          />
        </div>
      </section>
    </div>
  );
}
