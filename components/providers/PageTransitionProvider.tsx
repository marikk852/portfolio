'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  transitionVariants,
  fadeSlideVariants,
  slideFromRightVariants,
  slideFromLeftVariants,
  zoomVariants,
} from '@/lib/pageTransitions';

export type PageTransitionMode = 'fade' | 'slide' | 'zoom' | 'auto';

interface PageTransitionProviderProps {
  children: ReactNode;
  /** Transition style: 'fade' | 'slide' | 'zoom' | 'auto' (direction-aware) */
  mode?: PageTransitionMode;
}

function getSegmentDepth(pathname: string): number {
  return pathname.split('/').filter(Boolean).length;
}

function getVariantsForDirection(
  mode: PageTransitionMode,
  prevDepth: number,
  nextDepth: number
) {
  if (mode === 'fade') return transitionVariants.fade;
  if (mode === 'zoom') return zoomVariants;
  if (mode === 'slide' || mode === 'auto') {
    if (nextDepth > prevDepth) return slideFromRightVariants;
    if (nextDepth < prevDepth) return slideFromLeftVariants;
  }
  return fadeSlideVariants;
}

export function PageTransitionProvider({
  children,
  mode = 'auto',
}: PageTransitionProviderProps) {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const prevDepthRef = useRef(getSegmentDepth(pathname));
  const isFirstRenderRef = useRef(true);

  const depth = getSegmentDepth(pathname);
  const variants = getVariantsForDirection(mode, prevDepthRef.current, depth);
  const skipInitial = isFirstRenderRef.current;

  useEffect(() => {
    prevPathnameRef.current = pathname;
    prevDepthRef.current = depth;
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
    }
  }, [pathname, depth]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={skipInitial ? false : 'initial'}
        animate="animate"
        exit="exit"
        variants={variants}
        className="min-h-full"
        style={{ willChange: skipInitial ? 'auto' : 'opacity, transform, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
