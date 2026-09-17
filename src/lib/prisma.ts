import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

declare const globalThis: {
  prisma?: PrismaClient;
} & typeof global;

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  if (process.env.NODE_ENV === 'production' && !authToken) {
    throw new Error('DATABASE_AUTH_TOKEN environment variable is not set in production');
  }

  // Prisma 7: PrismaLibSql takes a config object directly, not a pre-created client
  const adapter = new PrismaLibSql(
    authToken ? { url, authToken } : { url }
  );

  return new PrismaClient({ adapter });
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
