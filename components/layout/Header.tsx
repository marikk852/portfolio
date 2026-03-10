'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { routing } from '@/i18n/routing';

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/portfolio', key: 'portfolio' },
  { href: '/contact', key: 'contact' },
];

function getLocalizedPath(path: string, locale: string) {
  return `/${locale}${path === '/' ? '' : path}`;
}

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const basePath = pathname?.replace(/^\/(en|ru|ro)/, '') || '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href={getLocalizedPath('/', locale)} className="cursor-hover text-xl font-semibold tracking-tight">
          marikoryx
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const href = getLocalizedPath(link.href, locale);
            const isActive = pathname === href || (link.href !== '/' && pathname?.startsWith(href));
            return (
              <Link
                key={link.key}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {routing.locales.map((loc) => {
            const localePath = getLocalizedPath(basePath || '/', loc);
            return (
              <Link
                key={loc}
                href={localePath}
                className={cn(
                  'text-xs uppercase tracking-wider transition-colors hover:text-foreground',
                  locale === loc ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {loc}
              </Link>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-h-[44px] min-w-[44px] touch-manipulation"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <nav className="container mx-auto flex flex-col gap-1 px-6 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={getLocalizedPath(link.href, locale)}
                  onClick={() => setMobileOpen(false)}
                  className="min-h-[44px] flex items-center text-sm font-medium text-muted-foreground hover:text-foreground touch-manipulation py-3"
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="flex gap-4 pt-4 pb-4">
                {routing.locales.map((loc) => (
                  <Link
                    key={loc}
                    href={getLocalizedPath(basePath || '/', loc)}
                    onClick={() => setMobileOpen(false)}
                    className="min-h-[44px] flex items-center text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground touch-manipulation px-2"
                  >
                    {loc}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
