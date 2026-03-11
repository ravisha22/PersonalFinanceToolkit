import { useMemo } from 'react';
import { leanVsFatTable } from './engine';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  currentInvestments: number;
  annualSavings: number;
  returnRate: number;
}

const EXPENSE_LEVELS = [40000, 60000, 80000, 100000, 120000];

export function LeanVsFat({ currentInvestments, annualSavings, returnRate }: Props) {
  const rows = useMemo(
    () => leanVsFatTable(currentInvestments, annualSavings, returnRate, 0.04, EXPENSE_LEVELS),
    [currentInvestments, annualSavings, returnRate],
  );

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Side-by-side comparison at common expense levels. Using 4% SWR, current settings for investments, savings, and return rate.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              {['Annual Expenses', 'FIRE Number (4%)', 'Years to FIRE'].map(h => (
                <th key={h} className="px-4 py-3 text-right text-[10px] uppercase tracking-wide text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700 first:text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.expenses} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className={`px-4 py-3 font-semibold ${i === 0 ? 'text-green-600 dark:text-green-400' : i === rows.length - 1 ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {formatCurrency(row.expenses)}
                  {i === 0 && <span className="ml-2 text-[10px] text-green-500">(lean)</span>}
                  {i === rows.length - 1 && <span className="ml-2 text-[10px] text-violet-500">(fat)</span>}
                </td>
                <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">{formatCurrency(row.fireNumber)}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-200">{row.yearsToFIRE} yrs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        The difference between lean ({formatCurrency(EXPENSE_LEVELS[0])} pa) and fat ({formatCurrency(EXPENSE_LEVELS[EXPENSE_LEVELS.length - 1])} pa) FIRE is{' '}
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
          {formatCurrency(rows[rows.length - 1].fireNumber - rows[0].fireNumber)}
        </span>{' '}
        more in your portfolio and{' '}
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
          {rows[rows.length - 1].yearsToFIRE - rows[0].yearsToFIRE} extra years
        </span>{' '}
        of work.
      </div>
    </div>
  );
}
