'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AdminSignOut } from './AdminSignOut';

export function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === '/admin/login') return null;

  const isProjects = pathname?.startsWith('/admin/projects');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="text-xl font-semibold tracking-tight transition-colors hover:text-foreground"
          >
            Admin
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/admin/projects"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isProjects ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Projects
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session?.user?.email && (
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
          )}
          <AdminSignOut />
        </div>
      </div>
    </header>
  );
}
