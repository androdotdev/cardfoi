import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@/lib/db/schema";
import { isProduction } from "@/lib/environment";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL_POOLER;

if (!connectionString) {
  throw new Error("DATABASE_URL_POOLER is required for the application database connection.");
}

const globalForDb = globalThis as unknown as { pool?: Pool };
const pool = globalForDb.pool ?? new Pool({ connectionString });

if (!isProduction) {
  globalForDb.pool = pool;
}

export const db = drizzle({ client: pool, schema });
