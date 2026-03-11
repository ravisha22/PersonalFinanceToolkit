import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatCompact } from '../../utils/formatters';

interface BarCompareProps {
  data: Record<string, string | number>[];
  keys: { key: string; label: string; color: string }[];
  xKey: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export function BarCompare({ data, keys, xKey, height = 280 }: BarCompareProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11 }}
          className="text-slate-400"
        />
        <YAxis
          tickFormatter={v => formatCompact(v as number)}
          tick={{ fontSize: 11 }}
          className="text-slate-400"
        />
        <Tooltip
          formatter={(value, name) => [formatCompact(typeof value === 'number' ? value : 0), name]}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map(k => (
          <Bar key={k.key} dataKey={k.key} name={k.label} fill={k.color} radius={[2, 2, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
