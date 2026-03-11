import { useMemo, useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { SliderControl } from '../../components/ui/SliderControl';
import { NumberInput } from '../../components/ui/NumberInput';
import { PortfolioField } from '../../components/ui/PortfolioField';
import { calculateFIRENumber, yearsToFIRE, projectSavings } from './engine';
import { formatCurrency, formatCompact } from '../../utils/formatters';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  currentAge: number;
  onCurrentAgeChange: (v: number) => void;
  currentInvestments: number;
  onCurrentInvestmentsChange: (v: number) => void;
  investmentsLocked?: boolean;
  annualSavings: number;
  onAnnualSavingsChange: (v: number) => void;
  annualSavingsLocked?: boolean;
  returnRate: number;
  onReturnRateChange: (v: number) => void;
}

export function ClassicFIRE({
  currentAge, onCurrentAgeChange,
  currentInvestments, onCurrentInvestmentsChange, investmentsLocked,
  annualSavings, onAnnualSavingsChange, annualSavingsLocked,
  returnRate, onReturnRateChange,
}: Props) {
  const [annualExpenses, setAnnualExpenses] = useState(80000);
  const [swr, setSwr] = useState(4);

  const fireNumber = useMemo(
    () => calculateFIRENumber(annualExpenses, swr / 100),
    [annualExpenses, swr],
  );

  const years = useMemo(
    () => yearsToFIRE(currentInvestments, annualSavings, fireNumber, returnRate),
    [currentInvestments, annualSavings, fireNumber, returnRate],
  );

  const trajectory = useMemo(
    () => projectSavings(currentInvestments, annualSavings, returnRate, Math.min(years + 5, 60)),
    [currentInvestments, annualSavings, returnRate, years],
  );

  const chartData = trajectory.map((v, i) => ({
    year: `${currentAge + i + 1}`,
    Portfolio: v,
  }));

  const progress = fireNumber > 0 ? Math.min(100, (currentInvestments / fireNumber) * 100) : 0;
  const fireAge = currentAge + years;

  const swrSensitivity = [3, 3.5, 4, 4.5, 5].map(rate => ({
    rate,
    fireNumber: calculateFIRENumber(annualExpenses, rate / 100),
    years: yearsToFIRE(currentInvestments, annualSavings, calculateFIRENumber(annualExpenses, rate / 100), returnRate),
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <NumberInput label="Current Age" value={currentAge} onChange={v => onCurrentAgeChange(Math.round(v))} min={18} max={70} step={1} />
        <NumberInput label="Annual Expenses (Ret.)" value={annualExpenses} onChange={setAnnualExpenses} min={10000} max={500000} step={5000} prefix="$" />
        {investmentsLocked
          ? <PortfolioField label="Current Investments" value={currentInvestments} prefix="$" />
          : <NumberInput label="Current Investments" value={currentInvestments} onChange={onCurrentInvestmentsChange} min={0} max={10000000} step={10000} prefix="$" />
        }
        {annualSavingsLocked
          ? <PortfolioField label="Annual Savings" value={annualSavings} prefix="$" />
          : <NumberInput label="Annual Savings" value={annualSavings} onChange={onAnnualSavingsChange} min={0} max={500000} step={5000} prefix="$" />
        }
      </div>
      <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <SliderControl label="Investment Return (pa)" value={returnRate} onChange={onReturnRateChange} min={2} max={15} step={0.5} suffix="%" />
        <SliderControl label="Safe Withdrawal Rate" value={swr} onChange={setSwr} min={2} max={6} step={0.5} suffix="%" />
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>Progress to FIRE</span>
          <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>{formatCurrency(currentInvestments)}</span>
          <span>FIRE: {formatCompact(fireNumber)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="FIRE Number" value={formatCompact(fireNumber)} color="blue" />
        <StatCard label="Years to FIRE" value={`${years} yrs`} color="green" />
        <StatCard label="FIRE Age" value={`${fireAge}`} color="purple" />
        <StatCard label="Annual Expenses" value={formatCurrency(annualExpenses)} color="cyan" />
      </div>

      {/* Trajectory Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3">Portfolio Trajectory</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={Math.floor(chartData.length / 6)} />
            <YAxis tickFormatter={v => formatCompact(typeof v === 'number' ? v : 0)} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v, n) => [formatCurrency(typeof v === 'number' ? v : 0), n]} contentStyle={{ fontSize: 11 }} />
            <ReferenceLine y={fireNumber} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'FIRE', fontSize: 10, fill: '#22c55e' }} />
            <Line type="monotone" dataKey="Portfolio" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SWR Sensitivity Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              {['SWR', 'FIRE Number', 'Years to FIRE'].map(h => (
                <th key={h} className="px-4 py-2.5 text-right text-[10px] uppercase tracking-wide text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700 first:text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {swrSensitivity.map(row => (
              <tr key={row.rate} className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${row.rate === swr ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{row.rate}% {row.rate === swr && <span className="text-blue-500">(current)</span>}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-700 dark:text-slate-200">{formatCompact(row.fireNumber)}</td>
                <td className="px-4 py-2 text-right font-mono font-semibold text-green-600 dark:text-green-400">{row.years} yrs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
