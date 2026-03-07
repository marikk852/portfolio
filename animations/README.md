# Cinematic Animations

Uses **GSAP**, **ScrollTrigger**, and **Framer Motion**. Lenis smooth scroll is integrated with ScrollTrigger.

## Hooks (`/hooks`)

### useTextReveal
Character or word-by-word text reveal using GSAP. Optional ScrollTrigger for scroll-triggered reveals.

```tsx
const ref = useTextReveal({
  splitBy: 'chars',  // or 'words'
  delay: 0.2,
  duration: 1,
  stagger: 0.03,
  y: 50,
  scrollTrigger: 'top 80%',  // optional - animates on scroll
});
```

### useScrollFade
Scroll-triggered fade-in using GSAP ScrollTrigger.

```tsx
const ref = useScrollFade({
  start: 'top 85%',
  duration: 1,
  y: 60,
  stagger: 0.15,
  staggerTarget: '.item',
  once: true,
});
```

### useParallax
Parallax scroll effect - element moves at different speed than scroll.

```tsx
const ref = useParallax({
  speed: 0.3,
  smoothness: 1.5,
});
```

## Components (`/components/animations`)

- **TextReveal** - Wrapper for useTextReveal
- **ScrollFadeSection** - Wrapper for useScrollFade
- **ParallaxBackground** - Hero parallax background
- **ParallaxImage** - Image with parallax effect
- **ProjectCard** - Project card with hover effects
- **PageTransitionProvider** - Page transition wrapper (used in layout)
