'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgressGlow() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const anim = gsap.fromTo(
      bar,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        transformOrigin: 'top center',
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed left-0 top-0 z-[9998] h-full w-1 origin-top"
      aria-hidden
      style={{
        background:
          'linear-gradient(to bottom, rgba(34,211,238,0.4), rgba(236,72,153,0.3), rgba(251,146,60,0.2))',
        boxShadow: '0 0 20px rgba(34,211,238,0.3), 0 0 40px rgba(236,72,153,0.2)',
      }}
    />
  );
}
