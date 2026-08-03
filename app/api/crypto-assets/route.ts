import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT symbol, name, allocation_range, role FROM crypto_assets ORDER BY id ASC");
  return NextResponse.json(result.rows);
}
