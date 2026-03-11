import { useState, useMemo } from 'react';
import { useUrlParams } from '../../hooks/useUrlParams';
import { SliderControl } from '../../components/ui/SliderControl';
import { NumberInput } from '../../components/ui/NumberInput';
import { PortfolioField } from '../../components/ui/PortfolioField';
import { StatCard } from '../../components/ui/StatCard';
import { BarCompare } from '../../components/ui/BarCompare';
import { Assumptions } from '../../components/shared/Assumptions';
import { Disclaimer } from '../../components/shared/Disclaimer';
import { AboutCalc } from '../../components/shared/AboutCalc';
import { runOffset, runDebtRecycling, monthlyRepayment } from './engine';
import { formatCurrency, formatCompact, formatDiff } from '../../utils/formatters';
import { usePortfolio } from '../../context/PortfolioContext';

const DEFAULTS = {
  loan: 500000,
  rate: 6.0,
  years: 30,
  etfReturn: 8.0,
  divYield: 2.0,
  margTax: 34.5,
  cgtDiscount: 50,
  amountsStr: '50000,100000,150000,200000',
};

const ASSUMPTIONS = [
  'Home loan: P&I repayments, monthly compounding, fixed rate for the full term.',
  'Investment loan (IO mode): Interest-only; balance stays constant at the invested amount throughout.',
  'Investment loan (P&I mode): Principal & interest repayments; loan balance reduces to $0 at end of term.',
  'ETF returns: Smooth annual return, dividends reinvested each month. No franking credits modelled.',
  'Tax deductions: Investment interest deducted at your marginal rate each month.',
  'CGT discount: 50% discount applied to unrealised gains (assets held >12 months).',
  'Offset net wealth = cash retained in offset (no growth on offset funds assumed).',
  'Not modelled: franking credits, ongoing contributions after initial amount, inflation, transaction costs, rate changes.',
];

export function OffsetVsDR() {
  const { portfolio } = usePortfolio();
  const [params, setParams] = useUrlParams({
    loan: portfolio.mortgageBalance > 0 ? portfolio.mortgageBalance : DEFAULTS.loan,
    rate: portfolio.mortgageRate > 0 ? portfolio.mortgageRate : DEFAULTS.rate,
    years: portfolio.mortgageYearsRemaining > 0 ? portfolio.mortgageYearsRemaining : DEFAULTS.years,
    etfReturn: portfolio.etfReturn > 0 ? portfolio.etfReturn : DEFAULTS.etfReturn,
    divYield: DEFAULTS.divYield,
    margTax: portfolio.margTax > 0 ? portfolio.margTax : DEFAULTS.margTax,
    cgtDiscount: DEFAULTS.cgtDiscount,
    amountsStr: DEFAULTS.amountsStr,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [viewYear, setViewYear] = useState<number>(params.years);
  const [drLoanType, setDrLoanType] = useState<'io' | 'pi'>('io');

  // Effective values: portfolio wins over URL params when portfolio is non-zero
  const effectiveLoan = portfolio.mortgageBalance > 0 ? portfolio.mortgageBalance : params.loan;
  const effectiveRate = portfolio.mortgageRate > 0 ? portfolio.mortgageRate : params.rate;
  const effectiveYears = portfolio.mortgageYearsRemaining > 0 ? portfolio.mortgageYearsRemaining : params.years;
  const effectiveEtfReturn = portfolio.etfReturn > 0 ? portfolio.etfReturn : params.etfReturn;
  const effectiveMargTax = portfolio.margTax > 0 ? portfolio.margTax : params.margTax;

  const amounts = useMemo(
    () =>
      params.amountsStr
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n > 0),
    [params.amountsStr],
  );

  const results = useMemo(() => {
    if (effectiveLoan <= 0 || effectiveRate <= 0 || effectiveYears <= 0) return [];
    return amounts
      .filter(amt => amt < effectiveLoan)
      .map(amt => {
        const offset = runOffset(effectiveLoan, effectiveRate, effectiveYears, amt);
        const dr = runDebtRecycling(
          effectiveLoan,
          effectiveRate,
          effectiveYears,
          amt,
          effectiveEtfReturn,
          params.divYield,
          effectiveMargTax,
          params.cgtDiscount,
          drLoanType,
        );
        return {
          amount: amt,
          offset,
          dr,
          drAdvantage: dr.netWealthPostCGT - amt,
        };
      });
  }, [params, drLoanType, effectiveLoan, effectiveRate, effectiveYears, effectiveEtfReturn, effectiveMargTax]);

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
    () => monthlyRepayment(effectiveLoan, effectiveRate, effectiveYears),
    [effectiveLoan, effectiveRate, effectiveYears],
  );

  const afterTaxDRCost = (effectiveRate * (1 - effectiveMargTax / 100)).toFixed(2);

  // Year selector buttons
  const yearBtns = useMemo(() => {
    const y = effectiveYears;
    const btns: number[] = [];
    if (y <= 10) for (let i = 1; i <= y; i++) btns.push(i);
    else if (y <= 20) for (let i = 5; i <= y; i += 5) btns.push(i);
    else for (let i = 5; i <= y; i += 5) btns.push(i);
    if (!btns.includes(y)) btns.push(y);
    return [...new Set(btns)].sort((a, b) => a - b);
  }, [effectiveYears]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Offset vs Debt Recycling
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
            Loan: <span className="text-slate-700 dark:text-slate-300">{formatCurrency(effectiveLoan)}</span>
            {' · '}Term: <span className="text-slate-700 dark:text-slate-300">{effectiveYears} yr P&amp;I</span>
            {' · '}Repayment: <span className="text-slate-700 dark:text-slate-300">{formatCurrency(mPmt)}/mo</span>
            {' · '}Debt Recycling loan: <span className="text-blue-600 dark:text-blue-400">{drLoanType === 'io' ? 'Interest-Only' : 'P&I'}</span>
            {' · '}After-tax DR cost:{' '}
            <span className="text-blue-600 dark:text-blue-400">{afterTaxDRCost}%</span>
          </p>
        </div>
        <button
          onClick={() => setSettingsOpen(o => !o)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-all shrink-0
            ${settingsOpen
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          aria-label="Toggle settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{settingsOpen ? 'Close' : 'Settings'}</span>
        </button>
      </div>

      <AboutCalc concepts={[
        {
          term: 'What is a mortgage offset account?',
          definition: 'A savings or transaction account linked to your home loan. The balance is subtracted from your loan principal before interest is calculated. Example: $100,000 in offset on a $500,000 loan means you only pay interest on $400,000. The cash stays accessible — it\'s not a repayment.',
          link: 'https://en.wikipedia.org/wiki/Offset_mortgage',
          linkLabel: 'Wikipedia: Offset mortgage',
        },
        {
          term: 'What is debt recycling?',
          definition: 'A strategy to convert non-deductible home loan debt into tax-deductible investment debt. You take equity from your home (or use savings) and borrow to invest in shares/ETFs. The interest on money borrowed to invest is tax-deductible — reducing the real cost of borrowing.',
          link: 'https://www.ato.gov.au/individuals-and-families/investments-and-assets/interest-deductions-and-borrowing-expenses',
          linkLabel: 'ATO: Interest deductions on investment loans',
        },
        {
          term: 'Interest-Only (IO) vs Principal & Interest (P&I) investment loan',
          definition: 'IO: you only pay interest each month; the loan balance stays constant. Tax deductions stay high throughout. P&I: you pay interest plus principal; balance reduces to $0 at end of term. Tax deductions decrease over time but you build equity. IO is more common in practice for debt recycling.',
          link: 'https://moneysmart.gov.au/home-loans/interest-only-home-loans',
          linkLabel: 'MoneySmart: Interest-only home loans',
        },
        {
          term: 'What is "net wealth post-CGT"?',
          definition: 'Your portfolio value minus the Capital Gains Tax (CGT) you would owe if you sold today, minus any outstanding investment loan balance. For IO loans, this looks low early on because the full loan balance is still outstanding — not a flaw; DR\'s advantage compounds over time via tax deductions.',
          link: 'https://en.wikipedia.org/wiki/Capital_gains_tax_in_Australia',
          linkLabel: 'Wikipedia: Capital gains tax in Australia',
        },
      ]} />

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            All Parameters
          </p>
          {/* IO vs P&I toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium">
              DR Investment Loan Type
            </label>
            <div className="flex gap-2">
              {(['io', 'pi'] as const).map(t => (
                <button key={t} onClick={() => setDrLoanType(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${drLoanType === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
                  {t === 'io' ? 'Interest-Only (IO)' : 'Principal & Interest (P&I)'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {drLoanType === 'io'
                ? 'IO: loan balance stays fixed; maximum tax deductions throughout. Most common in practice.'
                : 'P&I: loan repays over the term; deductions reduce as balance falls but you build equity.'}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {portfolio.mortgageBalance > 0
              ? <PortfolioField label="Loan Amount" value={effectiveLoan} prefix="$" />
              : <NumberInput label="Loan Amount" value={params.loan} onChange={v => setParams({ loan: v })} min={50000} max={5000000} step={5000} prefix="$" />
            }
            {portfolio.mortgageRate > 0
              ? <PortfolioField label="Interest Rate" value={effectiveRate} suffix="%" decimals={1} />
              : <SliderControl label="Interest Rate" value={params.rate} onChange={v => setParams({ rate: v })} min={2} max={12} step={0.1} suffix="%" />
            }
            {portfolio.mortgageYearsRemaining > 0
              ? <PortfolioField label="Loan Term (years)" value={effectiveYears} suffix=" yrs" />
              : <NumberInput label="Loan Term (years)" value={params.years} onChange={v => setParams({ years: Math.max(1, Math.min(40, Math.round(v))) })} min={1} max={40} step={1} suffix=" yrs" />
            }
            {portfolio.etfReturn > 0
              ? <PortfolioField label="ETF Total Return" value={effectiveEtfReturn} suffix="%" decimals={1} />
              : <SliderControl label="ETF Total Return" value={params.etfReturn} onChange={v => setParams({ etfReturn: v })} min={2} max={16} step={0.5} suffix="%" />
            }
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
            {portfolio.margTax > 0
              ? <PortfolioField label="Marginal Tax Rate" value={effectiveMargTax} suffix="%" decimals={1} />
              : <SliderControl label="Marginal Tax Rate" value={params.margTax} onChange={v => setParams({ margTax: v })} min={0} max={49} step={1} suffix="%" />
            }
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
            Home loan {effectiveRate}% P&amp;I / {effectiveYears} yr. DR invest loan IO same rate. ETF {effectiveEtfReturn}% pa ({params.divYield}% div +{' '}
            {(effectiveEtfReturn - params.divYield).toFixed(1)}% growth). Tax {effectiveMargTax}%. CGT {params.cgtDiscount}% discount.
          </div>
        </div>
      )}

      {/* Quick Controls (when settings closed) */}
      {!settingsOpen && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            {portfolio.mortgageRate > 0
              ? <PortfolioField label="Mortgage Rate" value={effectiveRate} suffix="%" decimals={1} />
              : <SliderControl label="Mortgage Rate" value={params.rate} onChange={v => setParams({ rate: v })} min={2} max={12} step={0.1} suffix="%" />
            }
            {portfolio.etfReturn > 0
              ? <PortfolioField label="ETF Return (pa)" value={effectiveEtfReturn} suffix="%" decimals={1} />
              : <SliderControl label="ETF Return (pa)" value={params.etfReturn} onChange={v => setParams({ etfReturn: v })} min={2} max={16} step={0.5} suffix="%" />
            }
            {portfolio.margTax > 0
              ? <PortfolioField label="Marginal Tax" value={effectiveMargTax} suffix="%" decimals={1} />
              : <SliderControl label="Marginal Tax" value={params.margTax} onChange={v => setParams({ margTax: v })} min={0} max={49} step={1} suffix="%" />
            }
          </div>
          {/* IO/PI quick toggle */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">Debt Recycling Loan:</span>
            {(['io', 'pi'] as const).map(t => (
              <button key={t} onClick={() => setDrLoanType(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${drLoanType === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
                {t === 'io' ? 'Interest-Only' : 'P&I'}
              </button>
            ))}
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {drLoanType === 'io'
                ? 'Loan balance stays fixed; maximum tax deductions.'
                : 'Loan repays over the term; deductions decrease as balance falls.'}
            </span>
          </div>
        </div>
      )}

      {/* Summary Table */}
      {results.length > 0 ? (
        <>
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg px-4 py-3 leading-relaxed">
            Each row compares using the same amount of cash in two ways: parking it in your offset account (reducing interest charged on your loan) vs investing via debt recycling (borrowing to invest, making interest tax-deductible). <strong className="text-slate-700 dark:text-slate-300">Debt Recycling Net Wealth = portfolio value minus the outstanding investment loan minus estimated CGT if sold today.</strong> For IO loans this will appear low early on — Debt Recycling's advantage grows via compounding tax deductions.{' '}
            <a href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/interest-deductions-and-borrowing-expenses" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400">ATO: Interest deductions ↗</a>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                {[
                  'Amount',
                  'Offset Interest Saved',
                  'Offset Payoff',
                  `Debt Recycling Portfolio (${effectiveYears} yr)`,
                  'Debt Recycling Tax Deductions',
                  'Debt Recycling Net Wealth',
                  'Offset Net Wealth',
                  'Debt Recycling Advantage',
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
        </>
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
                [`Net Wealth at ${effectiveYears} yr`, formatCurrency(sel.amount)],
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
                [`Portfolio Value at ${effectiveYears} yr`, formatCurrency(sel.dr.portfolioValue)],
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
        <>
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg px-4 py-3 leading-relaxed">
            The chart tracks <strong className="text-slate-700 dark:text-slate-300">net wealth over time</strong> for the selected amount. Offset net wealth = your cash (flat line, since the offset funds aren't invested). Debt Recycling net wealth = portfolio value minus loan minus CGT. Click a year button to see a snapshot. The crossover point (where Debt Recycling exceeds Offset) depends on your ETF return, tax rate, and loan type.{' '}
            <a href="https://moneysmart.gov.au/shares/how-investments-are-taxed" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400">MoneySmart: How investments are taxed ↗</a>
          </div>
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
                label="Debt Recycling Net Wealth (post-CGT)"
                value={formatCompact(snapYearData._dNW)}
                color="blue"
              />
              <StatCard
                label="Debt Recycling Portfolio Value"
                value={formatCompact(snapYearData._dPortfolio)}
                color="purple"
              />
              <StatCard
                label="Debt Recycling Advantage"
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
              { key: 'Debt Recycling', label: 'Debt Recycling Net Wealth (post-CGT)', color: '#3b82f6' },
            ]}
            xKey="year"
            height={260}
          />
        </div>
        </>
      )}

      <Assumptions items={ASSUMPTIONS} />
      <Disclaimer calculatorName="Offset vs Debt Recycling calculator" />
    </div>
  );
}
