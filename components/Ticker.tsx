const items = [
  { label: "WTI Crude", value: "$78.42", delta: "+0.6%" },
  { label: "Brent Crude", value: "$82.15", delta: "+0.4%" },
  { label: "Henry Hub Gas", value: "$2.91", delta: "-1.2%" },
  { label: "Stratum Bedrock Fund", value: "NAV $104.20", delta: "+0.1%" },
  { label: "Stratum Midstream Fund", value: "NAV $112.88", delta: "+0.3%" },
  { label: "Stratum Upstream Fund", value: "NAV $131.05", delta: "+0.9%" },
];

export default function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-petrol-line bg-petrol-panel py-2.5">
      <div className="flex w-max animate-ticker gap-10">
        {doubled.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2 font-mono text-xs text-ink-muted">
            <span className="text-ink-high">{item.label}</span>
            <span>{item.value}</span>
            <span className={item.delta.startsWith("-") ? "text-red-400" : "text-emerald-400"}>
              {item.delta}
            </span>
          </div>
        ))}
      </div>
      <p className="sr-only">Illustrative pricing data, delayed and for demonstration purposes only.</p>
    </div>
  );
}
