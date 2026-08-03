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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const withdrawalId = Number(params.id);
  const body = await request.json();
  const reason = body.reason ? String(body.reason).trim() : null;

  const withdrawal = await pool.query("SELECT w.id, w.user_id, w.amount, w.status, u.email, u.name FROM withdrawals w JOIN users u ON w.user_id = u.id WHERE w.id = $1", [withdrawalId]);
  if (withdrawal.rows.length === 0) {
    return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
  }

  const w = withdrawal.rows[0];
  if (w.status !== "pending") {
    return NextResponse.json({ error: "Withdrawal already processed" }, { status: 400 });
  }

  const now = new Date().toISOString();
  await pool.query("UPDATE withdrawals SET status = 'approved', processed_at = $1 WHERE id = $2", [now, withdrawalId]);

  await sendWithdrawalDecisionEmail({
    to: w.email,
    name: w.name,
    amount: w.amount,
    status: "approved",
  });

  return NextResponse.json({ success: true });
}
