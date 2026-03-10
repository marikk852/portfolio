'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface UseProjectCardRevealOptions {
  start?: string;
  stagger?: number;
}

/**
 * Cinematic project card reveal on scroll:
 * - Media (video/image) fade-in + scale
 * - Title staggered reveal + glow
 * - Tech stack slide-in
 * - CTA buttons fade-in
 */
export function useProjectCardReveal<T extends HTMLElement>(
  options: UseProjectCardRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { start = 'top 85%', stagger = 0.1 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const effectiveStagger = isMobile ? stagger + 0.05 : stagger;

    const media = el.querySelector('[data-reveal-media]');
    const title = el.querySelector('[data-reveal-title]');
    const tech = el.querySelector('[data-reveal-tech]');
    const cta = el.querySelector('[data-reveal-cta]');

    // Set initial state before reveal
    gsap.set([media, title, tech, cta].filter(Boolean), { opacity: 0 });
    if (media) gsap.set(media, { scale: 0.95 });
    if (title) gsap.set(title, { y: 20 });
    const techItems = tech?.querySelectorAll('[data-reveal-tech-item]');
    if (techItems?.length) {
      gsap.set(techItems, { opacity: 0, x: -20 });
    } else if (tech) {
      gsap.set(tech, { x: -20 });
    }
    if (cta) gsap.set(cta, { y: 10 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    });

    const mediaDuration = isMobile ? 0.4 : 0.6;
    if (media) {
      tl.fromTo(
        media,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: mediaDuration, ease: 'power3.out' }
      );
    }

    if (title) {
      const chars = title.querySelectorAll('[data-reveal-char]');
      const charStagger = isMobile ? 0.03 : 0.02;
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: isMobile ? 0.35 : 0.5,
            stagger: charStagger,
            ease: 'power3.out',
          },
          effectiveStagger
        );
        tl.to(
          title,
          {
            textShadow: '0 0 30px rgba(255,255,255,0.1)',
            duration: 0.4,
          },
          `-=${0.2}`
        );
      } else {
        tl.fromTo(
          title,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: isMobile ? 0.35 : 0.5, ease: 'power3.out' },
          effectiveStagger
        );
      }
    }

    if (tech) {
      const items = tech.querySelectorAll('[data-reveal-tech-item]');
      tl.fromTo(
        items.length > 0 ? items : tech,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: isMobile ? 0.3 : 0.4,
          stagger: items.length > 0 ? (isMobile ? 0.03 : 0.05) : 0,
          ease: 'power3.out',
        },
        effectiveStagger + 0.2
      );
    }

    if (cta) {
      tl.fromTo(
        cta,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: isMobile ? 0.3 : 0.4, ease: 'power3.out' },
        effectiveStagger + 0.3
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [start, stagger]);

  return ref;
}
