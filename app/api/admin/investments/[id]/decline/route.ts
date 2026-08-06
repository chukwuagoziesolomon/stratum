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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const investmentId = Number(params.id);
  if (!investmentId) {
    return NextResponse.json({ error: "Investment ID is required" }, { status: 400 });
  }

  const investmentResult = await pool.query("SELECT id FROM investments WHERE id = $1", [investmentId]);
  if (investmentResult.rows.length === 0) {
    return NextResponse.json({ error: "Investment not found" }, { status: 404 });
  }

  await pool.query("UPDATE investments SET status = 'declined' WHERE id = $1", [investmentId]);

  return NextResponse.json({ success: true });
}
