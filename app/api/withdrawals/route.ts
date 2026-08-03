import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendWithdrawalDecisionEmail } from "@/lib/portfolio";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get("stratum_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };
    const result = await pool.query("SELECT id, email, name, is_admin, is_blocked FROM users WHERE id = $1", [decoded.userId]);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return { userId: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === true, isBlocked: user.is_blocked === true };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.isBlocked) return NextResponse.json({ error: "Account blocked" }, { status: 403 });

  const body = await request.json();
  const amount = String(body.amount || "").trim();
  const walletAddress = String(body.walletAddress || "").trim();

  if (!amount || !walletAddress) {
    return NextResponse.json({ error: "Amount and wallet address are required" }, { status: 400 });
  }

  const numericAmount = Number(amount.replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO withdrawals (user_id, amount, wallet_address, status) VALUES ($1, $2, $3, 'pending') RETURNING id, user_id, amount, wallet_address, status, reason, created_at, processed_at`,
    [user.userId, `$${numericAmount.toLocaleString()}`, walletAddress]
  );

  return NextResponse.json({ success: true, withdrawal: result.rows[0] });
}

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.isAdmin) {
    const result = await pool.query(
      `SELECT w.id, w.user_id, u.name as user_name, u.email as user_email, w.amount, w.wallet_address, w.status, w.reason, w.created_at, w.processed_at
       FROM withdrawals w JOIN users u ON w.user_id = u.id ORDER BY w.created_at DESC`
    );
    return NextResponse.json(result.rows);
  }

  const result = await pool.query(
    "SELECT id, amount, wallet_address, status, reason, created_at, processed_at FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC",
    [user.userId]
  );
  return NextResponse.json(result.rows);
}
