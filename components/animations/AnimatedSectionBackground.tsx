'use client';

import { cn } from '@/lib/utils';
import { ParticlesLayer } from '@/components/animations/ParticlesLayer';
import { FlowingGradientBackground } from '@/components/animations/FlowingGradientBackground';
import type { ParticlesLayerProps } from '@/components/animations/ParticlesLayer';
import type { FlowingGradientBackgroundProps } from '@/components/animations/FlowingGradientBackground';

export interface AnimatedSectionBackgroundProps
  extends FlowingGradientBackgroundProps {
  /** Particle config — omit to hide particles */
  particles?: Partial<ParticlesLayerProps> | false;
  /** Show gradient background */
  gradient?: boolean;
  className?: string;
}

/**
 * Modular background for Hero and Projects sections.
 * Combines flowing gradient + particles with gradient sync.
 */
export function AnimatedSectionBackground({
  particles = {},
  gradient = true,
  duration = 20,
  huePrimary = 230,
  className,
  ...rest
}: AnimatedSectionBackgroundProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0', className)}>
      {gradient && (
        <FlowingGradientBackground
          duration={duration}
          huePrimary={huePrimary}
          {...rest}
        />
      )}
      {particles !== false && (
        <ParticlesLayer
          gradientSync={true}
          gradientDuration={(duration || 20) * 1000}
          {...particles}
        />
      )}
    </div>
  );
}
