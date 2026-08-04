import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/email";

const VERIFICATION_CODE_TTL_MINUTES = 15;

function createVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, country, referralId } = await request.json();

    if (!email || !password || !name || !phone || !country) {
      return NextResponse.json({ error: "Please fill in all required signup fields." }, { status: 400 });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = createVerificationCode();

    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name, phone, country, referral_id, email_verified, verification_code, verification_code_expires_at) VALUES ($1, $2, $3, $4, $5, $6, false, $7, NOW() + INTERVAL '15 minutes') RETURNING id, email, name",
      [email, passwordHash, name, phone, country, referralId || null, verificationCode]
    );

    const user = result.rows[0];

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your AeroneX account",
        html: `
          <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
              <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">Verify your email</h1>
              </div>
              <div style="padding: 28px 32px;">
                <p style="margin: 0 0 16px; font-size: 16px;">Hi ${user.name},</p>
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">Use the code below to verify your email address and complete account setup.</p>
                <p style="margin: 0 0 24px; font-size: 28px; font-weight: 700; letter-spacing: 0.08em;">${verificationCode}</p>
                <p style="margin: 0; font-size: 16px; line-height: 1.7;">This code expires in ${VERIFICATION_CODE_TTL_MINUTES} minutes.</p>
              </div>
            </div>
          </div>
        `,
        text: `Hi ${user.name},\n\nUse the code ${verificationCode} to verify your AeroneX account.\nThis code expires in ${VERIFICATION_CODE_TTL_MINUTES} minutes.\n\nThanks,\nThe AeroneX Team`,
      });
    } catch (emailError) {
      console.error("Verification email send failed:", emailError);
      return NextResponse.json({ error: "Failed to send verification code. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ success: true, email: user.email });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
