import { Link } from 'react-router-dom';

const CALCULATORS = [
  {
    path: '/offset-vs-dr',
    title: 'Offset vs Debt Recycling',
    description: 'Compare parking cash in your offset account vs investing via debt recycling.',
    icon: '⇄',
    color: 'border-blue-500',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  {
    path: '/direct-vs-dr',
    title: 'Direct Investing vs DR',
    description: 'Should you invest directly or leverage debt recycling? Find your breakeven.',
    icon: '↗',
    color: 'border-cyan-500',
    accent: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    path: '/tax-savings',
    title: 'Tax Savings Guide',
    description: 'Super salary sacrifice, debt recycling deductions, negative gearing, and bracket visualiser.',
    icon: '%',
    color: 'border-violet-500',
    accent: 'text-violet-600 dark:text-violet-400',
  },
  {
    path: '/house-affordability',
    title: 'House Affordability',
    description: 'Borrowing capacity, stamp duty by state, LMI, and true monthly ownership cost.',
    icon: '⌂',
    color: 'border-green-500',
    accent: 'text-green-600 dark:text-green-400',
  },
  {
    path: '/fire',
    title: 'FIRE Calculator Suite',
    description: 'Classic, Coast, Barista, Lean/Fat FIRE + Australian Super Bridge calculator.',
    icon: '🔥',
    color: 'border-amber-500',
    accent: 'text-amber-600 dark:text-amber-400',
  },
  {
    path: '/investment-compare',
    title: 'Investment Comparison',
    description: 'Compare up to 4 investment scenarios with different tax treatments and fees.',
    icon: '≋',
    color: 'border-pink-500',
    accent: 'text-pink-600 dark:text-pink-400',
  },
  {
    path: '/savings-rate',
    title: 'Savings Rate Impact',
    description: 'See how your savings rate directly drives your years to financial independence.',
    icon: '↑',
    color: 'border-teal-500',
    accent: 'text-teal-600 dark:text-teal-400',
  },
  {
    path: '/property-research',
    title: 'Property Research Tool',
    description: '130-point investment property checklist — suburb, location, and property scoring.',
    icon: '✓',
    color: 'border-orange-500',
    accent: 'text-orange-600 dark:text-orange-400',
  },
];

export function Landing() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Australian Personal Finance Calculators
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Free, privacy-first tools built for Australian investors. No sign-up, no tracking —
          all calculations run entirely in your browser.
        </p>
        <div className="mt-3 inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
          Based on 2024-25 ATO rates
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CALCULATORS.map(calc => (
          <Link
            key={calc.path}
            to={calc.path}
            className={`block rounded-xl border-l-4 ${calc.color} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md dark:hover:border-slate-700 transition-all group`}
          >
            <div className={`text-2xl mb-3 ${calc.accent}`}>{calc.icon}</div>
            <h2 className={`text-sm font-bold mb-1.5 group-hover:${calc.accent} transition-colors`}>
              {calc.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {calc.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
        <strong className="text-slate-700 dark:text-slate-300">Australia-specific:</strong>{' '}
        All calculators use Australian tax brackets, super rules, CGT discounts, stamp duty by state,
        and APRA serviceability buffers. No US-centric assumptions.
      </div>
    </div>
  );
}
