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
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, reply, is_from_admin } = await request.json();
    const userMessage = String(message || "").trim();
    const adminReply = String(reply || "").trim();

    if (!userMessage && !adminReply) {
      return NextResponse.json({ error: "Message or reply is required" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO chat_messages (user_id, user_name, user_email, message, reply, is_from_admin)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, user_name, user_email, message, reply, is_from_admin, created_at`,
      [authUser.userId, authUser.name, authUser.email, userMessage || null, adminReply || null, is_from_admin || false]
    );

    return NextResponse.json({ success: true, chat: result.rows[0] });
  } catch (error) {
    console.error("Chat save error:", error);
    return NextResponse.json({ error: "Failed to save chat message" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authUser = await getAuthUser(request);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (authUser.isAdmin && userId) {
    const result = await pool.query(
      `SELECT id, user_id, user_name, user_email, message, reply, is_from_admin, created_at
       FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC`,
      [userId]
    );
    return NextResponse.json(result.rows);
  }

  if (authUser.isAdmin) {
    const result = await pool.query(
      `SELECT id, user_id, user_name, user_email, message, reply, is_from_admin, created_at
       FROM chat_messages ORDER BY created_at DESC LIMIT 100`
    );
    return NextResponse.json(result.rows);
  }

  const result = await pool.query(
    "SELECT id, user_id, user_name, message, reply, is_from_admin, created_at FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC",
    [authUser.userId]
  );
  return NextResponse.json(result.rows);
}
