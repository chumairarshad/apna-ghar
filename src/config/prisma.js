import { PrismaClient } from '@prisma/client';

// Singleton Prisma Client instance for Neon PostgreSQL
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});
