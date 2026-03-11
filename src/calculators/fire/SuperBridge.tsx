import { useState, useMemo } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { NumberInput } from '../../components/ui/NumberInput';
import { SliderControl } from '../../components/ui/SliderControl';
import { PortfolioField } from '../../components/ui/PortfolioField';
import { calculateSuperBridge, PRESERVATION_AGE } from './engine';
import { formatCurrency, formatCompact } from '../../utils/formatters';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface Props {
  currentAge: number;
  nonSuperBalance: number;
  superBalance: number;
  onSuperBalanceChange: (v: number) => void;
  superBalanceLocked?: boolean;
  returnRate: number;
}

export function SuperBridge({ currentAge, nonSuperBalance, superBalance, onSuperBalanceChange, superBalanceLocked, returnRate }: Props) {
  const [earlyRetirementAge, setEarlyRetirementAge] = useState(50);
  const [annualExpenses, setAnnualExpenses] = useState(60000);
  const [annualSavingsNonSuper, setAnnualSavingsNonSuper] = useState(20000);
  const [annualSuperContribs, setAnnualSuperContribs] = useState(15000);

  const scenarios = [45, 50, 55].map(retireAge => {
    return {
      retireAge,
      result: calculateSuperBridge({
        currentAge,
        earlyRetirementAge: retireAge,
        preservationAge: PRESERVATION_AGE,
        nonSuperBalance,
        superBalance,
        annualSavingsNonSuper,
        annualSuperContribs,
        annualExpenses,
        nonSuperReturn: returnRate,
        superReturn: returnRate,
      }),
    };
  });

  const primary = useMemo(
    () =>
      calculateSuperBridge({
        currentAge,
        earlyRetirementAge,
        preservationAge: PRESERVATION_AGE,
        nonSuperBalance,
        superBalance,
        annualSavingsNonSuper,
        annualSuperContribs,
        annualExpenses,
        nonSuperReturn: returnRate,
        superReturn: returnRate,
      }),
    [currentAge, earlyRetirementAge, nonSuperBalance, superBalance, annualSavingsNonSuper, annualSuperContribs, annualExpenses, returnRate],
  );

  const chartData = primary.yearly
    .filter(r => r.age % 2 === 0 || r.age === currentAge)
    .map(r => ({
      age: r.age,
      'Non-Super': r.nonSuperBalance,
      Super: r.superBalance,
    }));

  const bridgeYears = Math.max(0, PRESERVATION_AGE - earlyRetirementAge);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        {superBalanceLocked
          ? <PortfolioField label="Current Super Balance" value={superBalance} prefix="$" />
          : <NumberInput label="Current Super Balance" value={superBalance} onChange={onSuperBalanceChange} min={0} max={5000000} step={10000} prefix="$" />
        }
        <NumberInput label="Annual Super Contribs" value={annualSuperContribs} onChange={setAnnualSuperContribs} min={0} max={50000} step={1000} prefix="$" />
        <SliderControl label="Early Retirement Age" value={earlyRetirementAge} onChange={v => setEarlyRetirementAge(Math.round(v))} min={35} max={59} step={1} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <NumberInput label="Annual Savings (non-super)" value={annualSavingsNonSuper} onChange={setAnnualSavingsNonSuper} min={0} max={500000} step={5000} prefix="$" />
        <NumberInput label="Annual Expenses" value={annualExpenses} onChange={setAnnualExpenses} min={10000} max={300000} step={5000} prefix="$" />
      </div>

      {/* Key Answer */}
      <div
        className={`rounded-xl px-5 py-4 border text-sm font-medium
        ${primary.nonSuperSufficientToBridge
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
        }`}
      >
        {primary.nonSuperSufficientToBridge
          ? `Non-super portfolio is sufficient to bridge the ${bridgeYears}-year gap (age ${earlyRetirementAge} to ${PRESERVATION_AGE}).`
          : `Non-super runs out at age ${primary.ageNonSuperRunsOut ?? 'N/A'} — ${bridgeYears - Math.max(0, (primary.ageNonSuperRunsOut ?? 0) - earlyRetirementAge)} years short of preservation age (${PRESERVATION_AGE}).`
        }
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Bridge Years" value={`${bridgeYears} yrs`} color="blue" subtext={`Age ${earlyRetirementAge} → ${PRESERVATION_AGE}`} />
        <StatCard label="Non-Super Draws" value={formatCurrency(annualExpenses * bridgeYears)} color="amber" subtext="Total needed for bridge" />
        <StatCard label="Super at Preservation" value={formatCompact(primary.yearly.find(r => r.age === PRESERVATION_AGE)?.superBalance ?? 0)} color="green" />
        <StatCard label={primary.nonSuperSufficientToBridge ? 'Non-Super Surplus' : 'Shortfall'} value={primary.nonSuperSufficientToBridge
          ? formatCurrency(primary.yearly.find(r => r.age === PRESERVATION_AGE)?.nonSuperBalance ?? 0)
          : formatCurrency(primary.shortfallAtPreservation)}
          color={primary.nonSuperSufficientToBridge ? 'green' : 'red'}
        />
      </div>

      {/* Dual-track chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3">Balance Over Time</h4>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <XAxis dataKey="age" tick={{ fontSize: 10 }} label={{ value: 'Age', position: 'insideBottom', offset: -2, fontSize: 10 }} />
            <YAxis tickFormatter={v => formatCompact(typeof v === 'number' ? v : 0)} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v, n) => [formatCurrency(typeof v === 'number' ? v : 0), n]} contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={earlyRetirementAge} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Retire', fontSize: 9, fill: '#f59e0b' }} />
            <ReferenceLine x={PRESERVATION_AGE} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Preserve', fontSize: 9, fill: '#22c55e' }} />
            <Line type="monotone" dataKey="Non-Super" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Super" stroke="#a855f7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario comparison table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 px-4 pt-3 pb-1">Retirement Age Scenarios</h4>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              {['Retire Age', 'Bridge Years', 'Non-Super at 60', 'Sufficient?'].map(h => (
                <th key={h} className="px-4 py-2 text-right text-[10px] uppercase tracking-wide text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700 first:text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarios.map(s => (
              <tr key={s.retireAge} className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${s.retireAge === earlyRetirementAge ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                <td className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-200">Age {s.retireAge}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-600 dark:text-slate-300">{PRESERVATION_AGE - s.retireAge} yrs</td>
                <td className="px-4 py-2 text-right font-mono text-slate-700 dark:text-slate-200">
                  {formatCompact(s.result.yearly.find(r => r.age === PRESERVATION_AGE)?.nonSuperBalance ?? 0)}
                </td>
                <td className={`px-4 py-2 text-right font-semibold ${s.result.nonSuperSufficientToBridge ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {s.result.nonSuperSufficientToBridge ? 'Yes' : `No (out at ${s.result.ageNonSuperRunsOut})`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
