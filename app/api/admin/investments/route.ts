import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

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
  if (!user.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const investmentId = Number(body.investmentId);
  const percentage = Number(body.percentage);

  if (!investmentId || Number.isNaN(percentage)) {
    return NextResponse.json({ error: "Investment ID and percentage are required" }, { status: 400 });
  }

  const investment = await pool.query("SELECT id, current_percentage, target_percentage FROM investments WHERE id = $1", [investmentId]);
  if (investment.rows.length === 0) {
    return NextResponse.json({ error: "Investment not found" }, { status: 404 });
  }

  const current = investment.rows[0];
  const newPercentage = Math.min(percentage, current.target_percentage);
  const now = new Date().toISOString();
  const status = newPercentage >= current.target_percentage ? "completed" : "active";
  const completedAt = status === "completed" ? now : null;

  await pool.query(
    "UPDATE investments SET current_percentage = $1, last_increment_at = $2, status = $3, completed_at = $4 WHERE id = $5",
    [newPercentage, now, status, completedAt, investmentId]
  );

  return NextResponse.json({ success: true, currentPercentage: newPercentage, status });
}
