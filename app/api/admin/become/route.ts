import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("stratum_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    const adminCount = await pool.query("SELECT count(*) FROM users WHERE is_admin = true");
    if (Number(adminCount.rows[0].count) > 0) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
    }

    await pool.query("UPDATE users SET is_admin = true WHERE id = $1", [decoded.userId]);

    return NextResponse.json({ success: true, message: "You are now an admin" });
  } catch (error) {
    console.error("Become admin error:", error);
    return NextResponse.json({ error: "Failed to become admin" }, { status: 500 });
  }
}
