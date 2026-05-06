import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

// Lazy-load database connection (allows dotenv to load first)
let _db: ReturnType<typeof drizzle> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    if (!_db) {
      const sql = neon(process.env.DATABASE_URL!);
      _db = drizzle(sql, { schema });
    }
    return (_db as any)[prop];
  }
});
