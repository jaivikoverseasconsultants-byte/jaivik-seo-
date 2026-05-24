'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

interface SalaryChartProps {
  data: { country: string; avgSalaryUSD: number }[];
  title?: string;
}

export default function SalaryChart({ data, title = 'Average Graduate Salary by Country (USD/year)' }: SalaryChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="country" tick={{ fontSize: 12 }} width={80} />
          <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}/year`, 'Avg Salary']} />
          <Bar dataKey="avgSalaryUSD" radius={[0, 4, 4, 0]} name="Avg Salary">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
