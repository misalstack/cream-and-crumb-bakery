import { createClient } from '@libsql/client/http';

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const tables = ['Category', 'Product', 'StaffUser', 'GalleryImage'];
for (const t of tables) {
  const r = await client.execute(`SELECT COUNT(*) as cnt FROM "${t}"`);
  console.log(`${t}: ${r.rows[0].cnt} rows`);
}
