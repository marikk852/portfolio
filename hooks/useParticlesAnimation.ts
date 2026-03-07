'use client';

/**
 * Preset configs for particle layers in different sections.
 * Particles sync hue with gradient phase when gradientSync: true.
 */
export const HERO_PARTICLES_CONFIG = {
  count: 40,
  speed: 0.12,
  mouseInfluence: 0.02,
  scrollInfluence: 0.03,
  hueMin: 210,
  hueMax: 250,
  hueShift: 60,
  maxOpacity: 0.35,
  glow: true,
  gradientSync: true,
  gradientDuration: 20000,
} as const;

export const PROJECTS_PARTICLES_CONFIG = {
  count: 25,
  speed: 0.1,
  mouseInfluence: 0.012,
  scrollInfluence: 0.04,
  hueMin: 220,
  hueMax: 280,
  hueShift: 50,
  maxOpacity: 0.25,
  glow: true,
  gradientSync: true,
  gradientDuration: 25000,
} as const;
