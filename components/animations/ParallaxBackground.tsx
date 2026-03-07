'use client';

import { useParallax } from '@/hooks/useParallax';

export function ParallaxBackground() {
  const ref = useParallax<HTMLDivElement>({ speed: 0.15, smoothness: 1.5 });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden
    >
      <div className="absolute -top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,120,120,0.2),transparent_70%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[radial-gradient(ellipse_100%_100%_at_50%_100%,rgba(80,80,80,0.08),transparent)]" />
    </div>
  );
}
