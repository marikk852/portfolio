'use client';

import { cn } from '@/lib/utils';

const ORBS = [
  {
    id: '1',
    className: 'absolute -left-[20%] -top-[10%] h-[50vw] w-[50vw] rounded-full',
    style: {
      background:
        'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)',
      animation: 'float-orb 20s ease-in-out infinite',
    },
  },
  {
    id: '2',
    className: 'absolute -right-[15%] top-[30%] h-[40vw] w-[40vw] rounded-full',
    style: {
      background:
        'radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)',
      animation: 'float-orb 25s ease-in-out infinite reverse 2s',
    },
  },
  {
    id: '3',
    className: 'absolute left-[40%] -bottom-[15%] h-[35vw] w-[35vw] rounded-full',
    style: {
      background:
        'radial-gradient(circle, rgba(251,146,60,0.1) 0%, rgba(251,146,60,0.03) 40%, transparent 70%)',
      animation: 'float-orb 22s ease-in-out infinite 4s',
    },
  },
  {
    id: '4',
    className: 'absolute left-[10%] top-[50%] h-[25vw] w-[25vw] rounded-full',
    style: {
      background:
        'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 50%)',
      animation: 'float-orb 18s ease-in-out infinite 1s',
    },
  },
];

export function GradientGlowOrbs({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}
      aria-hidden
    >
      {ORBS.map((orb) => (
        <div
          key={orb.id}
          className={orb.className}
          style={orb.style}
        />
      ))}
    </div>
  );
}
