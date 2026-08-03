import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at",
      [email, passwordHash, name]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

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
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">Your account is now active. You can fund it using the crypto deposit wallet configured in your dashboard.</p>
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Once your first deposit clears, your holdings and performance will appear in your account immediately.</p>
                <p style="margin: 0; font-size: 16px;">Thanks,<br/>The AeroneX Team</p>
              </div>
            </div>
          </div>
        `,
        text: `Hi ${user.name},\n\nWelcome to AeroneX Oil & Gas. Your account is active and can be funded through the crypto deposit wallet in your dashboard.\n\nOnce your first deposit clears, holdings and performance will appear in your account.\n\nThanks,\nThe AeroneX Team`,
      });
    } catch (emailError) {
      console.error("Welcome email send failed:", emailError);
    }

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });

    response.cookies.set("stratum_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
