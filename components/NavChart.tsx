"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { month: "Aug", value: 41200 },
  { month: "Sep", value: 42050 },
  { month: "Oct", value: 41800 },
  { month: "Nov", value: 43500 },
  { month: "Dec", value: 44100 },
  { month: "Jan", value: 43700 },
  { month: "Feb", value: 45200 },
  { month: "Mar", value: 46300 },
  { month: "Apr", value: 45900 },
  { month: "May", value: 47100 },
  { month: "Jun", value: 47800 },
  { month: "Jul", value: 48210 },
];

export default function NavChart() {
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
