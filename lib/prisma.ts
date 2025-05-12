// lib/prisma.ts
import { PrismaClient } from "../prisma/generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient({
    log: [{emit: 'event', level: 'query'}, {emit: 'stdout', level: 'info'}],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;