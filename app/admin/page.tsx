import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import AdminClient from "@/components/AdminClient";
import DepositActions from "@/components/DepositActions";
import InvestmentForm from "@/components/InvestmentForm";
import InvestmentApprovalActions from "@/components/InvestmentApprovalActions";
import WithdrawalActions from "@/components/WithdrawalActions";
import ChatAdmin from "@/components/ChatAdmin";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

async function getCurrentUser() {
  const token = cookies().get("stratum_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const result = await pool.query("SELECT id, email, name, is_admin, is_blocked FROM users WHERE id = $1", [decoded.userId]);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return { userId: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === true, isBlocked: user.is_blocked === true };
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!user.isAdmin) {
    redirect("/dashboard");
  }

  const [usersRes, activeInvestmentsRes, pendingInvestmentsRes, withdrawalsRes, depositsRes, chatRes] = await Promise.all([
    pool.query("SELECT id, email, name, is_admin, is_blocked, created_at FROM users ORDER BY created_at DESC"),
    pool.query(`SELECT i.id, i.user_id, u.name as user_name, i.program_code, i.amount, i.current_percentage, i.target_percentage, i.auto_increment_interval_hours, i.last_increment_at, i.status, i.created_at, i.completed_at FROM investments i JOIN users u ON i.user_id = u.id WHERE i.status IN ('active', 'completed') ORDER BY i.created_at DESC`),
    pool.query(`SELECT i.id, i.user_id, u.name as user_name, i.program_code, i.amount, i.current_percentage, i.target_percentage, i.auto_increment_interval_hours, i.last_increment_at, i.status, i.created_at, i.completed_at FROM investments i JOIN users u ON i.user_id = u.id WHERE i.status = 'pending' ORDER BY i.created_at DESC`),
    pool.query(`SELECT w.id, w.user_id, u.name as user_name, u.email as user_email, w.amount, w.wallet_address, w.status, w.reason, w.created_at, w.processed_at FROM withdrawals w JOIN users u ON w.user_id = u.id ORDER BY w.created_at DESC`),
    pool.query(`SELECT t.id, t.user_id, u.name as user_name, u.email as user_email, t.amount, t.date, t.wallet_coin, t.wallet_network, t.status FROM transactions t JOIN users u ON t.user_id = u.id WHERE t.type = 'Deposit' AND t.status = 'pending' ORDER BY t.id DESC`),
    pool.query(`SELECT id, user_id, user_name, user_email, message, reply, is_from_admin, created_at FROM chat_messages ORDER BY created_at DESC LIMIT 50`),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Admin</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
        Admin dashboard
      </h1>
      <p className="mt-2 font-body text-sm text-ink-muted">
        Manage users, investments, and withdrawals.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-md border border-petrol-line bg-petrol-panel p-6">
            <h2 className="font-display text-lg font-semibold text-ink-high">Users</h2>
            <p className="mt-1 font-body text-sm text-ink-muted">Block or unblock accounts.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm">
                  {usersRes.rows.map((u: { id: number; name: string; email: string; is_blocked: boolean }) => (
                    <tr key={u.id} className="border-t border-petrol-line/60">
                      <td className="px-4 py-3 text-ink-high">{u.name}</td>
                      <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs ${u.is_blocked ? "text-red-400" : "text-emerald-400"}`}>
                          {u.is_blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdminClient user={{ ...user, id: user.userId, isBlocked: user.isBlocked }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md border border-petrol-line bg-petrol-panel p-6">
            <h2 className="font-display text-lg font-semibold text-ink-high">Pending investment approvals</h2>
            <p className="mt-1 font-body text-sm text-ink-muted">Approve or decline new investment requests.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Program</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Requested</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm">
                  {pendingInvestmentsRes.rows.map((inv: { id: number; user_name: string; program_code: string; amount: string; current_percentage: number; target_percentage: number; status: string }) => (
                    <tr key={inv.id} className="border-t border-petrol-line/60">
                      <td className="px-4 py-3 text-ink-high">{inv.user_name}</td>
                      <td className="px-4 py-3 text-ink-muted">{inv.program_code}</td>
                      <td className="px-4 py-3 text-ink-muted">{inv.amount}</td>
                      <td className="px-4 py-3 text-ink-high">{inv.current_percentage}% / {inv.target_percentage}%</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-brass">{inv.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <InvestmentApprovalActions id={inv.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md border border-petrol-line bg-petrol-panel p-6">
            <h2 className="font-display text-lg font-semibold text-ink-high">Investments</h2>
            <p className="mt-1 font-body text-sm text-ink-muted">Manually update investment progress.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Program</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm">
                  {activeInvestmentsRes.rows.map((inv: { id: number; user_name: string; program_code: string; amount: string; current_percentage: number; target_percentage: number; status: string }) => (
                    <tr key={inv.id} className="border-t border-petrol-line/60">
                      <td className="px-4 py-3 text-ink-high">{inv.user_name}</td>
                      <td className="px-4 py-3 text-ink-muted">{inv.program_code}</td>
                      <td className="px-4 py-3 text-ink-muted">{inv.amount}</td>
                      <td className="px-4 py-3 text-ink-high">{inv.current_percentage}% / {inv.target_percentage}%</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs ${inv.status === "completed" ? "text-emerald-400" : "text-brass"}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <InvestmentForm id={inv.id} current={inv.current_percentage} target={inv.target_percentage} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md border border-petrol-line bg-petrol-panel p-6">
            <h2 className="font-display text-lg font-semibold text-ink-high">Withdrawals</h2>
            <p className="mt-1 font-body text-sm text-ink-muted">Approve or decline pending withdrawals.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Wallet</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm">
                  {withdrawalsRes.rows.map((w: { id: number; user_name: string; amount: string; wallet_address: string; wallet_coin?: string; wallet_network?: string; status: string }) => (
                    <tr key={w.id} className="border-t border-petrol-line/60">
                      <td className="px-4 py-3 text-ink-high">{w.user_name}</td>
                      <td className="px-4 py-3 text-ink-muted">{w.amount}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                        <div>{w.wallet_address}</div>
                        <div className="text-ink-muted">{w.wallet_coin || "BNB"} / {w.wallet_network || "BNB Smart Chain"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs ${w.status === "approved" ? "text-emerald-400" : w.status === "declined" ? "text-red-400" : "text-brass"}`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {w.status === "pending" && (
                          <WithdrawalActions id={w.id} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md border border-petrol-line bg-petrol-panel p-6">
            <h2 className="font-display text-lg font-semibold text-ink-high">Pending deposits</h2>
            <p className="mt-1 font-body text-sm text-ink-muted">Approve or decline user deposit requests.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Coin / Network</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm">
                  {depositsRes.rows.map((d: { id: number; user_name: string; amount: string; wallet_coin?: string; wallet_network?: string; date: string }) => (
                    <tr key={d.id} className="border-t border-petrol-line/60">
                      <td className="px-4 py-3 text-ink-high">{d.user_name}</td>
                      <td className="px-4 py-3 text-ink-muted">{d.amount}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-soft">{d.wallet_coin || "BNB"} / {d.wallet_network || "BNB Smart Chain"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-soft">{d.date}</td>
                      <td className="px-4 py-3">
                        <DepositActions id={d.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md border border-petrol-line bg-petrol-panel p-6">
            <h2 className="font-display text-lg font-semibold text-ink-high">Support chat</h2>
            <p className="mt-1 font-body text-sm text-ink-muted">View and reply to user chat messages.</p>
            <div className="mt-4">
              <ChatAdmin chats={chatRes.rows} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-md border border-petrol-line bg-petrol-panel p-6">
            <h2 className="font-display text-lg font-semibold text-ink-high">Admin info</h2>
            <p className="mt-2 font-body text-sm text-ink-muted">
              You are signed in as <span className="font-semibold text-ink-high">{user.name}</span> ({user.email}).
            </p>
            <p className="mt-2 font-body text-sm text-ink-muted">
              Use this panel to manage platform investments, withdrawals, and user access.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
