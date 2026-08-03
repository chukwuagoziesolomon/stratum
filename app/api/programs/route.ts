import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT name, code, min_investment, max_investment, horizon, historical_range, strata, risk_label, description FROM programs ORDER BY strata ASC");
  return NextResponse.json(result.rows);
}
