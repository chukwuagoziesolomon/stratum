import { Pool } from "pg";

class SafePool {
  private pool?: Pool;

  constructor() {
    if (process.env.DATABASE_URL) {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      });
    }
  }

  async query(queryTextOrConfig: any, valuesOrCallback?: any, callback?: any) {
    if (!this.pool) {
      console.warn("DATABASE_URL is not configured; returning empty query result.");
      return { rows: [], rowCount: 0, command: "", oid: 0, fields: [] } as any;
    }

    try {
      return await this.pool.query(queryTextOrConfig, valuesOrCallback, callback);
    } catch (error) {
      console.error("Database query failed:", error);
      return { rows: [], rowCount: 0, command: "", oid: 0, fields: [] } as any;
    }
  }

  async end() {
    if (!this.pool) {
      return undefined;
    }

    return this.pool.end();
  }
}

const pool = new SafePool();

export default pool;
