import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("stratum_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };

    const result = await pool.query(
      "SELECT id, email, name, created_at, crypto_payout_address, two_factor_enabled FROM users WHERE id = $1",
      [decoded.userId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
