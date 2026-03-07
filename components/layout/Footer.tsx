'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t('rights')}
        </p>
        <p className="text-sm text-muted-foreground">{t('built')}</p>
      </div>
    </footer>
  );
}
