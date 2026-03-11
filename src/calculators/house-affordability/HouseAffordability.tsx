import { useMemo } from 'react';
import { useUrlParams } from '../../hooks/useUrlParams';
import { SliderControl } from '../../components/ui/SliderControl';
import { NumberInput } from '../../components/ui/NumberInput';
import { StatCard } from '../../components/ui/StatCard';
import { Toggle } from '../../components/ui/Toggle';
import { BarCompare } from '../../components/ui/BarCompare';
import { Assumptions } from '../../components/shared/Assumptions';
import { Disclaimer } from '../../components/shared/Disclaimer';
import { calculateAffordability, type AustralianState } from './engine';
import { formatCurrency, formatPercent, formatPct } from '../../utils/formatters';

const DEFAULTS = {
  grossIncome: 250000,
  partnerIncome: 0,
  existingMonthlyDebts: 0,
  deposit: 150000,
  propertyPrice: 850000,
  state: 'VIC' as AustralianState,
  firstHomeBuyer: false,
  isNewHome: false,
  rate: 5.7,
  loanTerm: 30,
};

const STATES: AustralianState[] = ['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

const ASSUMPTIONS = [
  'APRA serviceability buffer: assessed at rate + 3%.',
  'Borrowing capacity assumes 30% of gross income for housing repayments.',
  'LMI estimate is approximate — actual premiums vary significantly by lender.',
  'Monthly holding costs use default estimates for council rates, insurance, and maintenance.',
  'Stamp duty based on 2024-25 state revenue office rates.',
  'Not modelled: strata levies (set to $0 by default), conveyancing, building inspection fees.',
];

export function HouseAffordability() {
  const [params, setParams] = useUrlParams({
    grossIncome: DEFAULTS.grossIncome,
    partnerIncome: DEFAULTS.partnerIncome,
    existingMonthlyDebts: DEFAULTS.existingMonthlyDebts,
    deposit: DEFAULTS.deposit,
    propertyPrice: DEFAULTS.propertyPrice,
    state: DEFAULTS.state as string,
    firstHomeBuyer: DEFAULTS.firstHomeBuyer,
    isNewHome: DEFAULTS.isNewHome,
    rate: DEFAULTS.rate,
    loanTerm: DEFAULTS.loanTerm,
  });

  const result = useMemo(
    () =>
      calculateAffordability({
        ...params,
        state: params.state as AustralianState,
      }),
    [params],
  );

  const affordabilityColor = result.affordabilityRatio <= 0.28
    ? 'green'
    : result.affordabilityRatio <= 0.35
    ? 'amber'
    : 'red';

  const breakdownChartData = [
    {
      name: 'Monthly Costs',
      'P&I': result.monthlyCostBreakdown.principalAndInterest,
      'Rates': result.monthlyCostBreakdown.councilRates + result.monthlyCostBreakdown.water,
      'Insurance': result.monthlyCostBreakdown.insurance,
      'Maintenance': result.monthlyCostBreakdown.maintenance,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          House Purchasing Affordability
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          APRA serviceability assessment, stamp duty, LMI, monthly costs and rate stress tests. Based on 2024-25 rates.
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Buyer Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NumberInput label="Gross Income" value={params.grossIncome} onChange={v => setParams({ grossIncome: v })} min={30000} max={2000000} step={5000} prefix="$" />
          <NumberInput label="Partner Income" value={params.partnerIncome} onChange={v => setParams({ partnerIncome: v })} min={0} max={1000000} step={5000} prefix="$" />
          <NumberInput label="Other Monthly Debts" value={params.existingMonthlyDebts} onChange={v => setParams({ existingMonthlyDebts: v })} min={0} max={10000} step={100} prefix="$" suffix="/mo" />
          <NumberInput label="Deposit / Savings" value={params.deposit} onChange={v => setParams({ deposit: v })} min={0} max={5000000} step={5000} prefix="$" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 pt-2">Property Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NumberInput label="Property Price" value={params.propertyPrice} onChange={v => setParams({ propertyPrice: v })} min={100000} max={5000000} step={10000} prefix="$" />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium">State</label>
            <select
              value={params.state}
              onChange={e => setParams({ state: e.target.value })}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <SliderControl label="Interest Rate" value={params.rate} onChange={v => setParams({ rate: v })} min={2} max={12} step={0.1} suffix="%" />
          <NumberInput label="Loan Term" value={params.loanTerm} onChange={v => setParams({ loanTerm: Math.round(v) })} min={10} max={40} step={1} suffix=" yrs" />
        </div>
        <div className="flex flex-wrap gap-6">
          <Toggle label="First Home Buyer" checked={params.firstHomeBuyer} onChange={v => setParams({ firstHomeBuyer: v })} description="Stamp duty concession may apply" />
          <Toggle label="New Home" checked={params.isNewHome} onChange={v => setParams({ isNewHome: v })} description="Affects FHOG eligibility" />
        </div>
      </div>

      {/* Affordability Banner */}
      <div className={`rounded-xl px-5 py-4 border
        ${result.affordableWithDeposit
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
        }`}
      >
        <p className={`text-sm font-semibold ${result.affordableWithDeposit ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
          {result.affordableWithDeposit
            ? `Loan of ${formatCurrency(result.loanAmount)} is within estimated borrowing capacity (${formatCurrency(result.borrowingCapacity)}).`
            : `Loan of ${formatCurrency(result.loanAmount)} exceeds estimated borrowing capacity of ${formatCurrency(result.borrowingCapacity)}.`
          }
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          LVR: <span className="font-mono">{formatPct(result.lvr)}</span>
          {' · '}Assessed at: <span className="font-mono">{formatPct(params.rate + 3)}%</span> (rate + 3% APRA buffer)
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Borrowing Capacity" value={formatCurrency(result.borrowingCapacity)} color="blue" subtext="At rate + 3% buffer" />
        <StatCard label="Stamp Duty" value={formatCurrency(result.stampDuty.dutyPayable)} color={result.stampDuty.concessionApplied ? 'green' : 'amber'}
          subtext={result.stampDuty.concessionApplied ? `Saved ${formatCurrency(result.stampDuty.concessionSaving)}` : undefined} />
        <StatCard label="LMI Estimate" value={result.lmi > 0 ? formatCurrency(result.lmi) : 'Nil'} color={result.lmi > 0 ? 'red' : 'green'} subtext={result.lvr > 80 ? `LVR ${formatPct(result.lvr)}` : 'LVR ≤ 80%'} />
        <StatCard label="Total Upfront Cost" value={formatCurrency(result.totalUpfrontCost)} color="purple" subtext={`Deposit + duty + LMI`} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Monthly Repayment" value={formatCurrency(result.monthlyRepayment)} color="blue" subtext={`${formatCurrency(result.monthlyRepayment * 12)} pa`} />
        <StatCard label="Total Monthly Cost" value={formatCurrency(result.monthlyCostBreakdown.total)} color="cyan" subtext="P&I + rates + insurance" />
        <StatCard label="Affordability Ratio" value={formatPercent(result.affordabilityRatio)} color={affordabilityColor} subtext={result.affordabilityRatio <= 0.28 ? 'Comfortable' : result.affordabilityRatio <= 0.35 ? 'Moderate' : 'Stretched'} />
        {result.stampDuty.fhogAmount > 0 && (
          <StatCard label="FHOG Grant" value={formatCurrency(result.stampDuty.fhogAmount)} color="green" subtext="First Home Owner Grant" />
        )}
      </div>

      {/* Rate Stress Test */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Rate Stress Test</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                {['Rate', 'Monthly Repayment', 'Change vs Today', 'Annual Cost'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-right text-[10px] uppercase tracking-wide text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700 first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.stressTest.map(row => (
                <tr key={row.rateIncrease} className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${row.rateIncrease === 0 ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300 font-mono">
                    {formatPct(row.totalRate)} {row.rateIncrease > 0 ? <span className="text-amber-500">(+{row.rateIncrease}%)</span> : <span className="text-blue-500">(today)</span>}
                  </td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(row.monthlyRepayment)}</td>
                  <td className={`px-4 py-2 text-right font-mono ${row.monthlyChange > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                    {row.monthlyChange > 0 ? `+${formatCurrency(row.monthlyChange)}` : '—'}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-slate-600 dark:text-slate-300">{formatCurrency(row.annualCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Cost Breakdown Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Monthly Cost Breakdown</h3>
        <BarCompare
          data={breakdownChartData}
          keys={[
            { key: 'P&I', label: 'Principal & Interest', color: '#3b82f6' },
            { key: 'Rates', label: 'Council + Water', color: '#22c55e' },
            { key: 'Insurance', label: 'Insurance', color: '#f59e0b' },
            { key: 'Maintenance', label: 'Maintenance', color: '#a855f7' },
          ]}
          xKey="name"
          height={200}
        />
      </div>

      <Assumptions items={ASSUMPTIONS} />
      <Disclaimer calculatorName="House Affordability calculator" />
    </div>
  );
}
