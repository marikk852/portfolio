'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseTextRevealOptions {
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Duration of each character/word reveal */
  duration?: number;
  /** Stagger between elements */
  stagger?: number;
  /** Split by 'chars' or 'words' */
  splitBy?: 'chars' | 'words';
  /** Easing function */
  ease?: string;
  /** Y offset for reveal (pixels) */
  y?: number;
  /** Trigger on scroll (ScrollTrigger start, e.g. 'top 80%') */
  scrollTrigger?: string;
}

export function useTextReveal<T extends HTMLElement>(options: UseTextRevealOptions = {}) {
  const ref = useRef<T>(null);
  const {
    delay = 0,
    duration = 0.8,
    stagger = 0.03,
    splitBy = 'chars',
    ease = 'power3.out',
    y = 50,
    scrollTrigger,
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

    if (splitBy === 'chars') {
      text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        span.style.verticalAlign = 'bottom';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.textContent = char === ' ' ? '\u00A0' : char;
        inner.style.transform = `translateY(${y}px)`;
        span.appendChild(inner);
        wrapper.appendChild(span);
        elements.push(inner);
      });
    } else {
      text.split(/\s+/).forEach((word, i) => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        span.style.marginRight = '0.25em';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.textContent = word;
        inner.style.transform = `translateY(${y}px)`;
        span.appendChild(inner);
        wrapper.appendChild(span);
        if (i < text.split(/\s+/).length - 1) {
          const space = document.createTextNode(' ');
          wrapper.appendChild(space);
        }
        elements.push(inner);
      });
    }

    el.appendChild(wrapper);

    const tl = gsap.timeline({
      delay,
      scrollTrigger: scrollTrigger
        ? { trigger: el, start: scrollTrigger, toggleActions: 'play none none none' }
        : undefined,
    });
    tl.to(elements, {
      y: 0,
      duration,
      stagger,
      ease,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [delay, duration, stagger, splitBy, ease, y, scrollTrigger]);

  return ref;
}
