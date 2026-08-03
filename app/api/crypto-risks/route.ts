import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT risk FROM crypto_risks ORDER BY id ASC");
  return NextResponse.json(result.rows.map((r: { risk: string }) => r.risk));
}
