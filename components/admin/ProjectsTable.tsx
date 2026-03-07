"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { Project, ProjectTranslation } from "@prisma/client";

interface ProjectWithTranslations extends Project {
  translations: ProjectTranslation[];
}

interface ProjectsTableProps {
  projects: ProjectWithTranslations[];
}

function ensureStringArray(val: unknown): string[] {
  return Array.isArray(val) ? val.filter((x): x is string => typeof x === "string") : [];
}

function getProjectTitle(project: ProjectWithTranslations): string {
  const en = project.translations?.find((t) => t.locale === "en");
  const first = project.translations?.[0];
  return en?.title || first?.title || project.slug;
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete project");
    }
  };

  if (projects.length === 0) {
    return (
      <div
        className="rounded-xl border border-white/10 p-12 text-center text-muted-foreground"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        No projects yet.{" "}
        <Link
          href="/admin/projects/create"
          className="text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
        >
          Create your first project
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-white/10 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{getProjectTitle(project)}</TableCell>
              <TableCell className="text-muted-foreground">{project.slug}</TableCell>
              <TableCell>
                {(() => {
                  const techs = ensureStringArray(project.technologies);
                  return (
                    <div className="flex flex-wrap gap-1">
                      {techs.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {techs.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{techs.length - 3}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell>
                {project.featured ? (
                  <Badge variant="default">Yes</Badge>
                ) : (
                  <span className="text-muted-foreground">No</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-white/20 hover:bg-white/5"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
