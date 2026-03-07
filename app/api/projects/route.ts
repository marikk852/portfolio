import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProjectWithTranslation } from "@/lib/project-i18n";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { translations: true },
    });

    const result = projects.map((p) => getProjectWithTranslation(p, locale));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
