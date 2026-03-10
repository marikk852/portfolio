'use client';

import { type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useScrollVelocity } from '@/contexts/ScrollVelocityContext';
import { cn } from '@/lib/utils';

interface JellyCardProps extends Omit<React.ComponentProps<typeof motion.div>, 'style'> {
  children: ReactNode;
  className?: string;
  /** 0–1, intensity of jelly reaction (default 0.35) */
  intensity?: number;
  as?: 'div' | 'article' | 'section';
  style?: React.CSSProperties;
}

export function JellyCard({
  children,
  className,
  intensity = 0.35,
  as = 'div',
  style,
  ...rest
}: JellyCardProps) {
  const contextVelocity = useScrollVelocity();
  const fallbackVelocity = useMotionValue(0);
  const velocity = contextVelocity ?? fallbackVelocity;
  const Component = motion[as] as typeof motion.div;

  const translateY = useTransform(velocity, (v) => {
    const clamped = Math.max(-20, Math.min(20, v * intensity * 1.2));
    return clamped;
  });
  const scaleY = useTransform(velocity, (v) => {
    const s = 1 + (v / 50) * 0.08;
    return Math.max(0.96, Math.min(1.04, s));
  });
  const scaleX = useTransform(velocity, (v) => {
    const s = 1 - (v / 50) * 0.04;
    return Math.max(0.97, Math.min(1.03, s));
  });

  const springY = useSpring(translateY, { stiffness: 120, damping: 18 });
  const springScaleY = useSpring(scaleY, { stiffness: 150, damping: 20 });
  const springScaleX = useSpring(scaleX, { stiffness: 150, damping: 20 });

  const jellyStyle = contextVelocity
    ? {
        y: springY,
        scaleX: springScaleX,
        scaleY: springScaleY,
        transformOrigin: 'center center' as const,
        ...style,
      }
    : style;

  return (
    <Component
      className={cn(className)}
      style={jellyStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}
