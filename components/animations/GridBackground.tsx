'use client';

import { cn } from '@/lib/utils';

export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none fixed inset-0 z-0', className)}
      aria-hidden
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
      }}
    />
  );
}
