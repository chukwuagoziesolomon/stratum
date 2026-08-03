import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT month, value FROM nav_history ORDER BY id ASC");
  return NextResponse.json(result.rows);
}
