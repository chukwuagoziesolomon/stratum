import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("stratum_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };
    const adminId = decoded.userId;

    const { messageId, reply } = await request.json();
    if (!messageId || !reply) {
      return NextResponse.json({ error: "Missing message id or reply" }, { status: 400 });
    }

    const result = await pool.query("SELECT email, name FROM support_messages WHERE id = $1", [messageId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Support message not found" }, { status: 404 });
    }

    const { email, name } = result.rows[0];
    await pool.query(
      "UPDATE support_messages SET reply = $1, status = 'resolved', admin_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      [reply, adminId, messageId]
    );

    await sendEmail({
      to: email,
      subject: `Response from Stratum support: ${messageId}`,
      html: `
        <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
            <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">Support Reply</h1>
            </div>
            <div style="padding: 28px 32px;">
              <p style="margin: 0 0 16px; font-size: 16px;">Hi ${name},</p>
              <div style="background: #f2f5fb; border-radius: 12px; padding: 18px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7;">${reply}</p>
              </div>
              <p style="margin: 24px 0 0; font-size: 16px;">Thanks,<br/>The Stratum Support Team</p>
            </div>
          </div>
        </div>
      `,
      text: `Hi ${name},\n\n${reply}\n\nThanks,\nThe Stratum Support Team`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send support reply" }, { status: 500 });
  }
}
