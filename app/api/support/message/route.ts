import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, body } = await request.json();
    if (!name || !email || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = request.cookies.get("stratum_token")?.value;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        userId = decoded.userId;
      } catch {
        userId = null;
      }
    }

    const result = await pool.query(
      "INSERT INTO support_messages (user_id, email, name, subject, body) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [userId, email, name, subject, body]
    );

    await sendEmail({
      to: process.env.SUPPORT_EMAIL || email,
      subject: `Support request: ${subject}`,
      html: `
        <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
            <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">New Support Request</h1>
            </div>
            <div style="padding: 28px 32px;">
              <p style="margin: 0 0 16px; font-size: 16px;">A new support request was submitted and requires your review.</p>
              <div style="background: #f2f5fb; border-radius: 12px; padding: 16px; margin: 0 0 16px;">
                <p style="margin: 0 0 8px; font-weight: 700;">Request details</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.6;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.6;"><strong>Subject:</strong> ${subject}</p>
              </div>
              <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e7e9ed; padding: 16px;">
                <p style="margin: 0 0 8px; font-weight: 700;">Message</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.7;">${body}</p>
              </div>
            </div>
          </div>
        </div>
      `,
      text: `New support request\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${body}`,
    });

    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit support message" }, { status: 500 });
  }
}
