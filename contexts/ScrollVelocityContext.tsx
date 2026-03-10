'use client';

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useMotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useIsMobile';
import { useLenisRef } from '@/contexts/LenisContext';

const LERP = 0.35;
const MAX_VELOCITY = 40;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const ScrollVelocityContext = createContext<ReturnType<typeof useMotionValue<number>> | null>(null);

export function ScrollVelocityProvider({ children }: { children: ReactNode }) {
  const velocity = useMotionValue(0);
  const prefersReduced = usePrefersReducedMotion();
  const lenisRef = useLenisRef();

  const rafRef = useRef<number>(0);
  const prevY = useRef(0);
  const prevT = useRef(0);
  const currentVelocity = useRef(0);

  const tick = useCallback(() => {
    if (prefersReduced) return;

    const lenis = lenisRef?.current;

    if (lenis) {
      // Lenis active (desktop): use Lenis velocity (scale for visibility)
      const v = lenis.velocity * 2;
      const clamped = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, v));
      currentVelocity.current = lerp(currentVelocity.current, clamped, LERP);
    } else {
      // Native scroll (mobile or Lenis disabled): compute from scrollY
      const scrollY =
        typeof window !== 'undefined'
          ? window.scrollY ?? document.documentElement.scrollTop
          : 0;
      const now = performance.now();
      const dt = Math.min((now - prevT.current) / 1000, 0.1) || 0.016;

      const rawVelocity = (scrollY - prevY.current) / dt;
      prevY.current = scrollY;
      prevT.current = now;

      const clamped = Math.max(
        -MAX_VELOCITY,
        Math.min(MAX_VELOCITY, rawVelocity * 0.12)
      );
      currentVelocity.current = lerp(currentVelocity.current, clamped, LERP);
    }

    velocity.set(currentVelocity.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [velocity, prefersReduced, lenisRef]);

  useEffect(() => {
    if (prefersReduced) return;

    prevY.current =
      typeof window !== 'undefined'
        ? window.scrollY ?? document.documentElement.scrollTop
        : 0;
    prevT.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick, prefersReduced]);

  return (
    <ScrollVelocityContext.Provider value={velocity}>
      {children}
    </ScrollVelocityContext.Provider>
  );
}

export function useScrollVelocity() {
  return useContext(ScrollVelocityContext);
}
