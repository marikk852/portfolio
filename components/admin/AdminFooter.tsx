'use client';

import Link from 'next/link';

export function AdminFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Admin
        </p>
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </footer>
  );
}
