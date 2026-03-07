'use client';

import { GridBackground } from './GridBackground';
import { NoiseOverlay } from './NoiseOverlay';
import { GradientGlowOrbs } from './GradientGlowOrbs';
import { LightBeams } from './LightBeams';

/**
 * Global decorative layers for cinematic portfolio:
 * - Subtle grid
 * - Noise/grain overlay
 * - Gradient glow orbs (cyan, magenta, orange, purple)
 * - Light beams
 */
export function CinematicBackground() {
  return (
    <>
      <GridBackground />
      <NoiseOverlay />
      <GradientGlowOrbs />
      <LightBeams />
    </>
  );
}
