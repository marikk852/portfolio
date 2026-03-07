'use client';

import { cn } from '@/lib/utils';

export interface FlowingGradientBackgroundProps {
  /** Cycle duration in seconds (default: 20) */
  duration?: number;
  /** Primary hue (0-360) */
  huePrimary?: number;
  /** Secondary hue offset from primary */
  hueSecondary?: number;
  /** Opacity of gradient layers (0-1) */
  opacity?: number;
  className?: string;
}

const GRADIENT_DURATION = 20;

/**
 * Fullscreen slowly flowing gradient background.
 * Uses CSS animation for GPU-accelerated, FPS-friendly performance.
 * Smooth transitions over time.
 */
export function FlowingGradientBackground({
  duration = GRADIENT_DURATION,
  huePrimary = 230,
  hueSecondary = 40,
  opacity = 0.5,
  className,
}: FlowingGradientBackgroundProps) {
  const primary = `hsla(${huePrimary}, 50%, 60%, 0.2)`;
  const secondary = `hsla(${huePrimary + hueSecondary}, 45%, 55%, 0.15)`;
  const tertiary = `hsla(${huePrimary + hueSecondary * 2}, 40%, 50%, 0.1)`;

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      aria-hidden
      style={
        {
          '--gradient-duration': `${duration}s`,
        } as React.CSSProperties
      }
    >
      {/* Primary flowing layer */}
      <div
        className="absolute inset-0"
        style={{
          opacity,
          background: `
            linear-gradient(135deg, 
              ${primary} 0%, 
              transparent 40%,
              ${secondary} 60%,
              transparent 100%
            )
          `,
          backgroundSize: '200% 200%',
          animation: `gradient-flow var(--gradient-duration, ${duration}s) ease infinite`,
        }}
      />
      {/* Secondary flowing layer — opposite direction */}
      <div
        className="absolute inset-0"
        style={{
          opacity: opacity * 0.8,
          background: `
            linear-gradient(225deg, 
              transparent 0%, 
              ${secondary} 30%,
              ${tertiary} 70%,
              transparent 100%
            )
          `,
          backgroundSize: '300% 300%',
          animation: `gradient-flow ${duration * 1.25}s ease-in-out infinite reverse`,
        }}
      />
      {/* Accent orbs */}
      <div
        className="absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full"
        style={{
          opacity: 0.2,
          background: `radial-gradient(circle, ${primary} 0%, transparent 70%)`,
          animation: 'gradient-shift 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[60%] w-[60%] rounded-full"
        style={{
          opacity: 0.15,
          background: `radial-gradient(circle, ${tertiary} 0%, transparent 70%)`,
          animation: 'gradient-shift 10s ease-in-out infinite 2s',
        }}
      />
    </div>
  );
}
