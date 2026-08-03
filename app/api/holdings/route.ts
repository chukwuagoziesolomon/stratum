import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT name, code, value, weight, ytd, units FROM holdings ORDER BY id ASC");
  return NextResponse.json(result.rows);
}
