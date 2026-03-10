'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollFadeOptions {
  /** ScrollTrigger start position (e.g. 'top 80%') */
  start?: string;
  /** Animation duration */
  duration?: number;
  /** Y offset from (pixels) */
  y?: number;
  /** Initial blur for cinematic reveal */
  blur?: number;
  /** Stagger for child elements (selector) */
  stagger?: number;
  /** Child selector for stagger (e.g. '.item') */
  staggerTarget?: string;
  /** Easing */
  ease?: string;
  /** Only animate once */
  once?: boolean;
}

export function useScrollFade<T extends HTMLElement>(options: UseScrollFadeOptions = {}) {
  const ref = useRef<T>(null);
  const {
    start = 'top 85%',
    duration = 1,
    y = 60,
    blur = 0,
    stagger,
    staggerTarget,
    ease = 'power3.out',
    once = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const effectiveY = isMobile ? Math.min(y, 24) : y;
    const effectiveBlur = isMobile ? 0 : blur;

    const targets = staggerTarget ? el.querySelectorAll(staggerTarget) : [el];
    const scrollTriggerConfig = {
      trigger: el,
      start,
      toggleActions: once ? 'play none none none' : 'play none none reverse',
    };

    const fromVars = { opacity: 0, y: effectiveY };
    const toVars = { opacity: 1, y: 0 };
    if (effectiveBlur > 0) {
      Object.assign(fromVars, { filter: `blur(${effectiveBlur}px)` });
      Object.assign(toVars, { filter: 'blur(0px)' });
    }

    const anim =
      stagger && targets.length > 1
        ? gsap.fromTo(targets, fromVars, {
            ...toVars,
            duration,
            ease,
            stagger,
            scrollTrigger: scrollTriggerConfig,
          })
        : gsap.fromTo(el, fromVars, {
            ...toVars,
            duration,
            ease,
            scrollTrigger: scrollTriggerConfig,
          });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [start, duration, y, blur, stagger, staggerTarget, ease, once]);

  return ref;
}
