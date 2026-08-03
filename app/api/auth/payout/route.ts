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
    const cryptoPayoutAddress = body.cryptoPayoutAddress?.trim();

    if (!cryptoPayoutAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    await pool.query(
      "UPDATE users SET crypto_payout_address = $1 WHERE id = $2",
      [cryptoPayoutAddress, decoded.userId]
    );

    return NextResponse.json({ success: true, cryptoPayoutAddress });
  } catch (error) {
    console.error("Payout wallet save error:", error);
    return NextResponse.json({ error: "Unable to save payout wallet address" }, { status: 500 });
  }
}
