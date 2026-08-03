import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

sql`SELECT 1`
  .then(() => console.log("DB OK"))
  .catch((e) => console.error("DB ERROR:", e.message));
