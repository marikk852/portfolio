# HeroScene — Cinematic Hero

Fullscreen hero with GSAP animations, parallax shapes, and custom cursor.

## Features

- **Fullscreen layout** — `min-h-dvh` + `min-h-screen` for mobile/desktop
- **Animated gradient** — Multi-layer radial gradients with subtle motion
- **Optional video background** — Pass `videoSrc="/hero-bg.mp4"` for video
- **GSAP text reveal** — Letters appear with opacity, translateY, blur
- **Parallax floating shapes** — Blurred circles that move with scroll
- **CTA buttons** — Hover glow, scale animation, cursor-hover class
- **Custom cursor** — Expands on interactive elements (desktop only)
- **i18n** — Uses `useTranslations('hero')` for all text

## Usage

```tsx
import { HeroScene } from '@/components/sections/HeroScene';

// Default (gradient background)
<HeroScene />

// With video background
<HeroScene videoSrc="/videos/hero-bg.mp4" />
```

## Hooks

### useHeroTextReveal

Cinematic letter-by-letter reveal with opacity, translateY, and blur.

```tsx
const ref = useHeroTextReveal({
  delay: 0.4,
  duration: 1,
  stagger: 0.028,
  y: 60,
  blur: 10,
});
```

### useFloatingShapes

Parallax shapes that move with scroll. Uses `data-shape` and `data-speed` on children.

## Custom Cursor

Add `cursor-hover` class to elements for cursor expansion:

```tsx
<button className="cursor-hover">Click me</button>
```

Cursor is hidden on touch devices and mobile (md:block).
