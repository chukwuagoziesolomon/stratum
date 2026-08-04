import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT id, title, description, category, location, minimum_investment, expected_return, duration, risk_level FROM opportunities WHERE is_active = true ORDER BY id ASC");
  return NextResponse.json(result.rows);
}
