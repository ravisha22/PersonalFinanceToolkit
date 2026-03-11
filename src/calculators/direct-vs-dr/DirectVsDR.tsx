import { useMemo } from 'react';
import { useUrlParams } from '../../hooks/useUrlParams';
import { SliderControl } from '../../components/ui/SliderControl';
import { NumberInput } from '../../components/ui/NumberInput';
import { StatCard } from '../../components/ui/StatCard';
import { Assumptions } from '../../components/shared/Assumptions';
import { Disclaimer } from '../../components/shared/Disclaimer';
import { AboutCalc } from '../../components/shared/AboutCalc';
import {
  runDirectInvest,
  runDebtRecyclingStandalone,
  findBreakevenReturn,
} from './engine';
import { formatCurrency, formatCompact, formatPct } from '../../utils/formatters';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const DEFAULTS = {
  amount: 200000,
  etfReturn: 8.0,
  divYield: 2.0,
  mortgageRate: 6.0,
  margTax: 34.5,
  cgtDiscount: 50,
  years: 20,
};

const ASSUMPTIONS = [
  'Both strategies start with the same lump sum.',
  'Direct investment: unlevered, no borrowing costs.',
  'Debt Recycling: interest-only loan at the mortgage rate; interest is tax-deductible.',
  'ETF dividends are taxed at the marginal rate each month for both strategies.',
  'CGT discount (50%) applied to unrealised gains at the end of the projection period.',
  'No franking credits, transaction costs, or ongoing contributions modelled.',
  'Monthly compounding used throughout.',
];

export function DirectVsDR() {
  const [params, setParams] = useUrlParams(DEFAULTS);

  const margTaxDecimal = params.margTax / 100;
  const cgtDiscountDecimal = params.cgtDiscount / 100;

  const breakeven = useMemo(
    () => findBreakevenReturn(params.mortgageRate, params.margTax),
    [params.mortgageRate, params.margTax],
  );

  const direct = useMemo(
    () =>
      runDirectInvest(
        params.amount,
        params.etfReturn,
        params.divYield,
        margTaxDecimal,
        cgtDiscountDecimal,
        params.years,
      ),
    [params, margTaxDecimal, cgtDiscountDecimal],
  );

  const dr = useMemo(
    () =>
      runDebtRecyclingStandalone(
        params.amount,
        params.etfReturn,
        params.divYield,
        params.mortgageRate,
        margTaxDecimal,
        cgtDiscountDecimal,
        params.years,
      ),
    [params, margTaxDecimal, cgtDiscountDecimal],
  );

  const chartData = useMemo(() => {
    return direct.yearly.map((d, i) => ({
      year: `Yr ${d.year}`,
      'Direct Invest': d.netWealth,
      'Debt Recycling': dr.yearly[i]?.netWealth ?? 0,
    }));
  }, [direct, dr]);

  const drWins = dr.netWealthAfterCGT > direct.netWealthAfterCGT;
  const etfAboveBreakeven = params.etfReturn > breakeven;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Direct Investing vs Debt Recycling
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Compare investing a lump sum directly (unlevered) vs using a tax-deductible investment loan.
        </p>
      </div>

      <AboutCalc concepts={[
        {
          term: 'Why does Debt Recycling show lower net wealth early on?',
          definition: 'DR uses an interest-only loan. Your net wealth = portfolio value MINUS the loan you still owe. With $200k invested: direct = $224k portfolio (no debt). DR = $224k portfolio minus $200k loan = ~$24k. This is correct — DR only outperforms once cumulative tax deductions compound enough. Check the breakeven ETF return callout below to see if your expected return clears the hurdle.',
          link: 'https://www.ato.gov.au/individuals-and-families/investments-and-assets/interest-deductions-and-borrowing-expenses',
          linkLabel: 'ATO: Interest deductions on investment loans',
        },
        {
          term: 'What is the breakeven return?',
          definition: 'The minimum ETF return needed for DR to outperform direct investing. Formula: mortgage rate × (1 − marginal tax rate). E.g., 6% rate × (1 − 34.5%) = 3.93%. If your ETF earns above this, DR\'s after-tax borrowing cost is lower than your return — DR should win over time.',
          link: 'https://en.wikipedia.org/wiki/Debt_recycling',
          linkLabel: 'Wikipedia: Debt recycling',
        },
        {
          term: 'What is direct (unlevered) investing?',
          definition: 'Buying assets with your own cash, no borrowing. No interest costs, no tax deductions on borrowing, no leverage risk. Your net wealth = portfolio value only. Simpler and lower risk than debt recycling.',
          link: 'https://en.wikipedia.org/wiki/Exchange-traded_fund',
          linkLabel: 'Wikipedia: Exchange-traded fund (ETF)',
        },
      ]} />

      {/* Inputs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Parameters</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NumberInput
            label="Lump Sum"
            value={params.amount}
            onChange={v => setParams({ amount: v })}
            min={10000}
            max={2000000}
            step={10000}
            prefix="$"
          />
          <SliderControl
            label="ETF Total Return"
            value={params.etfReturn}
            onChange={v => setParams({ etfReturn: v })}
            min={2}
            max={16}
            step={0.5}
            suffix="%"
          />
          <SliderControl
            label="Dividend Yield"
            value={params.divYield}
            onChange={v => setParams({ divYield: v })}
            min={0}
            max={8}
            step={0.5}
            suffix="%"
          />
          <SliderControl
            label="Mortgage Rate"
            value={params.mortgageRate}
            onChange={v => setParams({ mortgageRate: v })}
            min={2}
            max={12}
            step={0.1}
            suffix="%"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SliderControl
            label="Marginal Tax Rate"
            value={params.margTax}
            onChange={v => setParams({ margTax: v })}
            min={0}
            max={49}
            step={1}
            suffix="%"
          />
          <SliderControl
            label="CGT Discount"
            value={params.cgtDiscount}
            onChange={v => setParams({ cgtDiscount: v })}
            min={0}
            max={50}
            step={5}
            suffix="%"
          />
          <SliderControl
            label="Time Horizon"
            value={params.years}
            onChange={v => setParams({ years: Math.round(v) })}
            min={1}
            max={40}
            step={1}
            suffix=" yrs"
          />
        </div>
      </div>

      {/* Breakeven Callout */}
      <div
        className={`rounded-xl px-5 py-4 border text-sm font-medium
        ${etfAboveBreakeven
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
        }`}
      >
        <span className="font-bold">Breakeven ETF return:</span>{' '}
        <span className="font-mono">{formatPct(breakeven)}</span>
        {' '}
        (= {formatPct(params.mortgageRate)} x (1 - {params.margTax}%) after-tax borrowing cost)
        <br />
        <span className="text-xs mt-1 block">
          {etfAboveBreakeven
            ? `Your ETF return of ${formatPct(params.etfReturn)} exceeds the breakeven — Debt Recycling should outperform over time.`
            : `Your ETF return of ${formatPct(params.etfReturn)} is below the breakeven — Direct Investing may be preferable.`
          }
        </span>
      </div>

      {/* Summary Stat Cards */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg px-4 py-3 leading-relaxed">
        <strong className="text-slate-700 dark:text-slate-300">Direct Final Value</strong> = portfolio value (no debt). <strong className="text-slate-700 dark:text-slate-300">DR Final Value</strong> = portfolio value (same growth). <strong className="text-slate-700 dark:text-slate-300">DR Net Wealth</strong> = portfolio minus the outstanding IO loan balance minus CGT — this is why DR looks worse short-term. <strong className="text-slate-700 dark:text-slate-300">DR Advantage</strong> is only positive once tax deductions have compounded enough to overcome the debt.{' '}
        <a href="https://moneysmart.gov.au/managing-debt/investment-debt" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400">MoneySmart: Investment debt ↗</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label={`Direct — Final Value (${params.years} yr)`}
          value={formatCompact(direct.finalValue)}
          color="green"
          subtext={`Net: ${formatCompact(direct.netWealthAfterCGT)} after CGT`}
        />
        <StatCard
          label={`DR — Final Value (${params.years} yr)`}
          value={formatCompact(dr.finalValue)}
          color="blue"
          subtext={`Net: ${formatCompact(dr.netWealthAfterCGT)} after CGT & loan`}
        />
        <StatCard
          label="DR Advantage (net wealth)"
          value={`${dr.netWealthAfterCGT >= direct.netWealthAfterCGT ? '+' : ''}${formatCompact(dr.netWealthAfterCGT - direct.netWealthAfterCGT)}`}
          color={drWins ? 'green' : 'red'}
          subtext={drWins ? 'DR wins' : 'Direct wins'}
        />
        <StatCard
          label="DR Tax Deductions"
          value={formatCompact(dr.totalTaxDeductions)}
          color="purple"
          subtext={`Net interest cost: ${formatCompact(dr.netInterestCost)}`}
        />
        <StatCard
          label="Direct Dividends Tax Paid"
          value={formatCompact(direct.totalDividendsTaxPaid)}
          color="amber"
        />
        <StatCard
          label="DR CGT if Sold"
          value={formatCompact(dr.cgtIfSold)}
          color="cyan"
          subtext={`Direct CGT: ${formatCompact(direct.cgtIfSold)}`}
        />
      </div>

      {/* Wealth Trajectory Chart */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg px-4 py-3 leading-relaxed">
        This chart tracks <strong className="text-slate-700 dark:text-slate-300">net wealth (after CGT, after repaying the investment loan)</strong> over time. The dashed reference line shows your starting investment amount. The point where the blue DR line crosses the green Direct line is when DR starts winning — the longer your horizon and the higher your ETF return above the breakeven, the sooner this happens.{' '}
        <a href="https://www.investsmart.com.au/investment-calculators/compound-interest-calculator" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400">More: Compound growth calculator ↗</a>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
          Wealth Trajectory (net of CGT)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => formatCompact(typeof v === 'number' ? v : 0)} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v, name) => [formatCurrency(typeof v === 'number' ? v : 0), name]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine
              y={params.amount}
              stroke="#94a3b8"
              strokeDasharray="4 4"
            />
            <Line type="monotone" dataKey="Direct Invest" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Debt Recycling" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* After-tax cost of leverage */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-5 py-3 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <strong>After-tax cost of DR leverage:</strong>{' '}
        <span className="font-mono text-blue-600 dark:text-blue-400">{formatPct(breakeven)}</span>
        {' '}per year ({formatPct(params.mortgageRate)} x (1 - {params.margTax}%)).
        {' '}Total interest paid over {params.years} years:{' '}
        <span className="font-mono">{formatCurrency(dr.totalInterestPaid)}</span>,
        {' '}offset by deductions of{' '}
        <span className="font-mono text-violet-600 dark:text-violet-400">{formatCurrency(dr.totalTaxDeductions)}</span>.
      </div>

      <Assumptions items={ASSUMPTIONS} />
      <Disclaimer calculatorName="Direct Investing vs Debt Recycling calculator" />
    </div>
  );
}
