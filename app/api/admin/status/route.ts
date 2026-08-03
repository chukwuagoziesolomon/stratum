import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT count(*) FROM users WHERE is_admin = true");
  const hasAdmins = Number(result.rows[0].count) > 0;
  return NextResponse.json({ hasAdmins });
}
