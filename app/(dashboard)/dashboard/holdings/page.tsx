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

  const activeInvestments = (await pool.query(
    "SELECT program_code, amount, current_percentage, target_percentage, return_percentage FROM investments WHERE user_id = $1 AND status = 'active' ORDER BY created_at DESC",
    [user.userId]
  )).rows as { program_code: string; amount: string; current_percentage: number; target_percentage: number; return_percentage: number }[];

  const programCodes = [...new Set(activeInvestments.map((i) => i.program_code).filter((c) => !String(c).startsWith("OPP-")))];
  const oppIds = activeInvestments
    .filter((i) => String(i.program_code).startsWith("OPP-"))
    .map((i) => Number(String(i.program_code).replace("OPP-", "")))
    .filter((id) => !Number.isNaN(id));

  const [programsMap, opportunitiesMap] = await Promise.all([
    programCodes.length
      ? pool.query("SELECT code, name FROM programs WHERE code = ANY($1)", [programCodes]).then((r) => {
          const map: Record<string, string> = {};
          r.rows.forEach((row: { code: string; name: string }) => {
            map[row.code] = row.name;
          });
          return map;
        })
      : Promise.resolve({} as Record<string, string>),
    oppIds.length
      ? pool.query("SELECT id, title FROM opportunities WHERE id = ANY($1)", [oppIds]).then((r) => {
          const map: Record<number, string> = {};
          r.rows.forEach((row: { id: number; title: string }) => {
            map[row.id] = row.title;
          });
          return map;
        })
      : Promise.resolve({} as Record<number, string>),
  ]);

  const holdings = activeInvestments.map((inv) => {
    const code = String(inv.program_code);
    let name = code;
    if (code.startsWith("OPP-")) {
      const oppId = Number(code.replace("OPP-", ""));
      name = opportunitiesMap[oppId] || code;
    } else {
      name = programsMap[code] || code;
    }

    const numericAmount = Number(String(inv.amount).replace(/[^0-9.-]/g, "")) || 0;
    const currentPercentage = Number(inv.current_percentage) || 0;
    const targetPercentage = Number(inv.target_percentage) || 100;
    const returnPct = Number(inv.return_percentage) || 10;

    return {
      name,
      code,
      units: `${currentPercentage}%`,
      value: inv.amount,
      weight: `${targetPercentage}%`,
      ytd: `+${returnPct}%`,
    };
  });

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
            {holdings.map((h: { name: string; code: string; units: string; value: string; weight: string; ytd: string }) => (
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
