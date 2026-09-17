/**
 * Applies the init migration SQL directly to Turso via the libsql HTTP client.
 * Run once before first deploy:
 *   node scripts/apply-migration.mjs
 */
import { createClient } from '@libsql/client/http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error('ERROR: DATABASE_URL is not set');
  process.exit(1);
}

const client = authToken
  ? createClient({ url, authToken })
  : createClient({ url });

const sqlPath = join(__dirname, '../prisma/migrations/20260804130906_init/migration.sql');
const sql = readFileSync(sqlPath, 'utf8');

// Split into individual statements (ignore empty lines)
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Applying ${statements.length} SQL statements to Turso...`);

let applied = 0;
let skipped = 0;

for (const stmt of statements) {
  try {
    await client.execute(stmt + ';');
    applied++;
  } catch (err) {
    // Table/index already exists — safe to skip
    if (err.message?.includes('already exists')) {
      skipped++;
    } else {
      console.error(`FAILED: ${stmt.substring(0, 60)}...`);
      console.error(err.message);
    }
  }
}

console.log(`Done. Applied: ${applied}, Already existed (skipped): ${skipped}`);

// Check tables were created
const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
console.log('\nTables in Turso DB:');
result.rows.forEach(r => console.log(' -', r.name));
