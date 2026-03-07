'use client';

import { cn } from '@/lib/utils';

type Variant = 'wave' | 'gradient' | 'line';

interface SectionDividerProps {
  variant?: Variant;
  className?: string;
}

export function SectionDivider({ variant = 'gradient', className }: SectionDividerProps) {
  if (variant === 'wave') {
    return (
      <div className={cn('relative h-16 w-full overflow-hidden', className)}>
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="rgba(34,211,238,0.1)" />
              <stop offset="0.5" stopColor="rgba(236,72,153,0.08)" />
              <stop offset="1" stopColor="rgba(251,146,60,0.06)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div
        className={cn('h-px w-full', className)}
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(34,211,238,0.3), rgba(236,72,153,0.2), rgba(251,146,60,0.15), transparent)',
          boxShadow: '0 0 20px rgba(34,211,238,0.2)',
        }}
      />
    );
  }

  return (
    <div
      className={cn('mx-auto h-px w-32', className)}
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      }}
    />
  );
}
