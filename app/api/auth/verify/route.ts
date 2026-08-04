import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and verification code are required." }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT id, email, name, is_admin, verification_code, verification_code_expires_at, verification_code_expires_at > NOW() AS code_valid FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or code." }, { status: 404 });
    }

    const user = result.rows[0];
    if (!user.verification_code || !user.verification_code_expires_at) {
      return NextResponse.json({ error: "No verification code was generated for this account." }, { status: 400 });
    }

    if (!user.code_valid) {
      return NextResponse.json({ error: "Verification code has expired." }, { status: 400 });
    }

    if (code !== user.verification_code) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    await pool.query(
      "UPDATE users SET email_verified = true, verification_code = NULL, verification_code_expires_at = NULL WHERE id = $1",
      [user.id]
    );

    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to AeroneX Oil & Gas",
        html: `
          <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
              <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">Welcome to AeroneX Oil & Gas</h1>
              </div>
              <div style="padding: 28px 32px;">
                <p style="margin: 0 0 16px; font-size: 16px;">Hi ${user.name},</p>
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">Your account is now active and ready to use. You may fund it using the crypto deposit wallet configured in your dashboard.</p>
                <div style="background: #f2f5fb; border-radius: 12px; padding: 16px; margin: 0 0 20px;">
                  <p style="margin: 0; font-weight: 700;">What happens next</p>
                  <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.6;">Once your first deposit clears, your holdings and performance will appear in your account immediately.</p>
                </div>
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">If you have any questions, our support team is ready to help.</p>
                <p style="margin: 0; font-size: 16px;">Thanks,<br/>The AeroneX Team</p>
              </div>
            </div>
          </div>
        `,
        text: `Hi ${user.name},\n\nWelcome to AeroneX Oil & Gas. Your account is active and can be funded through the crypto deposit wallet in your dashboard.\n\nOnce your first deposit clears, holdings and performance will display in your account.\n\nThanks,\nThe AeroneX Team`,
      });
    } catch (welcomeError) {
      console.error("Welcome email failed:", welcomeError);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === true },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === true } });
    response.cookies.set("stratum_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Failed to verify email." }, { status: 500 });
  }
}
