'use client';

import Link from 'next/link';
import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  href: string;
  title: string;
  description: string | null;
  technologies: string[];
  /** Optional media: video URL or first image URL */
  mediaUrl?: string | null;
  /** Gradient hue for liquid glass (0-360) */
  accentHue?: number;
  children?: React.ReactNode;
  className?: string;
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

/**
 * Project card with Color Liquid Glass overlay:
 * - Semi-transparent gradient, blur + saturation, subtle glow
 * - Hover: tilt, scale, glow pulse, particle ripple
 */
export function ProjectCard({
  href,
  title,
  description,
  technologies,
  mediaUrl,
  accentHue = 240,
  children,
  className = '',
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), spring);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (e.clientX - centerX) / rect.width;
      const relY = (e.clientY - centerY) / rect.height;
      x.set(relX);
      y.set(relY);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <Link href={href} className={cn('block', className)}>
      <motion.article
        ref={cardRef}
        className="group relative overflow-hidden rounded-xl border border-white/10"
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={false}
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        }}
        whileTap={{ scale: 0.99 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Media layer (image or video placeholder) */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted/30">
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

          {/* Particle ripple on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          >
            <span className="project-card-ripple project-card-ripple-trigger absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div
          className="relative border-t border-white/5 bg-card/60 px-6 py-5"
          style={{
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          }}
        >
          <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-foreground">
            {title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 px-2.5 py-0.5 text-xs text-muted-foreground transition-colors group-hover:border-white/20 group-hover:text-foreground/90"
              >
                {tech}
              </span>
            ))}
          </div>
          {children}
        </div>
      </motion.article>
    </Link>
  );
}
