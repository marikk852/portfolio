/**
 * Modular page transition variants for Framer Motion.
 * Reusable across all pages.
 */

export const cinematicEase = [0.22, 1, 0.36, 1] as const;

export const transitionDurations = {
  enter: 0.5,
  exit: 0.35,
  enterSlow: 0.7,
  exitSlow: 0.45,
} as const;

/** Fade in/out - opacity only */
export const fadeVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: transitionDurations.enter, ease: cinematicEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: transitionDurations.exit, ease: cinematicEase },
  },
} as const;

/** Slide from right (e.g. going deeper into site) */
export const slideFromRightVariants = {
  initial: { opacity: 0, x: 40, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: transitionDurations.enter, ease: cinematicEase },
  },
  exit: {
    opacity: 0,
    x: -24,
    filter: 'blur(4px)',
    transition: { duration: transitionDurations.exit, ease: cinematicEase },
  },
} as const;

/** Slide from bottom (e.g. scrolling down feel) */
export const slideFromBottomVariants = {
  initial: { opacity: 0, y: 32, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: transitionDurations.enter, ease: cinematicEase },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(4px)',
    transition: { duration: transitionDurations.exit, ease: cinematicEase },
  },
} as const;

/** Slide from left (e.g. going back) */
export const slideFromLeftVariants = {
  initial: { opacity: 0, x: -40, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: transitionDurations.enter, ease: cinematicEase },
  },
  exit: {
    opacity: 0,
    x: 24,
    filter: 'blur(4px)',
    transition: { duration: transitionDurations.exit, ease: cinematicEase },
  },
} as const;

/** Zoom effect on route change */
export const zoomVariants = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: transitionDurations.enter, ease: cinematicEase },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(4px)',
    transition: { duration: transitionDurations.exit, ease: cinematicEase },
  },
} as const;

/** Combined: fade + subtle slide up (default cinematic) */
export const fadeSlideVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: transitionDurations.enter, ease: cinematicEase },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: transitionDurations.exit, ease: cinematicEase },
  },
} as const;

export type TransitionVariant = keyof typeof transitionVariants;

export const transitionVariants = {
  fade: fadeVariants,
  slideRight: slideFromRightVariants,
  slideBottom: slideFromBottomVariants,
  slideLeft: slideFromLeftVariants,
  zoom: zoomVariants,
  fadeSlide: fadeSlideVariants,
} as const;
