import { useState, useMemo } from 'react';
import { useUrlParams } from '../../hooks/useUrlParams';
import { SliderControl } from '../../components/ui/SliderControl';
import { NumberInput } from '../../components/ui/NumberInput';
import { StatCard } from '../../components/ui/StatCard';
import { BarCompare } from '../../components/ui/BarCompare';
import { Assumptions } from '../../components/shared/Assumptions';
import { Disclaimer } from '../../components/shared/Disclaimer';
import { runOffset, runDebtRecycling, monthlyRepayment } from './engine';
import { formatCurrency, formatCompact, formatDiff } from '../../utils/formatters';

const DEFAULTS = {
  loan: 925000,
  rate: 5.7,
  years: 15,
  etfReturn: 8.5,
  divYield: 2.5,
  margTax: 47,
  cgtDiscount: 50,
  amountsStr: '50000,100000,150000,200000',
};

const ASSUMPTIONS = [
  'Home loan: P&I repayments, monthly compounding, fixed rate for the full term.',
  'Investment loan (DR): Interest-only at the same rate; balance stays constant at the invested amount.',
  'ETF returns: Smooth annual return, dividends reinvested each month. No franking credits modelled.',
  'Tax deductions: Investment interest deducted at your marginal rate each month.',
  'CGT discount: 50% discount applied to unrealised gains (assets held >12 months).',
  'Offset net wealth = cash retained in offset (no growth on offset funds assumed).',
  'Not modelled: franking credits, ongoing contributions after initial amount, inflation, transaction costs, rate changes.',
];

export function OffsetVsDR() {
  const [params, setParams] = useUrlParams(DEFAULTS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [viewYear, setViewYear] = useState<number>(params.years);

  const amounts = useMemo(
    () =>
      params.amountsStr
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n > 0),
    [params.amountsStr],
  );

  const results = useMemo(() => {
    if (params.loan <= 0 || params.rate <= 0 || params.years <= 0) return [];
    return amounts
      .filter(amt => amt < params.loan)
      .map(amt => {
        const offset = runOffset(params.loan, params.rate, params.years, amt);
        const dr = runDebtRecycling(
          params.loan,
          params.rate,
          params.years,
          amt,
          params.etfReturn,
          params.divYield,
          params.margTax,
          params.cgtDiscount,
        );
        return {
          amount: amt,
          offset,
          dr,
          drAdvantage: dr.netWealthPostCGT - amt,
        };
      });
  }, [params]);

  const sel = results.find(r => r.amount === selectedAmount) ?? results[0] ?? null;

  const yearlyComp = useMemo(() => {
    if (!sel) return [];
    return sel.offset.yearly
      .map((oy, i) => {
        const dy = sel.dr.yearly[i];
        if (!dy) return null;
        return {
          year: `Yr ${oy.year}`,
          Offset: oy.netWealth,
          'Debt Recycling': dy.netWealthAfterCGT,
          _oNW: oy.netWealth,
          _dNW: dy.netWealthAfterCGT,
          _dPortfolio: dy.portfolioValue,
          _dTax: dy.taxDeductions,
          _yr: oy.year,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [sel]);

  const snapYearData = useMemo(() => {
    if (!yearlyComp.length) return null;
    return (
      yearlyComp.find(r => r._yr === viewYear) ??
      yearlyComp[yearlyComp.length - 1]
    );
  }, [yearlyComp, viewYear]);

  const mPmt = useMemo(
    () => monthlyRepayment(params.loan, params.rate, params.years),
    [params.loan, params.rate, params.years],
  );

  const afterTaxDRCost = (params.rate * (1 - params.margTax / 100)).toFixed(2);

  // Year selector buttons
  const yearBtns = useMemo(() => {
    const y = params.years;
    const btns: number[] = [];
    if (y <= 10) for (let i = 1; i <= y; i++) btns.push(i);
    else if (y <= 20) for (let i = 5; i <= y; i += 5) btns.push(i);
    else for (let i = 5; i <= y; i += 5) btns.push(i);
    if (!btns.includes(y)) btns.push(y);
    return [...new Set(btns)].sort((a, b) => a - b);
  }, [params.years]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Offset vs Debt Recycling
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
            Loan: <span className="text-slate-700 dark:text-slate-300">{formatCurrency(params.loan)}</span>
            {' · '}Term: <span className="text-slate-700 dark:text-slate-300">{params.years} yr P&amp;I</span>
            {' · '}Repayment: <span className="text-slate-700 dark:text-slate-300">{formatCurrency(mPmt)}/mo</span>
            {' · '}After-tax DR cost:{' '}
            <span className="text-blue-600 dark:text-blue-400">{afterTaxDRCost}%</span>
          </p>
        </div>
        <button
          onClick={() => setSettingsOpen(o => !o)}
          className={`px-4 py-2 text-xs font-semibold rounded-md border transition-all shrink-0
            ${settingsOpen
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-500'
            }`}
        >
          {settingsOpen ? 'Close Settings' : 'Settings'}
        </button>
      </div>

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            All Parameters
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <NumberInput
              label="Loan Amount"
              value={params.loan}
              onChange={v => setParams({ loan: v })}
              min={50000}
              max={5000000}
              step={5000}
              prefix="$"
            />
            <SliderControl
              label="Interest Rate"
              value={params.rate}
              onChange={v => setParams({ rate: v })}
              min={2}
              max={12}
              step={0.1}
              suffix="%"
            />
            <NumberInput
              label="Loan Term (years)"
              value={params.years}
              onChange={v => setParams({ years: Math.max(1, Math.min(40, Math.round(v))) })}
              min={1}
              max={40}
              step={1}
              suffix=" yrs"
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
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium">
                Comparison Amounts
              </label>
              <input
                type="text"
                value={params.amountsStr}
                onChange={e => setParams({ amountsStr: e.target.value })}
                placeholder="50000,100000,150000..."
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Comma-separated AUD values</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700">
            <strong className="text-slate-700 dark:text-slate-300">Model: </strong>
            Home loan {params.rate}% P&amp;I / {params.years} yr. DR invest loan IO same rate. ETF {params.etfReturn}% pa ({params.divYield}% div +{' '}
            {(params.etfReturn - params.divYield).toFixed(1)}% growth). Tax {params.margTax}%. CGT {params.cgtDiscount}% discount.
          </div>
        </div>
      )}

      {/* Quick Controls (when settings closed) */}
      {!settingsOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <SliderControl
            label="Mortgage Rate"
            value={params.rate}
            onChange={v => setParams({ rate: v })}
            min={2}
            max={12}
            step={0.1}
            suffix="%"
          />
          <SliderControl
            label="ETF Return (pa)"
            value={params.etfReturn}
            onChange={v => setParams({ etfReturn: v })}
            min={2}
            max={16}
            step={0.5}
            suffix="%"
          />
          <SliderControl
            label="Marginal Tax"
            value={params.margTax}
            onChange={v => setParams({ margTax: v })}
            min={0}
            max={49}
            step={1}
            suffix="%"
          />
        </div>
      )}

      {/* Summary Table */}
      {results.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                {[
                  'Amount',
                  'Offset Interest Saved',
                  'Offset Payoff',
                  `DR Portfolio (${params.years} yr)`,
                  'DR Tax Deductions',
                  'DR Net Wealth',
                  'Offset Net Wealth',
                  'DR Advantage',
                ].map(h => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-right text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map(r => {
                const isSel = r.amount === (sel?.amount);
                const adv = r.drAdvantage;
                return (
                  <tr
                    key={r.amount}
                    onClick={() => setSelectedAmount(r.amount)}
                    className={`cursor-pointer border-l-4 transition-colors
                      ${isSel
                        ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                  >
                    <td className="px-3 py-2.5 text-right font-semibold font-mono text-slate-800 dark:text-slate-100">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-green-600 dark:text-green-400">
                      {formatCurrency(r.offset.interestSaved)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                      {r.offset.yearsToPayoff} yrs
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(r.dr.portfolioValue)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-violet-600 dark:text-violet-400">
                      {formatCurrency(r.dr.taxDeductions)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(r.dr.netWealthPostCGT)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className={`px-3 py-2.5 text-right font-mono font-bold ${adv >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatDiff(adv)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-400">
          Enter your loan details and comparison amounts above to see results.
        </div>
      )}

      {/* Detail Cards */}
      {sel && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Offset */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Offset — {formatCurrency(sel.amount)}
            </h3>
            <dl className="space-y-2">
              {([
                ['Total Interest Paid', formatCurrency(sel.offset.totalInterest)],
                ['Interest Saved vs No Offset', formatCurrency(sel.offset.interestSaved)],
                ['Loan Payoff Time', `${sel.offset.yearsToPayoff} years`],
                ['Cash in Offset (retained)', formatCurrency(sel.amount)],
                [`Net Wealth at ${params.years} yr`, formatCurrency(sel.amount)],
                ['Tax Benefit', '$0 (no deduction)'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 last:border-0">
                  <dt className="text-xs text-slate-400 dark:text-slate-500">{k}</dt>
                  <dd className="text-xs font-semibold font-mono text-slate-700 dark:text-slate-200">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Debt Recycling */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              Debt Recycling — {formatCurrency(sel.amount)}
            </h3>
            <dl className="space-y-2">
              {([
                ['Total Interest (home + invest)', formatCurrency(sel.dr.totalInterest)],
                ['Tax Deductions (invest interest)', formatCurrency(sel.dr.taxDeductions)],
                ['Net Interest Cost', formatCurrency(sel.dr.netInterestCost)],
                [`Portfolio Value at ${params.years} yr`, formatCurrency(sel.dr.portfolioValue)],
                [`CGT if Sold (${params.cgtDiscount}% discount)`, formatCurrency(sel.dr.cgtIfSold)],
                ['Net Wealth Post-CGT', formatCurrency(sel.dr.netWealthPostCGT)],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 last:border-0">
                  <dt className="text-xs text-slate-400 dark:text-slate-500">{k}</dt>
                  <dd className="text-xs font-semibold font-mono text-slate-700 dark:text-slate-200">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* Year-by-Year Chart */}
      {sel && yearlyComp.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Year-by-Year — {formatCurrency(sel.amount)}
            </h3>
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-slate-400 mr-1">Snapshot:</span>
              {yearBtns.map(y => (
                <button
                  key={y}
                  onClick={() => setViewYear(y)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded border transition-colors
                    ${viewYear === y
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Stat Cards for selected year */}
          {snapYearData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Offset Net Wealth"
                value={formatCompact(snapYearData._oNW)}
                color="green"
              />
              <StatCard
                label="DR Net Wealth (post-CGT)"
                value={formatCompact(snapYearData._dNW)}
                color="blue"
              />
              <StatCard
                label="DR Portfolio Value"
                value={formatCompact(snapYearData._dPortfolio)}
                color="purple"
              />
              <StatCard
                label="DR Advantage"
                value={formatDiff(snapYearData._dNW - snapYearData._oNW)}
                color={snapYearData._dNW >= snapYearData._oNW ? 'green' : 'red'}
              />
            </div>
          )}

          {/* Bar Chart */}
          <BarCompare
            data={yearlyComp}
            keys={[
              { key: 'Offset', label: 'Offset Net Wealth', color: '#22c55e' },
              { key: 'Debt Recycling', label: 'DR Net Wealth (post-CGT)', color: '#3b82f6' },
            ]}
            xKey="year"
            height={260}
          />
        </div>
      )}

      <Assumptions items={ASSUMPTIONS} />
      <Disclaimer calculatorName="Offset vs Debt Recycling calculator" />
    </div>
  );
}
