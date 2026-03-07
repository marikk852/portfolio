'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface UseHeroTextRevealOptions {
  delay?: number;
  duration?: number;
  stagger?: number;
  y?: number;
  blur?: number;
  ease?: string;
  /** Add subtle glow effect after reveal */
  glow?: boolean;
}

/**
 * Cinematic text reveal: letters appear sequentially with
 * opacity fade, translateY motion, subtle blur, and optional glow.
 */
export function useHeroTextReveal<T extends HTMLElement>(
  options: UseHeroTextRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    delay = 0,
    duration = 0.9,
    stagger = 0.03,
    y = 60,
    blur = 8,
    ease = 'power3.out',
    glow = false,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const text = (el.textContent || '').trim();
    if (!text) return;

    el.innerHTML = '';

    const wrapper = document.createElement('span');
    wrapper.style.overflow = 'hidden';
    wrapper.style.display = 'inline-block';
    wrapper.style.verticalAlign = 'bottom';

    const elements: HTMLSpanElement[] = [];

    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      span.style.verticalAlign = 'bottom';
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = char === ' ' ? '\u00A0' : char;
      inner.style.transform = `translateY(${y}px)`;
      inner.style.opacity = '0';
      inner.style.filter = `blur(${blur}px)`;
      span.appendChild(inner);
      wrapper.appendChild(span);
      elements.push(inner);
    });

    el.appendChild(wrapper);

    const tl = gsap.timeline({ delay });
    tl.to(elements, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration,
      stagger,
      ease,
    });

    if (glow && wrapper) {
      tl.to(
        wrapper,
        {
          textShadow: '0 0 40px rgba(255,255,255,0.15), 0 0 80px rgba(120,140,255,0.1)',
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    }

    return () => {
      tl.kill();
    };
  }, [delay, duration, stagger, y, blur, ease, glow]);

  return ref;
}
