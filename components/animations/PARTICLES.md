# ParticlesLayer

Canvas 2D floating particles with scroll and mouse response. No external dependencies.

## Features

- **Slow movement** — Particles drift gently
- **Mouse response** — Subtle drift toward cursor when in section
- **Scroll parallax** — Slight movement based on scroll position
- **Glow effect** — Radial gradient glow on particles
- **Gradient colors** — HSL hue range for customizable palette
- **Performance** — IntersectionObserver pauses when off-screen, limited particle count

## Usage

```tsx
<ParticlesLayer
  count={35}
  speed={0.15}
  mouseInfluence={0.015}
  scrollInfluence={0.05}
  hueMin={200}
  hueMax={260}
  maxOpacity={0.4}
  glow
/>
```

## Props

| Prop | Default | Description |
|------|---------|-------------|
| `count` | 35 | Particle count (keep ≤50 for performance) |
| `size` | 2 | Base particle radius (px) |
| `speed` | 0.15 | Movement speed |
| `mouseInfluence` | 0.015 | Mouse drift strength |
| `scrollInfluence` | 0.05 | Scroll parallax factor |
| `hueMin` / `hueMax` | 200–260 | HSL hue range for gradient |
| `maxOpacity` | 0.4 | Max particle opacity |
| `glow` | true | Enable glow effect |

## Parent requirements

Parent must have `position: relative` and defined dimensions. Use `overflow-hidden` to clip particles.
