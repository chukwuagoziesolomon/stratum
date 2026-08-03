import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await pool.query("SELECT title, body FROM ways_to_invest ORDER BY id ASC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch ways-to-invest content:", error);
    return NextResponse.json([], { status: 200 });
  }
}
