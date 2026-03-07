'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
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
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t('title')}
            </h1>
            <h2 className="mb-12 text-4xl font-bold md:text-5xl">
              {t('subtitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                placeholder={t('name')}
                className="h-12 border-border/50 bg-background"
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              />
              <Input
                type="email"
                placeholder={t('email')}
                className="h-12 border-border/50 bg-background"
                required
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              />
              <Textarea
                placeholder={t('message')}
                className="min-h-[160px] border-border/50 bg-background"
                required
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              />
              <Button type="submit" size="lg" disabled={status === 'loading'}>
                {status === 'loading' ? t('sending') : t('send')}
              </Button>
              {status === 'success' && (
                <p className="text-sm text-green-500">{t('success')}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-500">{t('error')}</p>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
