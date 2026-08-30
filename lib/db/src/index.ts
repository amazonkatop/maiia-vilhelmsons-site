import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Supabase pooler requires TLS. rejectUnauthorized:false avoids failures on
// incomplete local CA chains (common on Windows). Set DATABASE_SSL=disable
// only for local non-TLS Postgres.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "disable"
      ? false
      : { rejectUnauthorized: false },
});
export const db = drizzle(pool, { schema });

export * from "./schema";
