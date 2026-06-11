'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RankingChartProps {
  data: { year: number; rank: number }[];
}

export default function RankingChart({ data }: RankingChartProps) {
  const reversed = data.map(d => ({ ...d, rank: d.rank }));
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">QS World Ranking History</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={reversed} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis reversed tick={{ fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']}
            label={{ value: 'Rank', angle: -90, position: 'insideLeft', fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [`#${v}`, 'QS Rank']} />
          <Line type="monotone" dataKey="rank" stroke="#f59e0b" strokeWidth={3}
            dot={{ fill: '#f59e0b', r: 4 }} name="QS Rank" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-600 mt-2 text-center">Lower rank number = better position</p>
    </div>
  );
}
