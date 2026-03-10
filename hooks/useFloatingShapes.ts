'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface FloatingShape {
  id: string;
  size: number;
  x: string;
  y: string;
  blur: number;
  opacity: number;
  speed: number;
  /** Gradient color: cyan | magenta | orange | purple */
  color?: string;
}

export const FLOATING_SHAPES: FloatingShape[] = [
  { id: '1', size: 400, x: '10%', y: '20%', blur: 80, opacity: 0.18, speed: 0.08, color: 'cyan' },
  { id: '2', size: 300, x: '80%', y: '60%', blur: 60, opacity: 0.14, speed: 0.06, color: 'magenta' },
  { id: '3', size: 200, x: '50%', y: '80%', blur: 40, opacity: 0.12, speed: 0.1, color: 'orange' },
  { id: '4', size: 150, x: '20%', y: '70%', blur: 30, opacity: 0.1, speed: 0.05, color: 'purple' },
  { id: '5', size: 250, x: '70%', y: '30%', blur: 50, opacity: 0.12, speed: 0.07, color: 'cyan' },
];

export const SHAPE_COLORS: Record<string, string> = {
  cyan: 'rgba(34,211,238,0.25)',
  magenta: 'rgba(236,72,153,0.2)',
  orange: 'rgba(251,146,60,0.18)',
  purple: 'rgba(139,92,246,0.15)',
};

export function useFloatingShapes(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shapes = container.querySelectorAll<HTMLElement>('[data-shape]');
    const animations: gsap.core.Tween[] = [];

    const isMobile = window.innerWidth < 768;
    const scrubVal = isMobile ? 0.5 : 1.5;

    shapes.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '0.08');
      const y = () => -(el.getBoundingClientRect().top * speed);

      const anim = gsap.fromTo(
        el,
        { y: 0 },
        {
          y,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: scrubVal,
          },
        }
      );
      animations.push(anim);
    });

    return () => {
      animations.forEach((a) => {
        a.scrollTrigger?.kill();
        a.kill();
      });
    };
  }, [containerRef]);
}
