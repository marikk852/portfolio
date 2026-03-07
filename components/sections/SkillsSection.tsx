'use client';

import { useTranslations } from 'next-intl';
import { ScrollFadeSection } from '@/components/animations/ScrollFadeSection';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    key: 'frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    key: 'backend',
    skills: ['Node.js', 'PostgreSQL', 'Prisma', 'REST API', 'GraphQL'],
  },
  {
    key: 'tools',
    skills: ['Git', 'Docker', 'Vercel', 'Figma', 'VS Code'],
  },
];

export function SkillsSection() {
  const t = useTranslations('skills');

  return (
    <section id="skills" className="py-24 md:py-32">
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
          y={50}
          stagger={0.15}
          staggerTarget=".skill-card"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category) => (
              <motion.div
                key={category.key}
                className="skill-card cursor-hover rounded-xl border border-white/10 p-8 transition-all duration-300 hover:scale-[1.02] hover:border-white/20"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(category.key)}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-border/50 px-4 py-2 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollFadeSection>
      </div>
    </section>
  );
}
