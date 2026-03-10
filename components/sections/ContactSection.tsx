'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LiquidGlassButton } from '@/components/ui/LiquidGlassButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollFadeSection } from '@/components/animations/ScrollFadeSection';

export function ContactSection() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollFadeSection start="top 85%" duration={0.9} y={30}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t('title')}
            </h2>
            <h3 className="mb-12 text-3xl font-bold md:text-4xl lg:text-5xl">
              {t('subtitle')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <Input
                  type="text"
                  placeholder={t('name')}
                  className="min-h-[48px] h-12 border-border/50 bg-background touch-manipulation"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder={t('email')}
                  className="min-h-[48px] h-12 border-border/50 bg-background touch-manipulation"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div>
                <Textarea
                  placeholder={t('message')}
                  className="min-h-[120px] py-3 border-border/50 bg-background touch-manipulation"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              <div className="flex justify-center">
                <LiquidGlassButton
                  type="submit"
                  variant="sunset"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? t('sending') : t('send')}
                </LiquidGlassButton>
              </div>
              {status === 'success' && (
                <p className="text-sm text-green-500">{t('success')}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-500">{t('error')}</p>
              )}
            </form>
          </div>
        </ScrollFadeSection>
      </div>
    </section>
  );
}
