# HeroScene — Cinematic Signature Effect

## Features

1. **Dynamic flowing gradient** — `FlowingGradientBackground` with CSS keyframe animations
2. **Particles** — Mouse + scroll responsive via `ParticlesLayer` + `useHeroParticles`
3. **Hero text** — GSAP reveal + glow via `useHeroTextReveal` (glow: true)
4. **Liquid Glass CTAs** — `LiquidGlassButton` with backdrop-filter, gradient, hover pulse

## Components

| Component | Description |
|-----------|-------------|
| `FlowingGradientBackground` | Slowly flowing gradient orbs |
| `ParticlesLayer` | Canvas particles (mouse/scroll) |
| `LiquidGlassButton` | Glassmorphism CTA |
| `useHeroTextReveal` | GSAP text reveal + optional glow |
| `useHeroParticles` | Particle config for Hero |

## Liquid Glass Effect

- `backdrop-filter: blur(12px) saturate(180%)`
- Semi-transparent gradient background
- Hover: scale (1.05) + gradient overlay pulse
- Variants: primary (white/blue tint), secondary (purple/blue)
