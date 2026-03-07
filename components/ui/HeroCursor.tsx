'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CURSOR_SIZE = 24;
const CURSOR_SIZE_HOVER = 56;

export function HeroCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window;
    setShowCursor(!isTouch);
  }, []);

  useEffect(() => {
    if (!showCursor || typeof window === 'undefined') return;

    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('a, button, .cursor-hover, [data-magnetic]'));
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
    };
  }, [showCursor]);

  if (!showCursor) return null;

  const size = isHovering ? CURSOR_SIZE_HOVER : CURSOR_SIZE;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      animate={{
        width: isHovering ? CURSOR_SIZE_HOVER : CURSOR_SIZE,
        height: isHovering ? CURSOR_SIZE_HOVER : CURSOR_SIZE,
        marginLeft: isHovering ? -CURSOR_SIZE_HOVER / 2 : -CURSOR_SIZE / 2,
        marginTop: isHovering ? -CURSOR_SIZE_HOVER / 2 : -CURSOR_SIZE / 2,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Blur circle */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isHovering
            ? 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(236,72,153,0.1) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: `1px solid ${isHovering ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.2)'}`,
          boxShadow: isHovering
            ? '0 0 30px rgba(34,211,238,0.3), inset 0 0 20px rgba(255,255,255,0.05)'
            : '0 0 15px rgba(255,255,255,0.1)',
        }}
      />
    </motion.div>
  );
}
