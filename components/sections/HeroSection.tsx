'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { TextReveal } from '@/components/animations/TextReveal';
import { ParallaxBackground } from '@/components/animations/ParallaxBackground';

const ease = [0.22, 1, 0.36, 1];

export function HeroSection() {
  const t = useTranslations('hero');
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current || !containerRef.current) return;
    const tl = gsap.timeline({ delay: 0.6 });
    tl.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }
    );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
      <ParallaxBackground />

      <div ref={containerRef} className="container relative mx-auto px-6 text-center">
        <motion.p
          className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground"
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          {t('greeting')}
        </motion.p>

        <h1 className="mb-2 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          <TextReveal
            as="span"
            splitBy="chars"
            delay={0.3}
            duration={1.1}
            stagger={0.025}
          >
            {t('title')}
          </TextReveal>
        </h1>

        <div ref={lineRef} className="mx-auto mb-8 h-px w-24 origin-left bg-foreground/50" />

        <motion.p
          className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease }}
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="#projects"
            className="group inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:border-foreground/30 hover:bg-accent hover:text-accent-foreground"
          >
            {t('cta')}
            <motion.span
              className="ml-2 inline-block"
              initial={false}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="text-xs uppercase tracking-widest">{t('scroll')}</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
