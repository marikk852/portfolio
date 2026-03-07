'use client';

import { useTranslations } from 'next-intl';
import { ScrollFadeSection } from '@/components/animations/ScrollFadeSection';

export function ExperienceSection() {
  const t = useTranslations('experience');

  const experiences = [
    {
      year: t('items.0.year'),
      present: false,
      title: t('items.0.title'),
      company: t('items.0.company'),
      description: t('items.0.description'),
    },
    {
      year: t('items.1.year'),
      present: true,
      title: t('items.1.title'),
      company: t('items.1.company'),
      description: t('items.1.description'),
    },
  ];

  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollFadeSection start="top 80%" duration={0.8} y={40} blur={4}>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t('title')}
            </h2>
            <h3 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              {t('subtitle')}
            </h3>
          </div>
        </ScrollFadeSection>

        <ScrollFadeSection
          start="top 75%"
          duration={0.7}
          y={30}
          stagger={0.15}
          staggerTarget=".experience-item"
        >
          <div className="mx-auto max-w-2xl">
            <div className="relative border-l-2 border-border pl-8">
              {experiences.map((exp) => (
                <div
                  key={exp.year}
                  className="experience-item relative mb-12 last:mb-0"
                >
                  <div className="absolute -left-[41px] top-0 h-3 w-3 rounded-full bg-foreground" />
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {exp.year}
                      {exp.present && (
                        <span className="ml-2 text-xs">({t('present')})</span>
                      )}
                    </span>
                  </div>
                  <h4 className="mb-1 text-xl font-semibold">{exp.title}</h4>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {exp.company}
                  </p>
                  <p className="text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollFadeSection>
      </div>
    </section>
  );
}
