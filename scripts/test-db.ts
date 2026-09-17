import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@libsql/client/http';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

// Manually load .env before creating any clients
const envPath = resolve(process.cwd(), '.env');
const lines = readFileSync(envPath, 'utf8').split('\n');
for (const line of lines) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  const key = t.slice(0, eq).trim();
  let val = t.slice(eq + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  process.env[key] = val;
}

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 40));
  console.log('AUTH_TOKEN length:', process.env.DATABASE_AUTH_TOKEN?.length);

  const libsql = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  const adapter = new PrismaLibSql(libsql);
  const prisma = new PrismaClient({ adapter });

  const count = await prisma.staffUser.count();
  console.log('StaffUser count:', count);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
