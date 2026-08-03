import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT label, date, amount FROM transactions ORDER BY id ASC LIMIT 4");
  return NextResponse.json(result.rows);
}
