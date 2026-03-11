import { useState, useMemo } from 'react';
import { SliderControl } from '../../components/ui/SliderControl';
import { NumberInput } from '../../components/ui/NumberInput';
import { PortfolioField } from '../../components/ui/PortfolioField';
import { StatCard } from '../../components/ui/StatCard';
import { Assumptions } from '../../components/shared/Assumptions';
import { Disclaimer } from '../../components/shared/Disclaimer';
import { AboutCalc } from '../../components/shared/AboutCalc';
import { runAllScenarios, SCENARIO_COLORS, type ScenarioParams, type TaxTreatment } from './engine';
import { formatCurrency, formatCompact, formatPct } from '../../utils/formatters';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { usePortfolio } from '../../context/PortfolioContext';

const DEFAULT_SCENARIOS: ScenarioParams[] = [
  { label: 'ETF (Taxable)', initial: 50000, monthlyContribution: 1000, annualReturn: 8, mer: 0.07, taxTreatment: 'marginal', marginalRate: 0.32 },
  { label: 'Super', initial: 50000, monthlyContribution: 1000, annualReturn: 7.5, mer: 0.35, taxTreatment: 'super', marginalRate: 0.32 },
  { label: 'Savings Account', initial: 50000, monthlyContribution: 1000, annualReturn: 4.5, mer: 0, taxTreatment: 'marginal', marginalRate: 0.32 },
];

const TAX_LABELS: Record<TaxTreatment, string> = {
  marginal: 'Marginal Rate',
  super: 'Super (15%)',
  'tax-free': 'Tax-Free',
};

const ASSUMPTIONS = [
  'Monthly compounding applied to all scenarios.',
  'Growth is taxed monthly at the applicable rate (marginal, 15% for super, or 0%).',
  'MER (management expense ratio) is deducted monthly from the balance.',
  'Tax-free assumes no tax on growth (e.g., fully offset account or equivalent).',
  'No withdrawal tax or CGT modelled at the end — all scenarios treated consistently.',
];

export function InvestmentCompare() {
  const { portfolio } = usePortfolio();
  const [scenarios, setScenarios] = useState<ScenarioParams[]>(DEFAULT_SCENARIOS.map(s => ({ ...s })));
  const [years, setYears] = useState(20);
  const [margTaxOverride, setMargTaxOverride] = useState(32);

  const sharedMarginalRate = portfolio.margTax > 0 ? portfolio.margTax : margTaxOverride;

  // Portfolio-locked values for scenarios 0–2 (ETF, Super, Savings)
  const portfolioInitials = [portfolio.etfValue, portfolio.superBalance, portfolio.savingsBalance];
  const portfolioMonthly = [portfolio.monthlyEtfContrib, portfolio.monthlySuperContrib, portfolio.monthlySavingsContrib];

  const updateScenario = (i: number, updates: Partial<ScenarioParams>) => {
    setScenarios(prev => prev.map((s, idx) => idx === i ? { ...s, ...updates } : s));
  };

  const syncedScenarios = useMemo(
    () => scenarios.map((s, i) => ({
      ...s,
      initial: i < 3 && portfolioInitials[i] > 0 ? portfolioInitials[i] : s.initial,
      monthlyContribution: i < 3 && portfolioMonthly[i] > 0 ? portfolioMonthly[i] : s.monthlyContribution,
      marginalRate: sharedMarginalRate / 100,
    })),
    [scenarios, sharedMarginalRate, portfolioInitials, portfolioMonthly],
  );

  const results = useMemo(
    () => runAllScenarios(syncedScenarios, years),
    [syncedScenarios, years],
  );

  // Build chart data — one entry per year
  const chartData = useMemo(() => {
    const maxLen = Math.max(...results.map(r => r.yearly.length));
    return Array.from({ length: maxLen }, (_, i) => {
      const row: Record<string, string | number> = { year: `Yr ${i + 1}` };
      results.forEach(r => {
        row[r.label] = r.yearly[i]?.balance ?? 0;
      });
      return row;
    });
  }, [results]);

  const addScenario = () => {
    if (scenarios.length >= 4) return;
    setScenarios(prev => [
      ...prev,
      { label: `Scenario ${prev.length + 1}`, initial: 50000, monthlyContribution: 500, annualReturn: 7, mer: 0.2, taxTreatment: 'marginal', marginalRate: 0.32 },
    ]);
  };

  const removeScenario = (i: number) => {
    setScenarios(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Investment Comparison
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Compare up to 4 investment scenarios with different tax treatments, fees, and return rates.
        </p>
      </div>

      <AboutCalc concepts={[
        {
          term: 'What is MER (Management Expense Ratio)?',
          definition: 'The annual fee charged by an ETF or managed fund, expressed as a % of your balance. A 0.07% MER on $100,000 = $70/year. Even seemingly small fee differences compound dramatically over decades — a 1% higher MER on $100k over 30 years at 8% growth costs roughly $90,000 in lost returns.',
          link: 'https://en.wikipedia.org/wiki/Expense_ratio',
          linkLabel: 'Wikipedia: Expense ratio',
        },
        {
          term: 'What does "super (15%)" tax treatment mean?',
          definition: 'Investment earnings inside a super fund are taxed at a concessional 15% rate, compared to your marginal tax rate outside super. In retirement (pension phase), earnings are 0% tax. This makes super a powerful tax-efficient vehicle for long-term investing, especially for higher earners.',
          link: 'https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/tax-on-contributions',
          linkLabel: 'ATO: Tax on super',
        },
      ]} />

      {/* Shared settings */}
      <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <SliderControl label="Time Horizon" value={years} onChange={v => setYears(Math.round(v))} min={1} max={40} step={1} suffix=" yrs" />
        {portfolio.margTax > 0
          ? <PortfolioField label="Marginal Tax Rate (shared)" value={sharedMarginalRate} suffix="%" />
          : <SliderControl label="Marginal Tax Rate (shared)" value={margTaxOverride} onChange={setMargTaxOverride} min={0} max={49} step={1} suffix="%" />
        }
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scenarios.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border-2 rounded-xl p-4 space-y-3" style={{ borderColor: SCENARIO_COLORS[i] }}>
            <div className="flex items-center justify-between">
              <input
                value={s.label}
                onChange={e => updateScenario(i, { label: e.target.value })}
                className="text-sm font-bold bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 w-full"
                placeholder="Scenario name"
              />
              {scenarios.length > 1 && i >= DEFAULT_SCENARIOS.length && (
                <button onClick={() => removeScenario(i)} className="text-xs text-red-400 hover:text-red-600 shrink-0 ml-2">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {i < 3 && portfolioInitials[i] > 0
                ? <PortfolioField label="Initial" value={portfolioInitials[i]} prefix="$" />
                : <NumberInput label="Initial" value={s.initial} onChange={v => updateScenario(i, { initial: v })} min={0} max={5000000} step={1000} prefix="$" />
              }
              {i < 3 && portfolioMonthly[i] > 0
                ? <PortfolioField label="Monthly Contribution" value={portfolioMonthly[i]} prefix="$" />
                : <NumberInput label="Monthly Contribution" value={s.monthlyContribution} onChange={v => updateScenario(i, { monthlyContribution: v })} min={0} max={10000} step={100} prefix="$" />
              }
              <SliderControl label="Annual Return" value={s.annualReturn} onChange={v => updateScenario(i, { annualReturn: v })} min={0} max={20} step={0.5} suffix="%" />
              <SliderControl label="MER" value={s.mer} onChange={v => updateScenario(i, { mer: v })} min={0} max={3} step={0.05} suffix="%" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium">Tax Treatment</label>
              <select
                value={s.taxTreatment}
                onChange={e => updateScenario(i, { taxTreatment: e.target.value as TaxTreatment })}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {(Object.entries(TAX_LABELS) as [TaxTreatment, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {scenarios.length < 4 && (
          <button
            onClick={addScenario}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
          >
            + Add Scenario
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg px-4 py-3 leading-relaxed">
        Each line shows the <strong className="text-slate-700 dark:text-slate-300">total portfolio balance</strong> (initial + contributions + compounded growth, minus tax and fees) over your chosen time horizon. Lines that diverge steeply benefit most from either lower fees or preferential tax treatment. <strong className="text-slate-700 dark:text-slate-300">Final balance</strong> is before any withdrawal tax or CGT.{' '}
        <a href="https://moneysmart.gov.au/saving-and-budgeting/compound-interest" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400">MoneySmart: How compound interest works ↗</a>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Portfolio Balance Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={Math.max(0, Math.floor(years / 6) - 1)} />
            <YAxis tickFormatter={v => formatCompact(typeof v === 'number' ? v : 0)} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v, n) => [formatCurrency(typeof v === 'number' ? v : 0), n]} contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {results.map(r => (
              <Line key={r.label} type="monotone" dataKey={r.label} stroke={r.color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {results.map(r => (
          <StatCard
            key={r.label}
            label={r.label}
            value={formatCompact(r.finalBalance)}
            color={(['blue', 'green', 'amber', 'purple'] as const)[results.indexOf(r)]}
            subtext={`Fees: ${formatCurrency(r.totalFeesPaid)}`}
          />
        ))}
      </div>

      {/* Final values table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              {['Scenario', 'Tax Treatment', `Final Balance (${years} yr)`, 'Total Fees', 'Total Contributions', 'Net Return'].map(h => (
                <th key={h} className="px-4 py-2.5 text-right text-[10px] uppercase tracking-wide text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700 first:text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.label} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-4 py-2 font-semibold" style={{ color: SCENARIO_COLORS[i] }}>{r.label}</td>
                <td className="px-4 py-2 text-right text-slate-500 dark:text-slate-400">{TAX_LABELS[syncedScenarios[i].taxTreatment]}</td>
                <td className="px-4 py-2 text-right font-mono font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(r.finalBalance)}</td>
                <td className="px-4 py-2 text-right font-mono text-red-500">{formatCurrency(r.totalFeesPaid)}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-500 dark:text-slate-400">{formatCurrency(r.totalContributions)}</td>
                <td className="px-4 py-2 text-right font-mono text-green-600 dark:text-green-400">
                  {formatPct(((r.finalBalance - r.totalContributions) / r.totalContributions) * 100)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Assumptions items={ASSUMPTIONS} />
      <Disclaimer calculatorName="Investment Comparison calculator" />
    </div>
  );
}
