import { useState, useMemo } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { NumberInput } from '../../components/ui/NumberInput';
import { SliderControl } from '../../components/ui/SliderControl';
import { calculateFIRENumber, yearsToFIRE } from './engine';
import { formatCurrency, formatCompact } from '../../utils/formatters';

interface Props {
  currentInvestments: number;
  returnRate: number;
  currentAge: number;
}

export function BaristaFIRE({ currentInvestments, returnRate, currentAge }: Props) {
  const [partTimeIncome, setPartTimeIncome] = useState(30000);
  const [annualExpenses, setAnnualExpenses] = useState(70000);
  const [swr, setSwr] = useState(4);

  const annualGap = Math.max(0, annualExpenses - partTimeIncome);
  const baristaFIRENumber = useMemo(
    () => calculateFIRENumber(annualGap, swr / 100),
    [annualGap, swr],
  );

  // For barista, you need portfolio to cover the gap (no ongoing savings once you semi-retire)
  const years = useMemo(
    () => yearsToFIRE(currentInvestments, 0, baristaFIRENumber, returnRate),
    [currentInvestments, baristaFIRENumber, returnRate],
  );

  const fullFIRENumber = useMemo(
    () => calculateFIRENumber(annualExpenses, swr / 100),
    [annualExpenses, swr],
  );

  const saving = fullFIRENumber - baristaFIRENumber;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <NumberInput label="Annual Expenses" value={annualExpenses} onChange={setAnnualExpenses} min={10000} max={300000} step={5000} prefix="$" />
        <NumberInput label="Part-Time Income" value={partTimeIncome} onChange={setPartTimeIncome} min={0} max={200000} step={5000} prefix="$" />
        <SliderControl label="Safe Withdrawal Rate" value={swr} onChange={setSwr} min={2} max={6} step={0.5} suffix="%" />
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-3 text-xs text-amber-700 dark:text-amber-400">
        Annual gap the portfolio needs to cover:{' '}
        <span className="font-mono font-bold">{formatCurrency(annualGap)}</span>
        {' '}= expenses ({formatCurrency(annualExpenses)}) - part-time income ({formatCurrency(partTimeIncome)})
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Barista FIRE Number" value={formatCompact(baristaFIRENumber)} color="blue" subtext={`Gap / ${swr}% SWR`} />
        <StatCard label="Years to Barista FIRE" value={`${years} yrs`} color="green" subtext={`Age ${currentAge + years}`} />
        <StatCard label="Full FIRE Number" value={formatCompact(fullFIRENumber)} color="purple" />
        <StatCard label="Saved vs Full FIRE" value={formatCurrency(saving)} color="cyan" subtext="Less needed" />
      </div>
    </div>
  );
}
