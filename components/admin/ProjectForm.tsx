"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Image as ImageIcon, Video, Upload, Loader2 } from "lucide-react";
import type { Project, ProjectTranslation } from "@prisma/client";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Russian" },
  { code: "ro", label: "Romanian" },
] as const;

interface ProjectWithTranslations extends Project {
  translations: ProjectTranslation[];
}

interface ProjectFormProps {
  project?: ProjectWithTranslations;
}

function getTranslation(
  translations: ProjectTranslation[] | undefined,
  locale: string
) {
  return translations?.find((t) => t.locale === locale);
}

function ensureStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((x): x is string => typeof x === "string");
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    slug: project?.slug ?? "",
    technologies: ensureStringArray(project?.technologies).join(", ") ?? "",
    images: ensureStringArray(project?.images).join("\n") ?? "",
    videoUrl: project?.videoUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    featured: project?.featured ?? false,
    translations: {
      en: {
        title: getTranslation(project?.translations, "en")?.title ?? "",
        description: getTranslation(project?.translations, "en")?.description ?? "",
      },
      ru: {
        title: getTranslation(project?.translations, "ru")?.title ?? "",
        description: getTranslation(project?.translations, "ru")?.description ?? "",
      },
      ro: {
        title: getTranslation(project?.translations, "ro")?.title ?? "",
        description: getTranslation(project?.translations, "ro")?.description ?? "",
      },
    },
  });

  const handleSlugFromTitle = (title: string) => {
    if (!project) {
      setFormData((prev) => ({
        ...prev,
        slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  };

  const handleFileUpload = async (
    files: FileList | null,
    type: "image" | "video"
  ) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Ошибка загрузки");
        }

        const { url } = await res.json();

        if (type === "image") {
          setFormData((prev) => ({
            ...prev,
            images: prev.images ? prev.images + "\n" + url : url,
          }));
        } else {
          setFormData((prev) => ({ ...prev, videoUrl: url }));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const technologies = formData.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const images = formData.images
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    const payload = {
      slug: formData.slug,
      technologies,
      images,
      videoUrl: formData.videoUrl || null,
      githubUrl: formData.githubUrl || null,
      liveUrl: formData.liveUrl || null,
      featured: formData.featured,
      translations: formData.translations,
    };

    try {
      const url = project
        ? `/api/admin/projects/${project.id}`
        : "/api/admin/projects";
      const method = project ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="rounded-xl border border-white/10 p-6 space-y-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        <h4 className="text-xl font-semibold">
          {project ? "Edit" : "Create"} Project
        </h4>
        {error && (
          <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <h5 className="font-medium">Translations</h5>
          {LOCALES.map(({ code, label }) => (
            <div
              key={code}
              className="rounded-xl border border-white/10 p-4 space-y-4"
              style={{
                background: "rgba(255,255,255,0.02)",
              }}
            >
                <h5 className="text-sm font-medium text-muted-foreground">
                  {label}
                </h5>
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.translations[code].title}
                    onChange={(e) => {
                      const title = e.target.value;
                      handleSlugFromTitle(title);
                      setFormData((prev) => ({
                        ...prev,
                        translations: {
                          ...prev.translations,
                          [code]: { ...prev.translations[code], title },
                        },
                      }));
                    }}
                    required={code === "en"}
                    disabled={loading}
                    placeholder={`Project title in ${label}`}
                    className="border-border/50 bg-background/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.translations[code].description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        translations: {
                          ...prev.translations,
                          [code]: {
                            ...prev.translations[code],
                            description: e.target.value,
                          },
                        },
                      }))
                    }
                    rows={3}
                    disabled={loading}
                    placeholder={`Description in ${label}`}
                    className="border-border/50 bg-background/80"
                  />
                </div>
              </div>
            ))}
          </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
            disabled={loading}
            placeholder="my-project"
            className="border-border/50 bg-background/80"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technologies">Technologies (comma-separated)</Label>
          <Input
            id="technologies"
            value={formData.technologies}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, technologies: e.target.value }))
            }
            disabled={loading}
            placeholder="Next.js, TypeScript, Tailwind"
            className="border-border/50 bg-background/80"
          />
        </div>

        <div
          className="rounded-xl border border-white/10 p-4 space-y-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <h5 className="font-medium flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Медиа — фото и видео
          </h5>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, "image")}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v,.mp4,.webm,.ogg,.mov,.m4v"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, "video")}
          />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Label className="mb-0">Фото</Label>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={loading || uploading}
                className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Выбрать из галереи
              </button>
              <span className="text-xs text-muted-foreground">
                или вставьте URL ниже
              </span>
            </div>
            {formData.images.split("\n").map((url, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <div className="flex-1 flex gap-2">
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-muted/30">
                    {url.startsWith("http") ? (
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <Input
                    value={url}
                    onChange={(e) => {
                      const lines = formData.images.split("\n");
                      lines[idx] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        images: lines.join("\n"),
                      }));
                    }}
                    disabled={loading}
                    placeholder="https://example.com/screenshot.jpg"
                    className="border-border/50 bg-background/80 flex-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const lines = formData.images.split("\n");
                    lines.splice(idx, 1);
                    setFormData((prev) => ({
                      ...prev,
                      images: lines.join("\n"),
                    }));
                  }}
                  disabled={loading}
                  className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  images: prev.images + (prev.images.endsWith("\n") ? "" : "\n"),
                }))
              }
              disabled={loading}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              Добавить фото
            </button>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <Label htmlFor="videoUrl" className="flex items-center gap-2 mb-0">
                <Video className="h-4 w-4" />
                Видео
              </Label>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={loading || uploading}
                className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Выбрать с устройства
              </button>
              <span className="text-xs text-muted-foreground">
                MP4, WebM, OGG или ссылка YouTube/Vimeo
              </span>
            </div>
            <Input
              id="videoUrl"
              type="text"
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
              }
              disabled={loading}
              placeholder="https://youtube.com/... или загрузите с устройства"
              className="border-border/50 bg-background/80"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
            }
            disabled={loading}
            placeholder="https://github.com/..."
            className="border-border/50 bg-background/80"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            type="url"
            value={formData.liveUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))
            }
            disabled={loading}
            placeholder="https://example.com"
            className="border-border/50 bg-background/80"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, featured: e.target.checked }))
            }
            disabled={loading}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="featured">Featured project</Label>
        </div>

        <LiquidGlassButton
          type="submit"
          variant="sunset"
          size="lg"
          disabled={loading}
        >
          {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
        </LiquidGlassButton>
      </div>
    </form>
  );
}
