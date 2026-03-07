import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // MOV (iPhone)
  "video/x-m4v",
];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Загрузка файлов на Vercel недоступна. Используйте ссылки (URL) или разверните на сервере с локальным хранилищем.",
      },
      { status: 501 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "Файл не выбран или пустой" },
        { status: 400 }
      );
    }

    const mime = file.type || "";
    const nameLower = (file.name || "").toLowerCase();
    const isImage =
      ALLOWED_IMAGE_TYPES.includes(mime) ||
      /\.(jpe?g|png|webp|gif)$/i.test(nameLower);
    const isVideo =
      ALLOWED_VIDEO_TYPES.includes(mime) ||
      /\.(mp4|webm|ogg|mov|m4v)$/i.test(nameLower);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error: `Недопустимый тип файла (${mime || "неизвестно"}). Разрешены: JPEG, PNG, WebP, GIF, MP4, WebM, OGG, MOV`,
        },
        { status: 400 }
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `Файл слишком большой. Макс: ${isImage ? "10" : "200"} MB`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const rawExt = (path.extname(file.name) || "").toLowerCase();
    const validExt = isImage
      ? /\.(jpe?g|png|webp|gif)$/i.test(rawExt)
      : /\.(mp4|webm|ogg|mov|m4v)$/i.test(rawExt);
    const ext = validExt ? rawExt : isImage ? ".jpg" : ".mp4";
    const baseName = sanitizeFilename(path.basename(file.name, ext));
    const uniqueName = `${baseName}-${Date.now()}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${uniqueName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки файла" },
      { status: 500 }
    );
  }
}
