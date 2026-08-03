import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("stratum_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };
    const body = await request.json();
    const twoFactorEnabled = body.twoFactorEnabled;

    if (typeof twoFactorEnabled !== "boolean") {
      return NextResponse.json({ error: "Invalid two factor value" }, { status: 400 });
    }

    await pool.query(
      "UPDATE users SET two_factor_enabled = $1 WHERE id = $2",
      [twoFactorEnabled, decoded.userId]
    );

    return NextResponse.json({ success: true, twoFactorEnabled });
  } catch (error) {
    console.error("Security update error:", error);
    return NextResponse.json({ error: "Unable to update security settings" }, { status: 500 });
  }
}
