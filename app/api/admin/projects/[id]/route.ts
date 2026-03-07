import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LOCALES = ["en", "ru", "ro"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { translations: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      slug,
      technologies,
      images,
      videoUrl,
      githubUrl,
      liveUrl,
      featured,
      translations,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (slug !== undefined) updateData.slug = slug;
    if (technologies !== undefined)
      updateData.technologies = JSON.stringify(Array.isArray(technologies) ? technologies : []);
    if (images !== undefined)
      updateData.images = JSON.stringify(Array.isArray(images) ? images : []);
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl || null;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl || null;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl || null;
    if (featured !== undefined) updateData.featured = Boolean(featured);

    if (translations !== undefined) {
      for (const locale of LOCALES) {
        const t = translations[locale];
        if (t) {
          await prisma.projectTranslation.upsert({
            where: {
              projectId_locale: { projectId: id, locale },
            },
            create: {
              projectId: id,
              locale,
              title: t.title || "",
              description: t.description ?? null,
            },
            update: {
              title: t.title ?? undefined,
              description: t.description ?? undefined,
            },
          });
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: { translations: true },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
