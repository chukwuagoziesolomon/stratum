import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { syncInvestmentProgress, sendWithdrawalDecisionEmail } from "@/lib/portfolio";

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
  const programCode = String(body.programCode || "").trim().toUpperCase();
  const amount = String(body.amount || "").trim();

  if (!programCode || !amount) {
    return NextResponse.json({ error: "Program code and amount are required" }, { status: 400 });
  }

  const program = await pool.query("SELECT code, min_investment, max_investment FROM programs WHERE code = $1", [programCode]);
  if (program.rows.length === 0) {
    return NextResponse.json({ error: "Invalid program code" }, { status: 404 });
  }

  const numericAmount = Number(amount.replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO investments (user_id, program_code, amount, current_percentage, target_percentage, auto_increment_interval_hours, last_increment_at, status)
     VALUES ($1, $2, $3, 1, 100, 24, CURRENT_TIMESTAMP, 'active') RETURNING id, user_id, program_code, amount, current_percentage, target_percentage, status, created_at`,
    [user.userId, programCode, `$${numericAmount.toLocaleString()}`]
  );

  return NextResponse.json({ success: true, investment: result.rows[0] });
}

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (user.isAdmin && userId) {
    const result = await pool.query(
      `SELECT i.id, i.user_id, u.name as user_name, i.program_code, i.amount, i.current_percentage, i.target_percentage, i.auto_increment_interval_hours, i.last_increment_at, i.status, i.created_at, i.completed_at
       FROM investments i JOIN users u ON i.user_id = u.id WHERE i.user_id = $1 ORDER BY i.created_at DESC`,
      [userId]
    );
    return NextResponse.json(result.rows);
  }

  if (user.isAdmin) {
    const result = await pool.query(
      `SELECT i.id, i.user_id, u.name as user_name, i.program_code, i.amount, i.current_percentage, i.target_percentage, i.auto_increment_interval_hours, i.last_increment_at, i.status, i.created_at, i.completed_at
       FROM investments i JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC`
    );
    return NextResponse.json(result.rows);
  }

  const result = await pool.query(
    "SELECT id, program_code, amount, current_percentage, target_percentage, auto_increment_interval_hours, last_increment_at, status, created_at, completed_at FROM investments WHERE user_id = $1 ORDER BY created_at DESC",
    [user.userId]
  );
  return NextResponse.json(result.rows);
}
