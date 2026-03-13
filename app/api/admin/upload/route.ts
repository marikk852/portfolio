import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

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
const VERCEL_MAX_BODY = 4.5 * 1024 * 1024; // 4.5 MB (Vercel serverless limit)

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const useVercelBlob = process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN;

  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Добавьте Vercel Blob: Storage → Create Database → Blob. Переменная BLOB_READ_WRITE_TOKEN создастся автоматически.",
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

    const maxSize = useVercelBlob
      ? VERCEL_MAX_BODY
      : isImage
        ? MAX_IMAGE_SIZE
        : MAX_VIDEO_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: useVercelBlob
            ? `Файл слишком большой. На Vercel макс. 4.5 MB. Для больших файлов используйте ссылку (YouTube, Cloudinary и т.д.)`
            : `Файл слишком большой. Макс: ${isImage ? "10" : "200"} MB`,
        },
        { status: 400 }
      );
    }

    const rawExt = (path.extname(file.name) || "").toLowerCase();
    const validExt = isImage
      ? /\.(jpe?g|png|webp|gif)$/i.test(rawExt)
      : /\.(mp4|webm|ogg|mov|m4v)$/i.test(rawExt);
    const ext = validExt ? rawExt : isImage ? ".jpg" : ".mp4";
    const baseName = sanitizeFilename(path.basename(file.name, ext));
    const timestamp = Date.now();
    const uniqueName = `uploads/${baseName}-${timestamp}${ext}`;

    if (useVercelBlob) {
      const blob = await put(uniqueName, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, `${baseName}-${timestamp}${ext}`);
    await writeFile(filePath, buffer);
    const url = `/uploads/${baseName}-${timestamp}${ext}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки файла" },
      { status: 500 }
    );
  }
}
