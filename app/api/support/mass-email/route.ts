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

    const { subject, body, recipients } = await request.json();
    if (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pool.query(
      "INSERT INTO admin_emails (admin_id, subject, body, recipients, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)",
      [adminId, subject, body, recipients]
    );

    const sendPromises = recipients.map((recipient: string) =>
      sendEmail({
        to: recipient,
        subject,
        html: `
          <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 18px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
              <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">${subject}</h1>
              </div>
              <div style="padding: 28px 32px;">
                <p style="margin: 0 0 22px; font-size: 16px; line-height: 1.75;">${body}</p>
                <div style="border-top: 1px solid #e7e9ed; margin-top: 24px; padding-top: 18px; color: #475569; font-size: 13px;">
                  <p style="margin: 0; font-weight: 600;">Stratum Energy Partners</p>
                  <p style="margin: 6px 0 0;">Professional investing access for energy infrastructure and digital assets.</p>
                </div>
              </div>
            </div>
          </div>
        `,
        text: body,
      })
    );

    await Promise.all(sendPromises);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send mass email" }, { status: 500 });
  }
}
