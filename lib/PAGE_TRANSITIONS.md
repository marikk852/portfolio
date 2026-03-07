# Page Transitions

Modular cinematic page transitions using Framer Motion.

## Variants (`lib/pageTransitions.ts`)

| Variant | Effect |
|---------|--------|
| `fade` | Opacity only |
| `slideRight` | Enter from right, exit to left |
| `slideBottom` | Enter from bottom, exit up |
| `slideLeft` | Enter from left, exit to right |
| `zoom` | Scale + blur on route change |
| `fadeSlide` | Fade + subtle Y slide |

## PageTransitionProvider

Wraps page content in layout. Supports `mode`:

- **`auto`** (default): Direction-aware — deeper routes slide from right, back slides from left, same depth uses fadeSlide
- **`fade`**: Simple fade
- **`slide`**: Direction-aware slide
- **`zoom`**: Zoom effect

### Usage in layout

```tsx
<PageTransitionProvider mode="auto">
  {children}
</PageTransitionProvider>
```

## PageTransitionWrapper

For custom transitions on sections within a page:

```tsx
<PageTransitionWrapper variant="slideBottom">
  <section>...</section>
</PageTransitionWrapper>
```

## Flicker prevention

- First render uses `initial={false}` to skip animation
- `AnimatePresence mode="wait"` ensures exit completes before enter
- `willChange` applied during transitions for GPU acceleration

## Lenis compatibility

Transitions work with Lenis smooth scroll. No conflicts.
