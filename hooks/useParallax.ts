'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseParallaxOptions {
  /** Speed multiplier (positive = moves slower than scroll, creates depth) */
  speed?: number;
  /** Scrub smoothness (higher = smoother, 1-2 typical) */
  smoothness?: number;
}

export function useParallax<T extends HTMLElement>(options: UseParallaxOptions = {}) {
  const ref = useRef<T>(null);
  const { speed = 0.3, smoothness = 1.5 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const scrollHeight = () => document.documentElement.scrollHeight - window.innerHeight;
    const y = () => -(el.getBoundingClientRect().top * speed);

    const animation = gsap.fromTo(
      el,
      { y: 0 },
      {
        y,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: smoothness,
        },
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [speed, smoothness]);

  return ref;
}
