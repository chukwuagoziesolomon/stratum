import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

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

export default async function BecomeAdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const adminCount = await pool.query("SELECT count(*) FROM users WHERE is_admin = true");
  const hasAdmins = Number(adminCount.rows[0].count) > 0;
  const isAlreadyAdmin = user.isAdmin;

  if (isAlreadyAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 md:px-10 md:py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">Admin access</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">You are already an admin</h1>
        <p className="mt-4 font-body text-sm text-ink-muted">Go to the <a href="/admin" className="text-brass underline">admin dashboard</a>.</p>
      </div>
    );
  }

  if (hasAdmins) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 md:px-10 md:py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">Admin access</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">Admin already exists</h1>
        <p className="mt-4 font-body text-sm text-ink-muted">Another admin already exists. Contact them for admin access.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Admin access</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">Become admin</h1>
      <p className="mt-4 font-body text-sm text-ink-muted">No admin exists yet. You can become the first admin.</p>
      <form action="/api/admin/become" method="POST" className="mt-6">
        <button
          type="submit"
          className="rounded-sm bg-brass px-6 py-3 font-display text-sm font-medium text-petrol transition-colors hover:bg-brass-light"
        >
          Become admin
        </button>
      </form>
    </div>
  );
}
