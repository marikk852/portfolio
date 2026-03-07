import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LOCALES = ["en", "ru", "ro"];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { translations: true },
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      slug,
      technologies = [],
      images = [],
      videoUrl,
      githubUrl,
      liveUrl,
      featured = false,
      translations = {},
    } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const translationData = LOCALES.map((locale) => {
      const t = translations[locale] || {};
      return {
        locale,
        title: t.title || "",
        description: t.description || null,
      };
    });

    const hasValidTranslation = translationData.some((t) => t.title);
    if (!hasValidTranslation) {
      return NextResponse.json(
        { error: "At least one translation (title) is required" },
        { status: 400 }
      );
    }

    const techArr = Array.isArray(technologies) ? technologies : [];
    const imgArr = Array.isArray(images) ? images : [];

    const project = await prisma.project.create({
      data: {
        slug,
        technologies: JSON.stringify(techArr),
        images: JSON.stringify(imgArr),
        videoUrl: videoUrl || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        featured: Boolean(featured),
        translations: {
          create: translationData.filter((t) => t.title),
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
