import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT label, value, change, up, icon FROM stats ORDER BY id ASC");
  return NextResponse.json(result.rows);
}
