'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  transitionVariants,
  type TransitionVariant,
} from '@/lib/pageTransitions';

interface PageTransitionWrapperProps {
  children: ReactNode;
  /** Variant: fade | slideRight | slideBottom | slideLeft | zoom | fadeSlide */
  variant?: TransitionVariant;
  className?: string;
}

/**
 * Reusable wrapper for custom page/section transitions.
 * Use when you need a specific transition variant on a section.
 */
export function PageTransitionWrapper({
  children,
  variant = 'fadeSlide',
  className,
}: Omit<PageTransitionWrapperProps, 'transitionKey'>) {
  const variants = transitionVariants[variant];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
