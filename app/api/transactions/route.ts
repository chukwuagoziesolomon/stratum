import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

export async function GET() {
  const result = await pool.query("SELECT label, date, type, amount FROM transactions ORDER BY id ASC");
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("stratum_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };
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

    const label =
      type === "Deposit"
        ? "Deposit via crypto"
        : `Withdrawal to payout wallet ${payoutWalletAddress}`;
    const sign = type === "Withdrawal" ? "-" : "+";
    const formattedAmount = sign + formatCurrency(amount);
    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const result = await pool.query(
      "INSERT INTO transactions (label, date, type, amount) VALUES ($1, $2, $3, $4) RETURNING label, date, type, amount",
      [label, date, type, formattedAmount]
    );

    return NextResponse.json({ success: true, transaction: result.rows[0] });
  } catch (error) {
    console.error("Transaction save error:", error);
    return NextResponse.json({ error: "Unable to save transaction" }, { status: 500 });
  }
}

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
