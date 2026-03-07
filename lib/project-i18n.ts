import { prisma } from "@/lib/prisma";

const LOCALES = ["en", "ru", "ro"] as const;

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

export type Locale = (typeof LOCALES)[number];

export async function getProjectsForLocale(locale: string, featuredOnly = false) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { translations: true },
      where: featuredOnly ? { featured: true } : undefined,
    });
    return projects.map((p) => getProjectWithTranslation(p, locale));
  } catch {
    return [];
  }
}

export function getProjectWithTranslation(project: {
  id: string;
  slug: string;
  technologies: unknown;
  images: unknown;
  videoUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  translations: { locale: string; title: string; description: string | null }[];
}, locale: string) {
  const fallbackLocale = "en";
  const translation =
    project.translations.find((t) => t.locale === locale) ||
    project.translations.find((t) => t.locale === fallbackLocale) ||
    project.translations[0];

  return {
    id: project.id,
    slug: project.slug,
    title: translation?.title ?? "",
    description: translation?.description ?? null,
    technologies: ensureStringArray(project.technologies),
    images: ensureStringArray(project.images),
    videoUrl: project.videoUrl,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
  };
}
