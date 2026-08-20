import { ArrowUpRight, ArrowDownRight, Wallet, Percent, CalendarClock, PiggyBank, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import NavChart from "@/components/NavChart";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const iconMap: Record<string, React.ElementType> = { Wallet, Percent, CalendarClock, PiggyBank };
const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

function parseCurrencyValue(value: string) {
  return Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
}

function absoluteCurrencyValue(value: string) {
  return Math.abs(parseCurrencyValue(value));
}

function createReferralCode() {
  return `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function ensureReferralCode(userId: number) {
  const existing = await pool.query("SELECT referral_code FROM users WHERE id = $1", [userId]);
  if (existing.rows.length > 0 && existing.rows[0].referral_code) {
    return existing.rows[0].referral_code;
  }

  let referralCode = createReferralCode();
  let tryCount = 0;
  while (tryCount < 5) {
    const duplicate = await pool.query("SELECT id FROM users WHERE referral_code = $1", [referralCode]);
    if (duplicate.rows.length === 0) {
      break;
    }
    referralCode = createReferralCode();
    tryCount += 1;
  }

  await pool.query("UPDATE users SET referral_code = $1 WHERE id = $2", [referralCode, userId]);
  return referralCode;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getCurrentUser() {
  const token = cookies().get("stratum_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };
  } catch {
    return null;
  }
}

export default async function DashboardOverview() {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const statsResult = await pool.query("SELECT label, value, change, up, icon FROM stats ORDER BY id ASC");
  const holdings = (await pool.query("SELECT name, code, value, weight, ytd, units FROM holdings WHERE user_id = $1 ORDER BY id ASC", [user.userId])).rows;
  const activity = (await pool.query("SELECT label, date, amount, status FROM transactions WHERE user_id = $1 ORDER BY id ASC LIMIT 4", [user.userId])).rows;
  const referralRow = (await pool.query("SELECT referral_code, referral_id FROM users WHERE id = $1", [user.userId])).rows[0] || {};
  const referralCode = referralRow.referral_code || (await ensureReferralCode(user.userId));
  const referredBy = referralRow.referral_id;
  const referralLink = `/signup?referralId=${referralCode}`;
  const depositTransactions = (await pool.query("SELECT amount, status FROM transactions WHERE user_id = $1 AND type = 'Deposit'", [user.userId])).rows;
  const approvedWithdrawals = (await pool.query("SELECT amount FROM withdrawals WHERE user_id = $1 AND status = 'approved'", [user.userId])).rows;
  const allInvestments = (await pool.query("SELECT amount FROM transactions WHERE user_id = $1 AND type = 'Investment'", [user.userId])).rows;

  const approvedDepositTotal = depositTransactions
    .filter((t: { amount: string; status: string }) => t.status === "approved")
    .reduce((sum: number, txn: { amount: string }) => sum + absoluteCurrencyValue(txn.amount), 0);

  const pendingDepositTotal = depositTransactions
    .filter((t: { amount: string; status: string }) => t.status === "pending")
    .reduce((sum: number, txn: { amount: string }) => sum + absoluteCurrencyValue(txn.amount), 0);

  const approvedWithdrawalTotal = approvedWithdrawals
    .reduce((sum: number, txn: { amount: string }) => sum + absoluteCurrencyValue(txn.amount), 0);

  const investedTotal = allInvestments
    .reduce((sum: number, txn: { amount: string }) => sum + absoluteCurrencyValue(txn.amount), 0);

  const holdingsValue = holdings.reduce((sum: number, h: { value: string }) => sum + parseCurrencyValue(h.value), 0);
  const availableBalance = Math.max(0, approvedDepositTotal - approvedWithdrawalTotal - investedTotal);
  const totalBalance = availableBalance + holdingsValue;

  const stats = statsResult.rows.map((s: { label: string; value: string; change: string; up: string; icon: string }) => ({
    label: s.label,
    value: s.value,
    change: s.change,
    up: s.up === "true" ? true : s.up === "false" ? false : null,
    icon: iconMap[s.icon] || Wallet,
  }));
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Overview</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
            {user ? `Welcome back, ${user.name}.` : "Welcome back."}
          </h1>
        </div>
        <Link
          href="/dashboard/transactions"
          className="rounded-sm border border-petrol-line px-4 py-2 font-display text-sm text-ink-high hover:border-brass/60"
        >
          Add funds
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Available cash", value: formatCurrency(availableBalance), change: "Ready to invest", up: null },
          { label: "Pending deposits", value: formatCurrency(pendingDepositTotal), change: "Awaiting admin approval", up: null },
          { label: "Total balance", value: formatCurrency(totalBalance), change: "Holdings + cash", up: null },
        ].map((s) => (
          <div key={s.label} className="rounded-md border border-petrol-line bg-petrol-panel p-5">
            <div className="flex items-center justify-between">
              <p className="font-body text-sm text-ink-muted">{s.label}</p>
              <Wallet size={16} className="text-brass" />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold text-ink-high">{s.value}</p>
            <p className="mt-1 flex items-center gap-1 font-mono text-xs text-ink-muted">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-md border border-petrol-line bg-petrol-panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-ink-high">Your referral link</h2>
            <p className="mt-1 font-body text-sm text-ink-muted">Share this link so new users can sign up with your referral code.</p>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-petrol-line/70 bg-petrol px-4 py-3 font-mono text-sm text-ink-high break-all">
          {referralLink}
        </div>
        {referredBy && (
          <p className="mt-3 text-sm text-ink-muted">Referred by code: {referredBy}</p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-md border border-petrol-line bg-petrol-panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink-high">Portfolio value over time</h2>
            <span className="font-mono text-xs text-ink-soft">Last 12 months</span>
          </div>
          <div className="mt-4 h-72">
            <NavChart />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-petrol-line bg-petrol-panel p-6">
            <h2 className="font-display text-base font-semibold text-ink-high">Recent activity</h2>
            <ul className="mt-4 space-y-4">
              {activity.map((a: { label: string; date: string; amount: string; status?: string }) => (
                <li key={`${a.label}-${a.date}`} className="flex items-start justify-between gap-3 border-b border-petrol-line/60 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-body text-sm text-ink-high">{a.label}</p>
                    <p className="font-mono text-xs text-ink-soft">
                      {a.date}
                      {a.status === "pending" ? " · Pending approval" : ""}
                    </p>
                  </div>
                  <span className={`shrink-0 font-mono text-sm ${a.amount.startsWith("+") ? "text-emerald-400" : "text-ink-muted"}`}>
                    {a.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/dashboard/invest"
            className="mt-4 flex items-center justify-center gap-2 rounded-sm border border-brass/50 bg-brass/10 py-4 font-display text-sm font-medium text-brass hover:bg-brass/15"
          >
            <TrendingUp size={16} />
            Browse investment opportunities
          </Link>
        </div>
      </div>



      <div className="mt-6 overflow-hidden rounded-md border border-petrol-line bg-petrol-panel">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="font-display text-base font-semibold text-ink-high">Holdings</h2>
          <Link href="/dashboard/holdings" className="font-display text-sm text-brass hover:text-brass-light">
            View all
          </Link>
        </div>
        <table className="mt-4 w-full text-left">
          <thead>
            <tr className="border-t border-petrol-line font-mono text-xs uppercase tracking-wider text-ink-soft">
              <th className="px-6 py-3 font-medium">Fund</th>
              <th className="px-6 py-3 font-medium">Value</th>
              <th className="px-6 py-3 font-medium">Weight</th>
              <th className="px-6 py-3 font-medium">YTD</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm">
            {holdings.map((h: { name: string; code: string; value: string; weight: string; ytd: string }) => (
              <tr key={h.code} className="border-t border-petrol-line/60">
                <td className="px-6 py-4">
                  <p className="text-ink-high">{h.name}</p>
                  <p className="font-mono text-xs text-ink-soft">{h.code}</p>
                </td>
                <td className="px-6 py-4 font-mono text-ink-high">{h.value}</td>
                <td className="px-6 py-4 font-mono text-ink-muted">{h.weight}</td>
                <td className={`px-6 py-4 font-mono ${h.ytd.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>{h.ytd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 font-body text-xs text-ink-soft">
        Figures shown are based on your account data. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
