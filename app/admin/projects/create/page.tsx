import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function AdminCreateProjectPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/admin/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <h2 className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          New Project
        </h2>
        <h3 className="mb-8 text-3xl font-bold">Create Project</h3>

        <ProjectForm />
      </div>
    </div>
  );
}
