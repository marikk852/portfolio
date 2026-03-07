import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export default async function AdminProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { translations: true },
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Portfolio
            </h2>
            <h3 className="text-3xl font-bold md:text-4xl">Projects</h3>
          </div>
          <LiquidGlassButton
            href="/admin/projects/create"
            variant="cyan"
            size="md"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </LiquidGlassButton>
        </div>

        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}
