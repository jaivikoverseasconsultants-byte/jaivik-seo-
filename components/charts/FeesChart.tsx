'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FeesChartProps {
  data: { year: number; tuitionUSD: number }[];
  title?: string;
}

export default function FeesChart({ data, title = 'Annual Tuition Fee Trend (USD)' }: FeesChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Tuition']} />
          <Bar dataKey="tuitionUSD" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="Tuition (USD)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
