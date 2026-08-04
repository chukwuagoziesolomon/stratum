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

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const result = await pool.query(
      "SELECT id, email, name, phone, country, created_at, crypto_payout_address, two_factor_enabled, email_verified, is_admin, is_blocked FROM users WHERE id = $1",
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

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("stratum_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const body = await request.json();
    const { name, phone, country, cryptoPayoutAddress } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }
    if (country !== undefined) {
      updates.push(`country = $${paramIndex++}`);
      values.push(country);
    }
    if (cryptoPayoutAddress !== undefined) {
      updates.push(`crypto_payout_address = $${paramIndex++}`);
      values.push(cryptoPayoutAddress);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(decoded.userId);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, email, name, phone, country, crypto_payout_address`,
      values
    );

    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
