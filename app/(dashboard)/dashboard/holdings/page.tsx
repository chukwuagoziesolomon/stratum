import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "stratum-energy-secret-key-2026";

function getCurrentUser() {
  const token = cookies().get("stratum_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };
  } catch {
    return null;
  }
}

export default async function Holdings() {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const result = await pool.query(
    "SELECT name, code, value, weight, ytd, units FROM holdings WHERE user_id = $1 ORDER BY id ASC",
    [user.userId]
  );
  const holdings = result.rows;
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Holdings</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
        Everything you're currently invested in.
      </h1>

      <div className="mt-8 overflow-x-auto rounded-md border border-petrol-line bg-petrol-panel">
        <table className="w-full text-left">
          <thead>
            <tr className="font-mono text-xs uppercase tracking-wider text-ink-soft">
              <th className="px-6 py-4 font-medium">Fund</th>
              <th className="px-6 py-4 font-medium">Units held</th>
              <th className="px-6 py-4 font-medium">Value</th>
              <th className="px-6 py-4 font-medium">Portfolio weight</th>
              <th className="px-6 py-4 font-medium">YTD return</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm">
            {holdings.map((h: { name: string; code: string; value: string; weight: string; ytd: string; units: string }) => (
              <tr key={h.code} className="border-t border-petrol-line/60">
                <td className="px-6 py-4">
                  <p className="text-ink-high">{h.name}</p>
                  <p className="font-mono text-xs text-ink-soft">{h.code}</p>
                </td>
                <td className="px-6 py-4 font-mono text-ink-muted">{h.units}</td>
                <td className="px-6 py-4 font-mono text-ink-high">{h.value}</td>
                <td className="px-6 py-4 font-mono text-ink-muted">{h.weight}</td>
                <td className={`px-6 py-4 font-mono ${h.ytd.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>{h.ytd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 font-body text-xs text-ink-soft">
        NAV is calculated at the close of each business day. Figures shown are based on your account holdings.
      </p>
    </div>
  );
}
