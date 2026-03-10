'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useHeroTextReveal } from '@/hooks/useHeroTextReveal';
import { useFloatingShapes, FLOATING_SHAPES, SHAPE_COLORS } from '@/hooks/useFloatingShapes';
import { HERO_PARTICLES_CONFIG } from '@/hooks/useParticlesAnimation';
import { ParticlesLayer } from '@/components/animations/ParticlesLayer';
import { LiquidGlassButton } from '@/components/ui/LiquidGlassButton';

interface HeroSceneProps {
  /** Optional video URL for background (e.g. /hero-bg.mp4) */
  videoSrc?: string;
}

export function HeroScene({ videoSrc }: HeroSceneProps) {
  const t = useTranslations('hero');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useHeroTextReveal<HTMLSpanElement>({
    delay: 0.4,
    duration: 1,
    stagger: 0.028,
    y: 60,
    blur: 10,
    glow: true,
  });
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useFloatingShapes(shapesRef);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    if (greetingRef.current) {
      tl.fromTo(
        greetingRef.current,
        { opacity: 0, y: 24, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      );
    }

    if (lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1, ease: 'power3.inOut' },
        '-=0.3'
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
        1.2
      );
    }

    if (ctasRef.current) {
      tl.fromTo(
        ctasRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        1.5
      );
    }

    if (scrollRef.current) {
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.9
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-dvh min-h-[100svh] min-h-screen items-center justify-center overflow-hidden pt-20 pb-20 md:pt-24 md:pb-0"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      {videoSrc && (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-30"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/60" />
        </div>
      )}
      {/* Floating particles (mouse + scroll responsive) */}
      <ParticlesLayer {...HERO_PARTICLES_CONFIG} />

      {/* Parallax floating shapes */}
      <div ref={shapesRef} className="pointer-events-none absolute inset-0 overflow-hidden">
        {FLOATING_SHAPES.map((shape) => (
          <div
            key={shape.id}
            data-shape
            data-speed={shape.speed}
            className="absolute rounded-full"
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
              transform: 'translate(-50%, -50%)',
              filter: `blur(${shape.blur}px)`,
              opacity: shape.opacity,
              background: shape.color
                ? `radial-gradient(circle, ${SHAPE_COLORS[shape.color] || 'rgba(255,255,255,0.1)'} 0%, transparent 70%)`
                : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 text-center">
        <p
          ref={greetingRef}
          className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground md:text-base"
        >
          {t('greeting')} <span className="text-foreground">{t('name')}</span>
        </p>

        <h1 className="mb-4 text-3xl font-bold tracking-tight xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl">
          <span ref={titleRef} className="inline-block">
            {t('title')}
          </span>
        </h1>

        <div
          ref={lineRef}
          className="mx-auto mb-8 h-px w-24 origin-left bg-gradient-to-r from-foreground/60 to-transparent"
        />

        <p
          ref={subtitleRef}
          className="mx-auto mb-10 max-w-2xl text-sm text-muted-foreground sm:mb-14 sm:text-base md:text-lg lg:text-xl"
        >
          {t('subtitle')}
        </p>

        <div ref={ctasRef} className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <LiquidGlassButton href="#projects" variant="primary">
            {t('cta')}
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </LiquidGlassButton>
          <LiquidGlassButton href={`/${locale}/contact`} variant="secondary">
            {t('ctaContact')}
          </LiquidGlassButton>
        </div>
      </div>

      {/* Scroll hint — внизу секции */}
      <motion.div
        ref={scrollRef}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-10"
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
    </section>
  );
}
