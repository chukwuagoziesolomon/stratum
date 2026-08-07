import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendDepositDecisionEmail } from "@/lib/portfolio";

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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const depositId = Number(id);
  const body = await request.json();
  const reason = body.reason ? String(body.reason).trim() : null;

  if (!reason) {
    return NextResponse.json({ error: "A reason is required to decline a deposit." }, { status: 400 });
  }

  const depositResult = await pool.query(
    "SELECT t.id, t.user_id, t.amount, t.status, u.email, u.name FROM transactions t JOIN users u ON t.user_id = u.id WHERE t.id = $1 AND t.type = 'Deposit'",
    [depositId]
  );

  if (depositResult.rows.length === 0) {
    return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
  }

  const deposit = depositResult.rows[0];
  if (deposit.status !== "pending") {
    return NextResponse.json({ error: "Deposit already processed" }, { status: 400 });
  }

  const now = new Date().toISOString();
  await pool.query("UPDATE transactions SET status = 'declined', processed_at = $1 WHERE id = $2", [now, depositId]);

  try {
    await sendDepositDecisionEmail({
      to: deposit.email,
      name: deposit.name,
      amount: deposit.amount,
      status: "declined",
      reason,
    });
  } catch (error) {
    console.error("Deposit decline email failed:", error);
  }

  return NextResponse.json({ success: true });
}
