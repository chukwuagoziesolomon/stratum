import { FileText, Download } from "lucide-react";

const documents = [
  { name: "Q2 2026 Portfolio Statement", type: "Statement", date: "Jul 5, 2026" },
  { name: "Bedrock Income Fund — Offering Memorandum", type: "Fund Document", date: "Updated Jan 2026" },
  { name: "2025 Schedule K-1", type: "Tax Document", date: "Mar 12, 2026" },
  { name: "Q1 2026 Portfolio Statement", type: "Statement", date: "Apr 4, 2026" },
  { name: "Midstream Access Fund — Annual Report", type: "Fund Document", date: "Feb 2026" },
];

export default function Documents() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Documents</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
        Statements, fund documents, and tax forms.
      </h1>

      <div className="mt-8 divide-y divide-petrol-line rounded-md border border-petrol-line bg-petrol-panel">
        {documents.map((d) => (
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
