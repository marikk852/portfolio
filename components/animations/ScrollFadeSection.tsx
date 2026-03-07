'use client';

import { ReactNode } from 'react';
import { useScrollFade } from '@/hooks/useScrollFade';
import { cn } from '@/lib/utils';

interface ScrollFadeSectionProps {
  children: ReactNode;
  className?: string;
  start?: string;
  duration?: number;
  y?: number;
  /** Initial blur for cinematic reveal (e.g. 8) */
  blur?: number;
  stagger?: number;
  staggerTarget?: string;
}

export function ScrollFadeSection({
  children,
  className,
  start = 'top 85%',
  duration = 1,
  y = 60,
  blur,
  stagger,
  staggerTarget,
}: ScrollFadeSectionProps) {
  const ref = useScrollFade<HTMLDivElement>({
    start,
    duration,
    y,
    blur,
    stagger,
    staggerTarget,
  });

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
