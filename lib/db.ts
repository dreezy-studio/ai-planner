import { PrismaClient } from "@/app/generated/prisma/client";

// Next.js hot-reloads server code in development, which would otherwise
// create a brand new PrismaClient — and a new SQLite connection — on every
// file save. Caching the instance on `globalThis` survives those reloads.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
