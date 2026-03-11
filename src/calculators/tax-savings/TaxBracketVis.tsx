import { useMemo, useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { SliderControl } from '../../components/ui/SliderControl';
import { Toggle } from '../../components/ui/Toggle';
import { calculateTaxBreakdown } from './engine';
import { formatCurrency, formatPct } from '../../utils/formatters';
import { TAX_BRACKETS_2024_25 } from '../../data/tax-brackets';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const BRACKET_COLORS = ['#94a3b8', '#38bdf8', '#3b82f6', '#6366f1', '#a855f7'];

export function TaxBracketVis() {
  const [income, setIncome] = useState(100000);
  const [includeHELP, setIncludeHELP] = useState(false);

  const breakdown = useMemo(
    () => calculateTaxBreakdown(income, includeHELP),
    [income, includeHELP],
  );

  // Build bracket breakdown chart data
  const bracketData = useMemo(() => {
    const data: { bracket: string; tax: number; rate: string }[] = [];
    let remaining = income;
    TAX_BRACKETS_2024_25.forEach((b, i) => {
      if (remaining <= 0 || income <= b.min) return;
      const inBracket = Math.min(remaining, b.max - b.min + 1);
      const tax = Math.round(inBracket * b.rate);
      if (tax > 0 || b.rate === 0) {
        data.push({
          bracket: i === 0 ? '$0–$18.2k' : i === 1 ? '$18.2–$45k' : i === 2 ? '$45–$135k' : i === 3 ? '$135–$190k' : '$190k+',
          tax,
          rate: `${(b.rate * 100).toFixed(0)}%`,
        });
      }
      remaining -= inBracket;
    });
    return data;
  }, [income]);

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
        <SliderControl
          label="Taxable Income"
          value={income}
          onChange={v => setIncome(Math.round(v))}
          min={0}
          max={500000}
          step={1000}
          prefix="$"
          decimals={0}
        />
        <Toggle label="Include HELP/HECS repayment" checked={includeHELP} onChange={setIncludeHELP} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Income Tax" value={formatCurrency(breakdown.incomeTax)} color="blue" />
        <StatCard label="Medicare Levy (2%)" value={formatCurrency(breakdown.medicareLevy)} color="amber" />
        {includeHELP && <StatCard label="HELP Repayment" value={formatCurrency(breakdown.helpRepayment)} color="cyan" />}
        <StatCard label="Total Tax + Levies" value={formatCurrency(breakdown.total)} color="red" />
        <StatCard label="After-Tax Income" value={formatCurrency(breakdown.afterTaxIncome)} color="green" />
        <StatCard label="Effective Rate" value={formatPct(breakdown.effectiveRate * 100)} color="purple" subtext={`Marginal: ${formatPct(breakdown.marginalRate * 100)}`} />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Tax by Bracket</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={bracketData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <XAxis dataKey="bracket" tick={{ fontSize: 10 }} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v, _name, props) => [formatCurrency(typeof v === 'number' ? v : 0), `${props.payload.rate} bracket`]} contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="tax" name="Tax Payable" radius={[3, 3, 0, 0]}>
              {bracketData.map((_entry, i) => (
                <Cell key={i} fill={BRACKET_COLORS[i % BRACKET_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500">Based on 2024-25 ATO Stage 3 tax rates. LMITO ended 30 June 2022.</p>
    </div>
  );
}
