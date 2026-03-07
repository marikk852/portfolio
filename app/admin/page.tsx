import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { FolderKanban } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h2 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Dashboard
        </h2>
        <h3 className="mb-8 text-3xl font-bold md:text-4xl">Admin</h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/projects"
            className="group flex items-center gap-4 rounded-xl border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-white/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div
              className="rounded-xl p-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0.05) 100%)",
              }}
            >
              <FolderKanban className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold transition-colors group-hover:text-cyan-400">
                Projects
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage portfolio projects
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
