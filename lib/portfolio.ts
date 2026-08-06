import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export type AuthUser = {
  userId: number;
  email: string;
  name: string;
  isAdmin: boolean;
  isBlocked: boolean;
};

export async function getAuthenticatedUser(request: NextRequest | Request): Promise<AuthUser | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("stratum_token="))
    ?.split("=")[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string; isAdmin?: boolean; isBlocked?: boolean };
    const result = await pool.query(
      "SELECT id, email, name, is_admin, is_blocked FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.is_admin === true || decoded.isAdmin === true,
      isBlocked: user.is_blocked === true || decoded.isBlocked === true,
    };
  } catch {
    return null;
  }
}

export async function sendDepositDecisionEmail({
  to,
  name,
  amount,
  status,
  walletCoin,
  walletNetwork,
  reason,
}: {
  to: string;
  name: string;
  amount: string;
  status: "approved" | "declined";
  walletCoin?: string;
  walletNetwork?: string;
  reason?: string;
}) {
  const subject = status === "approved" ? "Deposit approved" : "Deposit declined";
  const body = status === "approved"
    ? `Hi ${name},\n\nYour deposit for ${amount} has been approved and is now available for investment.\nCoin: ${walletCoin || "N/A"}\nNetwork: ${walletNetwork || "N/A"}\n\nRegards,\nThe AeroneX Team`
    : `Hi ${name},\n\nYour deposit for ${amount} was declined.${reason ? `\nReason: ${reason}` : ""}\n\nRegards,\nThe AeroneX Team`;

  await sendEmail({
    to,
    subject,
    html: `<div style="font-family: system-ui, sans-serif; padding: 24px;"><div style="max-width: 560px; margin: auto; background: white; border-radius: 16px; padding: 24px; border: 1px solid #e7e9ed;"><h2 style="margin-top: 0;">${subject}</h2><p>${status === "approved" ? `Your deposit for ${amount} has been approved and is now available for investment.<br/>Coin: ${walletCoin || "N/A"}<br/>Network: ${walletNetwork || "N/A"}` : `Your deposit for ${amount} was declined.${reason ? `<br/><br/>Reason: ${reason}` : ""}`}</p><p>Regards,<br/>The AeroneX Team</p></div></div>`,
    text: body,
  });
}

export async function syncInvestmentProgress(userId?: number) {
  const result = await pool.query(
    `SELECT id, user_id, current_percentage, target_percentage, auto_increment_interval_hours, last_increment_at, created_at, amount, return_percentage, profit_distributed
     FROM investments
     WHERE status = 'active' AND current_percentage < target_percentage${userId ? " AND user_id = $1" : ""}`,
    userId ? [userId] : undefined
  );

  for (const investment of result.rows) {
    const lastIncrementAt = investment.last_increment_at ? new Date(investment.last_increment_at) : new Date(investment.created_at);
    const now = new Date();
    const intervalMs = Math.max(1, Number(investment.auto_increment_interval_hours || 24)) * 60 * 60 * 1000;
    const elapsedMs = now.getTime() - lastIncrementAt.getTime();
    const intervals = Math.floor(elapsedMs / intervalMs);

    if (intervals <= 0) {
      continue;
    }

    const nextPercentage = Math.min(Number(investment.target_percentage), Number(investment.current_percentage) + intervals);
    const nextLastIncrementAt = new Date(lastIncrementAt.getTime() + intervals * intervalMs);
    const status = nextPercentage >= Number(investment.target_percentage) ? "completed" : "active";
    const completedAt = status === "completed" ? now : null;

    await pool.query(
      `UPDATE investments
       SET current_percentage = $1,
           last_increment_at = $2,
           status = $3,
           completed_at = $4
       WHERE id = $5`,
      [nextPercentage, nextLastIncrementAt, status, completedAt, investment.id]
    );

    if (status === "completed" && !investment.profit_distributed) {
      const numericAmount = Number(String(investment.amount).replace(/[^0-9.-]/g, "")) || 0;
      const returnPercentage = Number(investment.return_percentage) || 10;
      const profitAmount = numericAmount * (returnPercentage / 100);
      const profitLabel = "Investment profit distribution";
      const profitDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      await pool.query(
        "INSERT INTO transactions (user_id, label, date, type, amount, status) VALUES ($1, $2, $3, $4, $5, 'approved')",
        [investment.user_id, profitLabel, profitDate, "Deposit", `+$${profitAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]
      );

      await pool.query("UPDATE investments SET profit_distributed = true WHERE id = $1", [investment.id]);

      const userResult = await pool.query("SELECT email, name FROM users WHERE id = $1", [investment.user_id]);
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        try {
          await sendEmail({
            to: user.email,
            subject: "Investment profit distributed",
            html: `
              <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
                <div style="max-width: 560px; margin: auto; background: white; border-radius: 16px; padding: 24px; border: 1px solid #e7e9ed;">
                  <h2 style="margin-top: 0;">Profit Distributed</h2>
                  <p>Hi ${user.name},</p>
                  <p>Your investment has completed and a profit of <strong>$${profitAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> has been credited to your available balance.</p>
                  <p>Regards,<br/>The AeroneX Team</p>
                </div>
              </div>
            `,
            text: `Hi ${user.name},\n\nYour investment has completed and a profit of $${profitAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has been credited to your available balance.\n\nRegards,\nThe AeroneX Team`,
          });
        } catch (emailError) {
          console.error("Profit distribution email failed:", emailError);
        }
      }
    }
  }
}

export async function sendWithdrawalDecisionEmail({
  to,
  name,
  amount,
  status,
  reason,
}: {
  to: string;
  name: string;
  amount: string;
  status: "approved" | "declined";
  reason?: string;
}) {
  const subject = status === "approved" ? "Withdrawal approved" : "Withdrawal declined";
  const body = status === "approved"
    ? `Hi ${name},\n\nYour withdrawal request for ${amount} has been approved and will be processed shortly.\n\nRegards,\nThe AeroneX Team`
    : `Hi ${name},\n\nYour withdrawal request for ${amount} was declined.${reason ? `\nReason: ${reason}` : ""}\n\nRegards,\nThe AeroneX Team`;

  await sendEmail({
    to,
    subject,
    html: `<div style="font-family: system-ui, sans-serif; padding: 24px;"><div style="max-width: 560px; margin: auto; background: white; border-radius: 16px; padding: 24px; border: 1px solid #e7e9ed;"><h2 style="margin-top: 0;">${subject}</h2><p>${status === "approved" ? `Your withdrawal request for ${amount} has been approved and will be processed shortly.` : `Your withdrawal request for ${amount} was declined.${reason ? `<br/><br/>Reason: ${reason}` : ""}`}</p><p>Regards,<br/>The AeroneX Team</p></div></div>`,
    text: body,
  });
}
