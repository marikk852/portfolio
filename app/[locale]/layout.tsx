import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { PageTransitionProvider } from '@/components/providers/PageTransitionProvider';
import { HeroCursor } from '@/components/ui/HeroCursor';
import { CinematicBackground } from '@/components/animations/CinematicBackground';
import { ScrollProgressGlow } from '@/components/animations/ScrollProgressGlow';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'ru' | 'ro')) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LenisProvider>
        <CinematicBackground />
        <ScrollProgressGlow />
        <HeroCursor />
        <Header />
        <main className="relative z-10">
          <PageTransitionProvider mode="auto">{children}</PageTransitionProvider>
        </main>
        <Footer />
      </LenisProvider>
    </NextIntlClientProvider>
  );
}
