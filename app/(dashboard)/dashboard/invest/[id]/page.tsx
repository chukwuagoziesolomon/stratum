import pool from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import UserInvestmentForm from "@/components/UserInvestmentForm";

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

export default async function InvestOpportunity({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.isBlocked) {
    redirect("/dashboard");
  }

  const opportunityId = Number(params.id);
  const result = await pool.query("SELECT id, title, description, category, location, minimum_investment, expected_return, duration, risk_level FROM opportunities WHERE id = $1", [opportunityId]);
  const opportunity = result.rows[0];

  if (!opportunity) {
    redirect("/dashboard/invest");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">{opportunity.category}</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">{opportunity.title}</h1>
      <p className="mt-2 font-body text-sm text-ink-muted">{opportunity.description}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-md border border-petrol-line bg-petrol-panel p-4">
          <p className="font-mono text-xs text-ink-soft">Min investment</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink-high">{opportunity.minimum_investment}</p>
        </div>
        <div className="rounded-md border border-petrol-line bg-petrol-panel p-4">
          <p className="font-mono text-xs text-ink-soft">Expected return</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink-high">{opportunity.expected_return}</p>
        </div>
        <div className="rounded-md border border-petrol-line bg-petrol-panel p-4">
          <p className="font-mono text-xs text-ink-soft">Duration</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink-high">{opportunity.duration}</p>
        </div>
        <div className="rounded-md border border-petrol-line bg-petrol-panel p-4">
          <p className="font-mono text-xs text-ink-soft">Risk level</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink-high">{opportunity.risk_level}</p>
        </div>
      </div>

      <div className="mt-8">
        <UserInvestmentForm opportunityId={opportunity.id} minimumInvestment={opportunity.minimum_investment} />
      </div>
    </div>
  );
}
