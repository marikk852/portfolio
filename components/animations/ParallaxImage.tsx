'use client';

import Image from 'next/image';
import { useParallax } from '@/hooks/useParallax';
import { cn } from '@/lib/utils';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  fill?: boolean;
  sizes?: string;
}

export function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.3,
  fill = true,
  sizes = '100vw',
}: ParallaxImageProps) {
  const ref = useParallax<HTMLDivElement>({ speed, smoothness: 1 });

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className="object-cover"
        priority={false}
      />
    </div>
  );
}
