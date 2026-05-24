'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#1e3a8a', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

interface JobRolesChartProps {
  data: { role: string; percentage: number }[];
}

export default function JobRolesChart({ data }: JobRolesChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Career Outcomes Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" outerRadius={90} dataKey="percentage"
            nameKey="role" label={({ role, percentage }) => `${percentage}%`} labelLine={false}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => [`${v}%`, 'Graduates']} />
          <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
