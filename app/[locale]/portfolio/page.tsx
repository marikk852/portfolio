import { getTranslations } from 'next-intl/server';
import { getProjectsForLocale } from '@/lib/project-i18n';
import { PortfolioList } from '@/components/portfolio/PortfolioList';

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('projects');
  const projects = await getProjectsForLocale(locale);

  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h1 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t('title')}
            </h1>
            <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              {t('subtitle')}
            </h2>
          </div>

          <PortfolioList projects={projects} locale={locale} />
        </div>
      </section>
    </div>
  );
}
