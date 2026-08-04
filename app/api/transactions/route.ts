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

export async function GET(request: NextRequest) {
  const authUser = await getAuthUser(request);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await pool.query(
    "SELECT label, date, type, amount FROM transactions WHERE user_id = $1 ORDER BY id ASC",
    [authUser.userId]
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authUser.isBlocked) {
      return NextResponse.json({ error: "Account blocked" }, { status: 403 });
    }

    const body = await request.json();
    const amountStr = String(body.amount || "").trim();
    const type = body.type === "Withdrawal" ? "Withdrawal" : "Deposit";
    const payoutWalletAddress = String(body.payoutWalletAddress || "").trim();

    if (!amountStr) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const amount = Number(amountStr.replace(/[^0-9.-]/g, ""));
    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    if (type === "Withdrawal" && !payoutWalletAddress) {
      return NextResponse.json({ error: "Payout wallet address is required for withdrawals" }, { status: 400 });
    }

    if (type === "Withdrawal") {
      const result = await pool.query(
        `INSERT INTO withdrawals (user_id, amount, wallet_address, status) VALUES ($1, $2, $3, 'pending') RETURNING id, amount, wallet_address, status, created_at`,
        [authUser.userId, `$${amount.toLocaleString()}`, payoutWalletAddress]
      );

      try {
        await sendEmail({
          to: authUser.email,
          subject: "Withdrawal request received",
          html: `
            <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
              <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
                <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">Withdrawal request received</h1>
                </div>
                <div style="padding: 28px 32px;">
                  <p style="margin: 0 0 16px; font-size: 16px;">Hi ${authUser.name || "there"},</p>
                  <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">We have received your withdrawal request for <strong>$${amount.toLocaleString()}</strong>.</p>
                  <div style="background: #f2f5fb; border-radius: 12px; padding: 16px; margin: 0 0 20px;">
                    <p style="margin: 0 0 8px; font-weight: 700;">Details</p>
                    <p style="margin: 0; font-size: 15px; line-height: 1.6;">Your payout wallet: ${payoutWalletAddress}</p>
                    <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.6;">Status: Pending admin approval</p>
                  </div>
                  <p style="margin: 0; font-size: 16px;">Regards,<br/>The AeroneX Team</p>
                </div>
              </div>
            </div>
          `,
          text: `Hi ${authUser.name || "there"},\n\nWe have received your withdrawal request for $${amount.toLocaleString()}.\nYour payout wallet: ${payoutWalletAddress}\nStatus: Pending admin approval\n\nRegards,\nThe AeroneX Team`,
        });
      } catch (emailError) {
        console.error("Withdrawal email send failed:", emailError);
      }

      return NextResponse.json({ success: true, withdrawal: result.rows[0] });
    }

    const label = "Deposit via crypto";
    const formattedAmount = "+" + formatCurrency(amount);
    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const result = await pool.query(
      "INSERT INTO transactions (user_id, label, date, type, amount) VALUES ($1, $2, $3, $4, $5) RETURNING label, date, type, amount",
      [authUser.userId, label, date, type, formattedAmount]
    );

    try {
      await sendEmail({
        to: authUser.email,
        subject: "AeroneX Deposit received",
        html: `
          <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
              <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">Deposit received</h1>
              </div>
              <div style="padding: 28px 32px;">
                <p style="margin: 0 0 16px; font-size: 16px;">Hi ${authUser.name || "there"},</p>
                <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">We have received your deposit request for <strong>${formattedAmount}</strong>.</p>
                <div style="background: #f2f5fb; border-radius: 12px; padding: 16px; margin: 0 0 20px;">
                  <p style="margin: 0 0 8px; font-weight: 700;">Details</p>
                  <p style="margin: 0; font-size: 15px; line-height: 1.6;">Please use the admin deposit wallet address to fund your account.</p>
                </div>
                <p style="margin: 0; font-size: 16px;">Regards,<br/>The AeroneX Team</p>
              </div>
            </div>
          </div>
        `,
        text: `Hi ${authUser.name || "there"},\n\nWe have received your deposit request for ${formattedAmount}.\nPlease use the admin deposit wallet address to fund your account.\n\nRegards,\nThe AeroneX Team`,
      });
    } catch (emailError) {
      console.error("Transaction email send failed:", emailError);
    }

    return NextResponse.json({ success: true, transaction: result.rows[0] });
  } catch (error) {
    console.error("Transaction save error:", error);
    return NextResponse.json({ error: "Unable to save transaction" }, { status: 500 });
  }
}

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

