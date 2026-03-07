'use client';

import { useTranslations } from 'next-intl';
import { ScrollFadeSection } from '@/components/animations/ScrollFadeSection';

const stats = [
  { key: 'years', value: '5+' },
  { key: 'projects', value: '50+' },
  { key: 'clients', value: '30+' },
];

export function AboutSection() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollFadeSection
          start="top 80%"
          duration={1}
          y={60}
          blur={6}
          stagger={0.12}
          staggerTarget="[data-fade-item]"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 data-fade-item className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t('title')}
            </h2>
            <h3 data-fade-item className="mb-8 text-3xl font-bold md:text-4xl lg:text-5xl">
              {t('subtitle')}
            </h3>
            <p data-fade-item className="mb-16 text-lg leading-relaxed text-muted-foreground">
              {t('description')}
            </p>

            <div className="grid grid-cols-3 gap-8 border-t border-border pt-12">
              {stats.map((stat) => (
                <div key={stat.key} data-fade-item className="stat-item text-center">
                  <div className="mb-2 text-3xl font-bold md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(stat.key)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollFadeSection>
      </div>
    </section>
  );
}
