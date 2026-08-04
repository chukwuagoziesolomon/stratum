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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const chatId = Number(params.id);
  const { reply } = await request.json();
  const adminReply = String(reply || "").trim();

  if (!adminReply) {
    return NextResponse.json({ error: "Reply is required" }, { status: 400 });
  }

  const chat = await pool.query("SELECT id, user_id, user_email, user_name FROM chat_messages WHERE id = $1", [chatId]);
  if (chat.rows.length === 0) {
    return NextResponse.json({ error: "Chat message not found" }, { status: 404 });
  }

  const chatData = chat.rows[0];
  await pool.query(
    "UPDATE chat_messages SET reply = $1, is_from_admin = true WHERE id = $2",
    [adminReply, chatId]
  );

  try {
    await sendEmail({
      to: chatData.user_email,
      subject: "AeroneX Support Reply",
      html: `
        <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
            <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">Support Reply</h1>
            </div>
            <div style="padding: 28px 32px;">
              <p style="margin: 0 0 16px; font-size: 16px;">Hi ${chatData.user_name},</p>
              <div style="background: #f2f5fb; border-radius: 12px; padding: 18px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7;">${adminReply}</p>
              </div>
              <p style="margin: 24px 0 0; font-size: 16px;">Thanks,<br/>The AeroneX Support Team</p>
            </div>
          </div>
        </div>
      `,
      text: `Hi ${chatData.user_name},\n\n${adminReply}\n\nThanks,\nThe AeroneX Support Team`,
    });
  } catch (emailError) {
    console.error("Chat reply email send failed:", emailError);
  }

  return NextResponse.json({ success: true });
}
