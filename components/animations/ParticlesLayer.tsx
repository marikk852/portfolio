'use client';

import { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';


interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  baseHue: number;
  glow: number;
}

export interface ParticlesLayerProps {
  /** Number of particles (default: 35, keep low for performance) */
  count?: number;
  /** Base particle size in px */
  size?: number;
  /** Movement speed (0.1-0.5) */
  speed?: number;
  /** Mouse influence strength (0-0.03) */
  mouseInfluence?: number;
  /** Scroll parallax factor (0-0.1) */
  scrollInfluence?: number;
  /** Hue range for gradient particles (0-360) */
  hueMin?: number;
  hueMax?: number;
  /** Hue shift range when gradientSync (degrees) */
  hueShift?: number;
  /** Max opacity (0-1) */
  maxOpacity?: number;
  /** Enable glow effect */
  glow?: boolean;
  /** Sync particle hue with gradient phase */
  gradientSync?: boolean;
  /** Gradient cycle duration in ms (for hue sync) */
  gradientDuration?: number;
  className?: string;
}

const DEFAULT_COUNT = 35;
const DEFAULT_SIZE = 2;

export function ParticlesLayer({
  count = DEFAULT_COUNT,
  size = DEFAULT_SIZE,
  speed = 0.15,
  mouseInfluence = 0.015,
  scrollInfluence = 0.05,
  hueMin = 200,
  hueMax = 260,
  hueShift = 50,
  maxOpacity = 0.4,
  glow = true,
  gradientSync = false,
  gradientDuration = 20000,
  className,
}: ParticlesLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mousePendingRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const rafRef = useRef<number>();
  const isVisibleRef = useRef(true);
  const startTimeRef = useRef(performance.now());

  const initParticles = useCallback(
    (width: number, height: number): Particle[] => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const n = isMobile ? Math.min(count, 15) : count;
      const spd = isMobile ? speed * 0.7 : speed;
      return Array.from({ length: n }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * spd,
        vy: (Math.random() - 0.5) * spd,
        radius: size * (0.5 + Math.random() * 1.5),
        opacity: maxOpacity * (0.3 + Math.random() * 0.7),
        baseHue: hueMin + Math.random() * (hueMax - hueMin),
        glow: glow ? 8 + Math.random() * 12 : 0,
      }));
    },
    [count, size, speed, hueMin, hueMax, maxOpacity, glow]
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      mousePendingRef.current = { x: 0, y: 0 };
      return;
    }
    mousePendingRef.current = {
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height,
    };
  }, []);

  const handleScroll = useCallback(() => {
    scrollRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      particlesRef.current = initParticles(rect.width, rect.height);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    resize();
    observer.observe(container);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      if (!isVisibleRef.current || !ctx) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = container.getBoundingClientRect();
      mouseRef.current = { ...mousePendingRef.current };
      const isMobile = window.innerWidth < 768;
      const scrollInf = isMobile ? scrollInfluence * 0.5 : scrollInfluence;
      const scrollOffset = (scrollRef.current - rect.top) * scrollInf;
      const mx = mouseRef.current.x * 50 * mouseInfluence;
      const my = mouseRef.current.y * 50 * mouseInfluence;

      const gradSync = isMobile ? false : gradientSync;
      const phase = gradSync
        ? ((performance.now() - startTimeRef.current) % gradientDuration) /
          gradientDuration
        : 0;
      const hueOffset = gradSync ? phase * hueShift : 0;

      ctx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx + mx;
        p.y += p.vy + my + scrollOffset * 0.01;

        if (p.x < -20) p.x = rect.width + 20;
        if (p.x > rect.width + 20) p.x = -20;
        if (p.y < -20) p.y = rect.height + 20;
        if (p.y > rect.height + 20) p.y = -20;

        const hue = (p.baseHue + hueOffset) % 360;

        if (glow && p.glow > 0) {
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.glow
          );
          gradient.addColorStop(0, `hsla(${hue}, 70%, 80%, ${p.opacity})`);
          gradient.addColorStop(
            0.5,
            `hsla(${hue}, 60%, 70%, ${p.opacity * 0.3})`
          );
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.glow, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `hsla(${hue}, 70%, 85%, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    initParticles,
    scrollInfluence,
    mouseInfluence,
    glow,
    gradientSync,
    gradientDuration,
    hueShift,
    handleMouseMove,
    handleScroll,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 h-full w-full"
      />
    </div>
  );
}
