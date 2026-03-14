'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
}

interface PortfolioDetailContentProps {
  project: {
    title: string;
    description: string | null;
    technologies: string[];
    images?: string[];
    videoUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
  };
  portfolioPath: string;
  technologiesLabel: string;
  backLabel: string;
  liveLabel?: string;
  codeLabel?: string;
}

function getFullImageUrl(src: string): string {
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return src;
  return `/${src}`;
}

export function PortfolioDetailContent({
  project,
  portfolioPath,
  technologiesLabel,
  backLabel,
  liveLabel = "Открыть сайт",
  codeLabel = "GitHub",
}: PortfolioDetailContentProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = project.images?.filter(Boolean) ?? [];

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    if (lightboxIndex !== null) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('keydown', onEscape);
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
        window.removeEventListener('keydown', onEscape);
      };
    }
  }, [lightboxIndex]);
  const videoUrl = project.videoUrl ?? null;
  const youtubeEmbed = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const vimeoEmbed = videoUrl ? getVimeoEmbedUrl(videoUrl) : null;
  const isDirectVideo = videoUrl ? isDirectVideoUrl(videoUrl) : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href={portfolioPath}
        className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <h1 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
        {technologiesLabel}
      </h1>
      <h2 className="mb-8 text-4xl font-bold md:text-5xl lg:text-6xl">
        {project.title}
      </h2>
      <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-3 mb-12">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            {tech}
          </span>
        ))}
      </div>

      {(images.length > 0 || videoUrl) && (
        <div className="space-y-8">
          {videoUrl && (youtubeEmbed || vimeoEmbed || isDirectVideo) && (
            <div className="rounded-xl overflow-hidden border border-white/10 bg-muted/20">
              <div className="aspect-video w-full">
                {youtubeEmbed && (
                  <iframe
                    src={youtubeEmbed}
                    title="Project video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
                {!youtubeEmbed && vimeoEmbed && (
                  <iframe
                    src={vimeoEmbed}
                    title="Project video"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
                {!youtubeEmbed && !vimeoEmbed && isDirectVideo && (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((src, idx) => {
                const fullUrl = getFullImageUrl(src);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative rounded-xl overflow-hidden border border-white/10 bg-muted/20 aspect-video cursor-zoom-in group"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <Image
                      src={fullUrl}
                      alt={`${project.title} — скриншот ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      quality={90}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          <AnimatePresence>
            {lightboxIndex !== null && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 touch-none overscroll-none"
                onClick={() => setLightboxIndex(null)}
              >
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="h-8 w-8" />
                </button>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-[85vw] h-[85vh] max-w-[90vw] max-h-[90vh] shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={getFullImageUrl(images[lightboxIndex])}
                    alt={`${project.title} — скриншот ${lightboxIndex + 1}`}
                    fill
                    className="object-contain rounded-lg"
                    quality={95}
                    sizes="90vw"
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {(project.liveUrl || project.githubUrl) && (
        <div className="mt-12 flex flex-wrap gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            >
              {liveLabel} →
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            >
              {codeLabel} →
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
