'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t('title')}
            </h1>
            <h2 className="mb-12 text-4xl font-bold md:text-5xl lg:text-6xl">
              {t('subtitle')}
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>{t('description')}</p>
              <p>
                I believe in writing clean, maintainable code and creating
                user experiences that make a difference. Every project is an
                opportunity to learn and push boundaries.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
