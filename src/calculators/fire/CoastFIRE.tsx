import { useState, useMemo } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { NumberInput } from '../../components/ui/NumberInput';
import { SliderControl } from '../../components/ui/SliderControl';
import { calculateFIRENumber, coastFIRENumber } from './engine';
import { formatCurrency, formatCompact } from '../../utils/formatters';

interface Props {
  currentInvestments: number;
  returnRate: number;
}

export function CoastFIRE({ currentInvestments, returnRate }: Props) {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [annualExpenses, setAnnualExpenses] = useState(80000);
  const [swr, setSwr] = useState(4);

  const fireNumber = useMemo(
    () => calculateFIRENumber(annualExpenses, swr / 100),
    [annualExpenses, swr],
  );

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const coastNumber = useMemo(
    () => coastFIRENumber(fireNumber, returnRate, yearsToRetirement),
    [fireNumber, returnRate, yearsToRetirement],
  );

  const reached = currentInvestments >= coastNumber;
  const gap = coastNumber - currentInvestments;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <NumberInput label="Current Age" value={currentAge} onChange={v => setCurrentAge(Math.round(v))} min={18} max={70} step={1} />
        <NumberInput label="Target Retirement Age" value={retirementAge} onChange={v => setRetirementAge(Math.round(v))} min={30} max={80} step={1} />
        <NumberInput label="Annual Expenses (Ret.)" value={annualExpenses} onChange={setAnnualExpenses} min={10000} max={500000} step={5000} prefix="$" />
        <SliderControl label="Safe Withdrawal Rate" value={swr} onChange={setSwr} min={2} max={6} step={0.5} suffix="%" />
      </div>

      <div
        className={`rounded-xl px-5 py-4 border text-sm font-medium
        ${reached
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
        }`}
      >
        {reached
          ? `You have reached Coast FIRE. Your ${formatCurrency(currentInvestments)} portfolio will grow to ${formatCompact(fireNumber)} by age ${retirementAge} without further contributions.`
          : `You need ${formatCurrency(coastNumber)} to coast to retirement. Current gap: ${formatCurrency(gap)}.`
        }
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Coast FIRE Number" value={formatCompact(coastNumber)} color="blue" subtext={`At ${returnRate}% return over ${yearsToRetirement} yrs`} />
        <StatCard label="FIRE Number (target)" value={formatCompact(fireNumber)} color="green" subtext={`${(annualExpenses / 1000).toFixed(0)}k expenses / ${swr}% SWR`} />
        <StatCard label={reached ? 'Surplus' : 'Gap to Coast'} value={formatCurrency(Math.abs(gap))} color={reached ? 'green' : 'amber'} />
      </div>
    </div>
  );
}
