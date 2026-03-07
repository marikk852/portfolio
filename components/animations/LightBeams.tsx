'use client';

import { cn } from '@/lib/utils';

export function LightBeams({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}
      aria-hidden
    >
      {/* Diagonal gradient beams */}
      <div
        className="absolute -left-1/2 top-0 h-full w-full opacity-[0.06]"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgba(34,211,238,0.3) 50%, transparent 70%)',
          transform: 'skewX(-15deg)',
        }}
      />
      <div
        className="absolute -right-1/2 top-1/4 h-1/2 w-full opacity-[0.05]"
        style={{
          background:
            'linear-gradient(75deg, transparent 20%, rgba(236,72,153,0.25) 45%, transparent 70%)',
          transform: 'skewX(12deg)',
        }}
      />
      {/* Vertical accent line */}
      <div
        className="absolute left-1/4 top-0 h-full w-px opacity-20"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(34,211,238,0.2) 30%, rgba(34,211,238,0.1) 70%, transparent)',
        }}
      />
    </div>
  );
}
