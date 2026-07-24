const holdings = [
  { name: "Bedrock Income Fund", code: "BRK", value: "$14,020.00", weight: "29%", ytd: "+5.1%", units: "134.02" },
  { name: "Midstream Access Fund", code: "MSA", value: "$18,640.00", weight: "39%", ytd: "+9.8%", units: "165.31" },
  { name: "Upstream Development Fund", code: "UDF", value: "$12,300.00", weight: "25%", ytd: "+14.2%", units: "93.87" },
  { name: "Frontier Exploration Fund", code: "FEF", value: "$3,250.32", weight: "7%", ytd: "-3.6%", units: "28.15" },
];

export default function Holdings() {
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
            {holdings.map((h) => (
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
        NAV is calculated at the close of each business day. Figures shown are for demonstration on this preview account.
      </p>
    </div>
  );
}
