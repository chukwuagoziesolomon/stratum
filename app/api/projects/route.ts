import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT title, category, location, status, summary FROM projects ORDER BY id ASC");
  return NextResponse.json(result.rows);
}
