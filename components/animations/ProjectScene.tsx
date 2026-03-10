'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProjectCardReveal } from '@/hooks/useProjectCardReveal';
import { useIsMobile } from '@/hooks/useIsMobile';
import { LiquidGlassButton } from '@/components/ui/LiquidGlassButton';

export interface ProjectSceneProps {
  href: string;
  title: string;
  description: string | null;
  technologies: string[];
  mediaUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  accentHue?: number;
  /** GSAP ScrollTrigger start (default: 'top 85%') */
  revealStart?: string;
  viewLabel?: string;
  liveLabel?: string;
  codeLabel?: string;
  className?: string;
}

/**
 * Project card with cinematic scroll reveal:
 * - Video/image fade-in + scale
 * - Title staggered reveal + glow
 * - Tech stack slide-in
 * - CTA buttons with liquid glass
 * Plus: Liquid glass overlay, tilt, scale, glow pulse, ripple on hover
 */
export function ProjectScene({
  href,
  title,
  description,
  technologies,
  mediaUrl,
  githubUrl,
  liveUrl,
  accentHue = 240,
  revealStart = 'top 85%',
  viewLabel = 'View Project',
  liveLabel = 'Live',
  codeLabel = 'Code',
  className = '',
}: ProjectSceneProps) {
  const cardRef = useProjectCardReveal<HTMLElement>({ start: revealStart });
  const mediaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const media = mediaRef.current;
    const card = cardRef.current;
    if (!media || !card) return;

    const scrubVal = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.5 : 1.5;
    const anim = gsap.fromTo(
      media,
      { scale: 0.98 },
      {
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: scrubVal,
        },
      }
    );
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [cardRef]);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (e.clientX - centerX) / rect.width;
      const relY = (e.clientY - centerY) / rect.height;
      x.set(relX);
      y.set(relY);
    },
    [x, y, cardRef]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const hasLinks = !!(githubUrl || liveUrl);

  return (
    <motion.article
      ref={cardRef}
      className={cn(
        'group cursor-hover relative overflow-hidden rounded-xl border border-white/10',
        className
      )}
      style={
        isMobile
          ? undefined
          : {
              perspective: 1000,
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }
      }
      initial={false}
      whileHover={isMobile ? undefined : { scale: 1.03, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      whileTap={{ scale: 0.99 }}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
    >
      <Link href={href} className="block">
        {/* Media layer */}
        <div
          ref={mediaRef}
          data-reveal-media
          className="relative aspect-video w-full overflow-hidden bg-muted/30"
        >
          {mediaUrl ? (
            mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={mediaUrl}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
              <span className="text-4xl font-light">{title.charAt(0)}</span>
            </div>
          )}

          {/* Color Liquid Glass overlay */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `linear-gradient(135deg, 
                hsla(${accentHue}, 60%, 70%, 0.12) 0%, 
                hsla(${accentHue + 30}, 50%, 60%, 0.06) 50%,
                hsla(${accentHue + 60}, 40%, 50%, 0.08) 100%)`,
              backdropFilter: 'blur(8px) saturate(150%)',
              WebkitBackdropFilter: 'blur(8px) saturate(150%)',
              boxShadow: 'inset 0 0 40px rgba(255,255,255,0.03)',
            }}
          />

          {/* Glow pulse on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 50%, hsla(${accentHue}, 70%, 70%, 0.15) 0%, transparent 70%)`,
              boxShadow: `inset 0 0 60px hsla(${accentHue}, 60%, 70%, 0.08)`,
            }}
          />

          {/* Particle ripple */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          >
            <span className="project-card-ripple project-card-ripple-trigger absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div
        className="relative border-t border-white/5 bg-card/60 px-6 py-5"
        style={{
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        }}
      >
        <h3
          data-reveal-title
          className="mb-2 text-xl font-semibold transition-colors group-hover:text-foreground"
        >
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        <div data-reveal-tech className="mb-4 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              data-reveal-tech-item
              className="rounded-md border border-white/10 px-2.5 py-0.5 text-xs text-muted-foreground transition-colors group-hover:border-white/20 group-hover:text-foreground/90"
            >
              {tech}
            </span>
          ))}
        </div>

        {(hasLinks || href) && (
          <div data-reveal-cta className="flex flex-wrap gap-3">
            <LiquidGlassButton href={href} variant="primary">
              {viewLabel}
            </LiquidGlassButton>
            {liveUrl && (
              <LiquidGlassButton href={liveUrl} variant="secondary">
                <ExternalLink className="mr-2 h-4 w-4" />
                {liveLabel}
              </LiquidGlassButton>
            )}
            {githubUrl && (
              <LiquidGlassButton href={githubUrl} variant="secondary">
                <Github className="mr-2 h-4 w-4" />
                {codeLabel}
              </LiquidGlassButton>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
