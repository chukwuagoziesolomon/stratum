import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/email";

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
  const { userId, amount, label, type } = body;

  if (!userId || !amount) {
    return NextResponse.json({ error: "User ID and amount are required" }, { status: 400 });
  }

  const numericAmount = Number(String(amount).replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const targetUser = await pool.query("SELECT id, email, name FROM users WHERE id = $1", [userId]);
  if (targetUser.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const transactionType = type === "Investment Profit" ? "Investment Profit" : "Deposit";
  const formattedAmount = type === "Investment Profit" ? `+$${numericAmount.toLocaleString()}` : `+$${numericAmount.toLocaleString()}`;
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const transactionLabel = label || `Manual ${transactionType}`;

  await pool.query(
    "INSERT INTO transactions (user_id, label, date, type, amount, status) VALUES ($1, $2, $3, $4, $5, 'approved')",
    [userId, transactionLabel, date, transactionType, formattedAmount]
  );

  try {
    await sendEmail({
      to: targetUser.rows[0].email,
      subject: "Profit credited to your account",
      html: `
        <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
          <div style="max-width: 560px; margin: auto; background: white; border-radius: 16px; padding: 24px; border: 1px solid #e7e9ed;">
            <h2 style="margin-top: 0;">Profit Credited</h2>
            <p>Hi ${targetUser.rows[0].name},</p>
            <p>A manual profit of <strong>$${numericAmount.toLocaleString()}</strong> has been credited to your account.</p>
            <p>Regards,<br/>The AeroneX Team</p>
          </div>
        </div>
      `,
      text: `Hi ${targetUser.rows[0].name},\n\nA manual profit of $${numericAmount.toLocaleString()} has been credited to your account.\n\nRegards,\nThe AeroneX Team`,
    });
  } catch (emailError) {
    console.error("Profit credit email failed:", emailError);
  }

  return NextResponse.json({ success: true });
}
