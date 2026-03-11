import { useMemo, useState } from 'react';
import { SliderControl } from '../../components/ui/SliderControl';
import { NumberInput } from '../../components/ui/NumberInput';
import { StatCard } from '../../components/ui/StatCard';
import { calculateNegativeGearing } from './engine';
import { formatCurrency, formatPct } from '../../utils/formatters';

export function NegativeGearing() {
  const [propertyValue, setPropertyValue] = useState(650000);
  const [rentalIncome, setRentalIncome] = useState(450);
  const [mortgageRate, setMortgageRate] = useState(6.0);
  const [lvr, setLvr] = useState(80);
  const [councilRates, setCouncilRates] = useState(2000);
  const [insurance, setInsurance] = useState(1500);
  const [pmFeeRate, setPmFeeRate] = useState(7);
  const [maintenance, setMaintenance] = useState(2000);
  const [depreciation, setDepreciation] = useState(8000);
  const [margTax, setMargTax] = useState(47);

  const result = useMemo(
    () =>
      calculateNegativeGearing({
        propertyValue,
        rentalIncomeWeekly: rentalIncome,
        mortgageRate,
        lvr,
        councilRates,
        insurance,
        pmFeeRate: pmFeeRate / 100,
        maintenance,
        depreciation,
        margTax: margTax / 100,
      }),
    [propertyValue, rentalIncome, mortgageRate, lvr, councilRates, insurance, pmFeeRate, maintenance, depreciation, margTax],
  );

  const grossYield = propertyValue > 0 ? (result.rentalIncomeAnnual / propertyValue) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <NumberInput label="Property Value" value={propertyValue} onChange={setPropertyValue} min={100000} max={5000000} step={10000} prefix="$" />
        <NumberInput label="Rental Income (pw)" value={rentalIncome} onChange={setRentalIncome} min={0} max={5000} step={10} prefix="$" />
        <SliderControl label="Mortgage Rate" value={mortgageRate} onChange={setMortgageRate} min={2} max={12} step={0.1} suffix="%" />
        <SliderControl label="LVR" value={lvr} onChange={setLvr} min={10} max={95} step={5} suffix="%" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <NumberInput label="Council Rates (pa)" value={councilRates} onChange={setCouncilRates} min={0} max={10000} step={100} prefix="$" />
        <NumberInput label="Insurance (pa)" value={insurance} onChange={setInsurance} min={0} max={10000} step={100} prefix="$" />
        <SliderControl label="Prop. Mgmt Fee" value={pmFeeRate} onChange={setPmFeeRate} min={0} max={15} step={0.5} suffix="%" />
        <NumberInput label="Maintenance (pa)" value={maintenance} onChange={setMaintenance} min={0} max={50000} step={500} prefix="$" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <NumberInput label="Depreciation (pa)" value={depreciation} onChange={setDepreciation} min={0} max={50000} step={500} prefix="$" />
        <SliderControl label="Marginal Tax Rate" value={margTax} onChange={setMargTax} min={0} max={49} step={1} suffix="%" />
      </div>

      <div className={`rounded-xl px-4 py-3 border text-sm font-medium
        ${result.isPositivelyGeared
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
        }`}
      >
        {result.isPositivelyGeared ? 'Positively geared' : 'Negatively geared'}
        {' — '}Gross yield: <span className="font-mono">{formatPct(grossYield)}</span> pa
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Rental Income (pa)" value={formatCurrency(result.rentalIncomeAnnual)} color="green" />
        <StatCard label="Total Expenses (pa)" value={formatCurrency(result.totalExpenses)} color="red" subtext={`Interest: ${formatCurrency(result.mortgageInterest)}`} />
        <StatCard label="Tax Refund" value={formatCurrency(result.taxRefund)} color="purple" subtext={`Taxable loss: ${formatCurrency(result.taxableLoss)}`} />
        <StatCard label="Net Cash Position" value={formatCurrency(result.netCashPosition)} color={result.netCashPosition >= 0 ? 'green' : 'amber'} subtext="After refund, ex depreciation" />
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        Depreciation is a non-cash deduction (included in taxable loss but not in net cash position). Based on 2024-25 ATO rates.
      </p>
    </div>
  );
}
