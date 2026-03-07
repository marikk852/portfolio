'use client';

import { useRef, useEffect } from 'react';

/**
 * Provides a phase (0-1) that cycles over duration.
 * Used to sync particle colors and gradient animations.
 * Updates via ref only — no re-renders for FPS-friendly use.
 */
export function useGradientPhase(durationMs = 20000) {
  const phaseRef = useRef(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const elapsed = (performance.now() - startRef.current) % durationMs;
      phaseRef.current = elapsed / durationMs;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [durationMs]);

  return phaseRef;
}
