import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT title, body FROM sector_risks ORDER BY id ASC");
  return NextResponse.json(result.rows);
}
