"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface NavPoint {
  month: string;
  value: number;
}

export default function NavChart() {
  const [data, setData] = useState<NavPoint[]>([]);

  useEffect(() => {
    fetch("/api/nav-history")
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D99A3D" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#D99A3D" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#2E2620" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" stroke="#6E6459" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#6E6459"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{ background: "#17130F", border: "1px solid #2E2620", borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: "#F3EDE2" }}
          formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]}
        />
        <Area type="monotone" dataKey="value" stroke="#D99A3D" strokeWidth={2} fill="url(#navFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
