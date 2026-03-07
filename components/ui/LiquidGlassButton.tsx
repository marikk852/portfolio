'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Variant colors: cyan (primary), magenta (secondary), sunset (accent) */
const VARIANT_STYLES = {
  cyan: {
    gradient:
      'linear-gradient(135deg, rgba(34,211,238,0.25) 0%, rgba(6,182,212,0.15) 40%, rgba(2,132,199,0.1) 100%)',
    border: 'rgba(34,211,238,0.35)',
    borderHover: 'rgba(34,211,238,0.55)',
    glow: '0 0 30px rgba(34,211,238,0.25)',
    glowHover: '0 0 45px rgba(34,211,238,0.4), inset 0 0 20px rgba(34,211,238,0.08)',
    overlay:
      'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(34,211,238,0.15) 50%, transparent 100%)',
    text: 'text-cyan-100',
  },
  magenta: {
    gradient:
      'linear-gradient(135deg, rgba(236,72,153,0.25) 0%, rgba(219,39,119,0.15) 40%, rgba(190,24,93,0.1) 100%)',
    border: 'rgba(236,72,153,0.35)',
    borderHover: 'rgba(236,72,153,0.55)',
    glow: '0 0 30px rgba(236,72,153,0.25)',
    glowHover: '0 0 45px rgba(236,72,153,0.4), inset 0 0 20px rgba(236,72,153,0.08)',
    overlay:
      'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(236,72,153,0.15) 50%, transparent 100%)',
    text: 'text-pink-100',
  },
  sunset: {
    gradient:
      'linear-gradient(135deg, rgba(251,146,60,0.25) 0%, rgba(249,115,22,0.2) 40%, rgba(234,88,12,0.15) 100%)',
    border: 'rgba(251,146,60,0.4)',
    borderHover: 'rgba(251,146,60,0.6)',
    glow: '0 0 30px rgba(251,146,60,0.25)',
    glowHover: '0 0 45px rgba(251,146,60,0.4), inset 0 0 20px rgba(251,146,60,0.08)',
    overlay:
      'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(251,146,60,0.2) 50%, transparent 100%)',
    text: 'text-orange-100',
  },
} as const;

type Variant = keyof typeof VARIANT_STYLES;

/** Legacy: primary=cyan, secondary=magenta, accent=sunset */
const VARIANT_MAP: Record<string, Variant> = {
  primary: 'cyan',
  secondary: 'magenta',
  accent: 'sunset',
};

interface LiquidGlassButtonBaseProps {
  children: React.ReactNode;
  variant?: Variant | 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

interface LiquidGlassButtonLinkProps extends LiquidGlassButtonBaseProps {
  href: string;
  type?: never;
  onClick?: never;
}

interface LiquidGlassButtonButtonProps extends LiquidGlassButtonBaseProps {
  href?: never;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export type LiquidGlassButtonProps =
  | LiquidGlassButtonLinkProps
  | LiquidGlassButtonButtonProps;

const sizeClasses = {
  sm: 'h-10 min-w-[120px] px-4 text-sm rounded-lg',
  md: 'h-12 min-w-[160px] px-6 text-sm rounded-xl',
  lg: 'h-14 min-w-[200px] px-8 text-base rounded-xl',
};

/**
 * Colorful Liquid Glass CTA button:
 * - Backdrop blur + semi-transparent gradient
 * - Subtle glass border
 * - Glow effect on hover
 * - Glass light reflection sweep on hover
 * Variants: cyan (primary), magenta (secondary), sunset (accent)
 */
export function LiquidGlassButton({
  href,
  children,
  variant = 'cyan',
  size = 'md',
  className,
  disabled = false,
  type = 'button',
  onClick,
}: LiquidGlassButtonProps) {
  const resolvedVariant = VARIANT_MAP[variant] ?? variant;
  const styles = VARIANT_STYLES[resolvedVariant];
  const sizeClass = sizeClasses[size];

  const baseStyles = {
    background: styles.gradient,
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    borderColor: styles.border,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), ${styles.glow}`,
  };

  const content = (
    <>
      {/* Glass light reflection sweep */}
      <span
        className="liquid-glass-reflection pointer-events-none absolute inset-0 -translate-x-full skew-x-[-15deg]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 70%, transparent 100%)',
          width: '50%',
        }}
        aria-hidden
      />
      {/* Hover overlay */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-all duration-300 group-hover:opacity-100"
        style={{
          background: styles.overlay,
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)',
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  const sharedClasses = cn(
    'liquid-glass-btn group relative inline-flex items-center justify-center overflow-hidden font-medium border',
    'transition-all duration-300 ease-out',
    'hover:border-opacity-100',
    'active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-50 disabled:scale-100',
    sizeClass,
    styles.text,
    className
  );

  const wrapper = (
    <motion.div
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="cursor-hover inline-block"
      data-magnetic
    >
      {href ? (
        <Link
          href={href}
          className={cn(sharedClasses)}
          style={{
            ...baseStyles,
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.15), ${styles.glowHover}`;
              e.currentTarget.style.borderColor = styles.borderHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.1), ${styles.glow}`;
            e.currentTarget.style.borderColor = styles.border;
          }}
        >
          {content}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={cn(sharedClasses, 'cursor-pointer')}
          style={{
            ...baseStyles,
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.15), ${styles.glowHover}`;
              e.currentTarget.style.borderColor = styles.borderHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.1), ${styles.glow}`;
            e.currentTarget.style.borderColor = styles.border;
          }}
        >
          {content}
        </button>
      )}
    </motion.div>
  );

  return wrapper;
}
