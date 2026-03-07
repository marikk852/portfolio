import { SessionProvider } from "@/components/providers/SessionProvider";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { ParticlesLayer } from "@/components/animations/ParticlesLayer";
import { PROJECTS_PARTICLES_CONFIG } from "@/hooks/useParticlesAnimation";
import "@/app/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PageTransitionProvider mode="fade">
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
          <ParticlesLayer {...PROJECTS_PARTICLES_CONFIG} />
          <AdminHeader />
          <AdminShell>{children}</AdminShell>
          <AdminFooter />
        </div>
      </PageTransitionProvider>
    </SessionProvider>
  );
}
