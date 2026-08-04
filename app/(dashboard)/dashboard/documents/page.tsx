import { FileText, Download } from "lucide-react";
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

export default async function Documents() {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const result = await pool.query(
    "SELECT name, type, date FROM documents WHERE user_id = $1 ORDER BY id ASC",
    [user.userId]
  );
  const documents = result.rows;
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Documents</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
        Statements, fund documents, and tax forms.
      </h1>

      <div className="mt-8 divide-y divide-petrol-line rounded-md border border-petrol-line bg-petrol-panel">
        {documents.map((d: { name: string; type: string; date: string }) => (
          <div key={d.name} className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-brass/10 text-brass">
                <FileText size={18} />
              </div>
              <div>
                <p className="font-display text-sm font-medium text-ink-high">{d.name}</p>
                <p className="font-mono text-xs text-ink-soft">{d.type} · {d.date}</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 rounded-sm border border-petrol-line px-3 py-1.5 font-display text-xs text-ink-high hover:border-brass/60">
              <Download size={13} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
