'use client';

import { useTextReveal } from '@/hooks/useTextReveal';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  splitBy?: 'chars' | 'words';
  delay?: number;
  duration?: number;
  stagger?: number;
  /** ScrollTrigger start (e.g. 'top 80%') - when set, animates on scroll instead of on mount */
  scrollTrigger?: string;
}

export function TextReveal({
  children,
  className,
  as: Component = 'span',
  splitBy = 'words',
  delay = 0,
  duration = 0.8,
  stagger = 0.05,
  scrollTrigger,
}: TextRevealProps) {
  const ref = useTextReveal<HTMLSpanElement>({
    splitBy,
    delay,
    duration,
    stagger,
    scrollTrigger,
  });

  return (
    <Component className={cn(className)}>
      <span ref={ref} className="inline-block">
        {children}
      </span>
    </Component>
  );
}
