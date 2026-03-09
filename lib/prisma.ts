import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env") });

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL is required in production. Add it in Vercel Environment Variables.");
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(
    databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined
  );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
