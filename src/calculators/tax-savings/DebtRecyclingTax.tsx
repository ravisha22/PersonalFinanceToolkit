import { useMemo } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { SliderControl } from '../../components/ui/SliderControl';
import { NumberInput } from '../../components/ui/NumberInput';
import { calculateDRTaxBenefit } from './engine';
import { formatCurrency, formatPct } from '../../utils/formatters';

interface Props {
  investLoanBal: number;
  onInvestLoanBalChange: (v: number) => void;
  rate: number;
  onRateChange: (v: number) => void;
  margTax: number;
  onMargTaxChange: (v: number) => void;
}

export function DebtRecyclingTax({ investLoanBal, onInvestLoanBalChange, rate, onRateChange, margTax, onMargTaxChange }: Props) {
  const rows = useMemo(
    () => calculateDRTaxBenefit(investLoanBal, rate, margTax / 100, [1, 5, 10, 15, 20]),
    [investLoanBal, rate, margTax],
  );

  const first = rows[0];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <NumberInput label="Investment Loan Balance" value={investLoanBal} onChange={onInvestLoanBalChange} min={10000} max={2000000} step={10000} prefix="$" />
        <SliderControl label="Interest Rate" value={rate} onChange={onRateChange} min={2} max={12} step={0.1} suffix="%" />
        <SliderControl label="Marginal Tax Rate" value={margTax} onChange={onMargTaxChange} min={0} max={49} step={1} suffix="%" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Annual Tax Deduction" value={formatCurrency(first?.annualDeduction ?? 0)} color="purple" />
        <StatCard label="Effective After-Tax Rate" value={formatPct(first?.effectiveAfterTaxRate ?? 0)} color="blue" subtext={`vs ${formatPct(rate)} gross`} />
        <StatCard label="10-Year Cumulative" value={formatCurrency(rows[2]?.cumulative ?? 0)} color="green" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              {['Year', 'Annual Deduction', 'Cumulative Deductions', 'Effective Rate'].map(h => (
                <th key={h} className="px-4 py-2.5 text-right text-[10px] uppercase tracking-wide text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700 first:text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.year} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">Year {row.year}</td>
                <td className="px-4 py-2 text-right font-mono text-violet-600 dark:text-violet-400">{formatCurrency(row.annualDeduction)}</td>
                <td className="px-4 py-2 text-right font-mono font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(row.cumulative)}</td>
                <td className="px-4 py-2 text-right font-mono text-blue-600 dark:text-blue-400">{formatPct(row.effectiveAfterTaxRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        IO loan assumed constant. Annual deduction = loan × rate × margTax. Based on 2024-25 ATO rates.
      </p>
    </div>
  );
}
