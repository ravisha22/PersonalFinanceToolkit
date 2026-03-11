import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { NumberInput } from '../components/ui/NumberInput';
import { SliderControl } from '../components/ui/SliderControl';
import { Disclaimer } from '../components/shared/Disclaimer';
import { usePortfolio, totalAnnualExpenses, type PortfolioData } from '../context/PortfolioContext';
import { getMarginalRate } from '../data/tax-brackets';
import { formatCurrency } from '../utils/formatters';

function SectionHeader({ num, title, subtitle, color }: {
  num: number; title: string; subtitle: string; color: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-7 h-7 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>
        {num}
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

const EXPENSE_FIELDS: { key: keyof PortfolioData; label: string }[] = [
  { key: 'expRent',          label: 'Rent / Board' },
  { key: 'expGroceries',     label: 'Groceries & Food' },
  { key: 'expDining',        label: 'Dining Out & Takeaway' },
  { key: 'expUtilities',     label: 'Utilities (electricity, gas, water)' },
  { key: 'expInternet',      label: 'Internet & Phone' },
  { key: 'expTransport',     label: 'Transport (fuel, rego, public transport)' },
  { key: 'expHealth',        label: 'Health & Medical (incl. health insurance)' },
  { key: 'expInsurance',     label: 'Insurance (home, contents, life, income protection)' },
  { key: 'expEntertainment', label: 'Entertainment & Subscriptions' },
  { key: 'expClothing',      label: 'Clothing & Personal Care' },
  { key: 'expEducation',     label: 'Education (school fees, courses)' },
  { key: 'expChildcare',     label: 'Childcare' },
  { key: 'expTravel',        label: 'Travel & Holidays' },
  { key: 'expGym',           label: 'Gym & Sports' },
  { key: 'expHomeMaint',     label: 'Home Maintenance & Repairs' },
  { key: 'expPets',          label: 'Pets' },
  { key: 'expMisc',          label: 'Miscellaneous' },
];

export function Portfolio() {
  const { portfolio, setPortfolio } = usePortfolio();

  const suggestedMargTax = useMemo(
    () => portfolio.grossSalary > 0 ? Math.round(getMarginalRate(portfolio.grossSalary) * 100) : null,
    [portfolio.grossSalary],
  );

  const expTotal = useMemo(() => totalAnnualExpenses(portfolio), [portfolio]);

  const set = (key: keyof PortfolioData) => (v: number) =>
    setPortfolio({ [key]: v });

  const filledSections = [
    portfolio.grossSalary > 0,
    portfolio.savingsBalance > 0 || portfolio.monthlySavingsContrib > 0,
    portfolio.mortgageBalance > 0,
    portfolio.etfValue > 0 || portfolio.monthlyEtfContrib > 0,
    portfolio.superBalance > 0,
    expTotal > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page header */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          My Portfolio
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Enter your current financial holdings. All information stays in your browser — nothing is sent anywhere.
          Once filled in, every calculator below will start with your actual numbers.
        </p>
        {filledSections > 0 && (
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            {filledSections}/6 sections filled — {6 - filledSections > 0 ? `${6 - filledSections} remaining` : 'all done'}
          </div>
        )}
      </div>

      {/* Section 1 — Income & Tax */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-5">
        <SectionHeader
          num={1} title="Income & Tax" color="bg-blue-600"
          subtitle="Your gross annual salary and the marginal rate you pay on the last dollar earned."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Gross Annual Salary"
            value={portfolio.grossSalary}
            onChange={set('grossSalary')}
            min={0} max={2000000} step={1000}
            prefix="$"
          />
          <div className="flex flex-col gap-1.5">
            <SliderControl
              label="Marginal Tax Rate"
              value={portfolio.margTax}
              onChange={set('margTax')}
              min={0} max={49} step={1}
              suffix="%"
            />
            {suggestedMargTax !== null && suggestedMargTax !== portfolio.margTax && (
              <button
                onClick={() => setPortfolio({ margTax: suggestedMargTax })}
                className="text-[10px] text-blue-500 hover:text-blue-700 dark:text-blue-400 text-left"
              >
                Based on your salary, suggested rate is {suggestedMargTax}% — click to apply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section 2 — Cash & Savings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-5">
        <SectionHeader
          num={2} title="Cash & Savings" color="bg-green-600"
          subtitle="Savings accounts, high-yield accounts, term deposits, and how much you save each month."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Total Savings Balance"
            value={portfolio.savingsBalance}
            onChange={set('savingsBalance')}
            min={0} max={5000000} step={1000}
            prefix="$"
          />
          <NumberInput
            label="Monthly Savings Contribution"
            value={portfolio.monthlySavingsContrib}
            onChange={set('monthlySavingsContrib')}
            min={0} max={50000} step={100}
            prefix="$"
          />
        </div>
      </div>

      {/* Section 3 — Property & Mortgage */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-5">
        <SectionHeader
          num={3} title="Property & Mortgage" color="bg-amber-500"
          subtitle="Your primary residence. Leave at zero if renting."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Property Value"
            value={portfolio.propertyValue}
            onChange={set('propertyValue')}
            min={0} max={10000000} step={10000}
            prefix="$"
          />
          <NumberInput
            label="Outstanding Mortgage Balance"
            value={portfolio.mortgageBalance}
            onChange={set('mortgageBalance')}
            min={0} max={5000000} step={5000}
            prefix="$"
          />
          <SliderControl
            label="Mortgage Interest Rate"
            value={portfolio.mortgageRate}
            onChange={set('mortgageRate')}
            min={0} max={15} step={0.1}
            suffix="%"
          />
          <SliderControl
            label="Years Remaining on Mortgage"
            value={portfolio.mortgageYearsRemaining}
            onChange={v => setPortfolio({ mortgageYearsRemaining: Math.round(v) })}
            min={0} max={40} step={1}
            suffix=" yrs"
          />
        </div>
      </div>

      {/* Section 4 — Investments */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-5">
        <SectionHeader
          num={4} title="Investments (ETFs & Shares)" color="bg-violet-600"
          subtitle="Your taxable investment portfolio outside of super. Includes ETFs, individual shares, and managed funds."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            label="Current Portfolio Value"
            value={portfolio.etfValue}
            onChange={set('etfValue')}
            min={0} max={10000000} step={1000}
            prefix="$"
          />
          <NumberInput
            label="Monthly Contribution"
            value={portfolio.monthlyEtfContrib}
            onChange={set('monthlyEtfContrib')}
            min={0} max={50000} step={100}
            prefix="$"
          />
          <SliderControl
            label="Expected Annual Return"
            value={portfolio.etfReturn}
            onChange={set('etfReturn')}
            min={0} max={20} step={0.5}
            suffix="%"
          />
        </div>
      </div>

      {/* Section 5 — Superannuation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-5">
        <SectionHeader
          num={5} title="Superannuation" color="bg-cyan-600"
          subtitle="Your current super balance and monthly contributions (employer SG + any salary sacrifice)."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Current Super Balance"
            value={portfolio.superBalance}
            onChange={set('superBalance')}
            min={0} max={5000000} step={1000}
            prefix="$"
          />
          <NumberInput
            label="Monthly Contributions (SG + salary sacrifice)"
            value={portfolio.monthlySuperContrib}
            onChange={set('monthlySuperContrib')}
            min={0} max={20000} step={100}
            prefix="$"
          />
        </div>
      </div>

      {/* Section 6 — Living Expenses */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-5">
        <SectionHeader
          num={6} title="Living Expenses" color="bg-rose-500"
          subtitle="Annual amounts for each category. Enter what applies to you — leave others at zero. Total is used in FIRE and Savings Rate calculations."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {EXPENSE_FIELDS.map(({ key, label }) => (
            <NumberInput
              key={key}
              label={label}
              value={portfolio[key] as number}
              onChange={set(key)}
              min={0} max={500000} step={100}
              prefix="$"
            />
          ))}
        </div>
        {/* Total expenses summary */}
        <div className={`rounded-lg px-4 py-3 border flex items-center justify-between ${
          expTotal > 0
            ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}>
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Total Annual Expenses</span>
          <span className={`font-mono font-bold text-sm ${expTotal > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
            {expTotal > 0 ? formatCurrency(expTotal) : '—'}
          </span>
        </div>
        {portfolio.grossSalary > 0 && expTotal > 0 && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
            Implied annual savings: {formatCurrency(Math.max(0, portfolio.grossSalary - expTotal))}
            {' '}({Math.round(Math.max(0, (portfolio.grossSalary - expTotal) / portfolio.grossSalary) * 100)}% savings rate before tax)
          </p>
        )}
      </div>

      {/* Summary — what gets pre-filled */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          What gets pre-filled from your portfolio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
          {[
            ['Tax Savings', 'Gross salary, marginal tax rate'],
            ['Savings Rate', 'Salary, expenses, monthly savings'],
            ['FIRE', 'Annual expenses, super balance, monthly savings'],
            ['Investment Comparison', 'ETF balance, monthly contribution, super balance'],
            ['House Affordability', 'Gross income, property value, mortgage rate'],
            ['Property Research', '(property details entered separately)'],
            ['Offset vs Debt Recycling', 'Mortgage balance, rate, years, marginal tax'],
            ['Direct vs Debt Recycling', 'ETF value, mortgage rate, marginal tax'],
          ].map(([tool, fields]) => (
            <div key={tool} className="flex gap-2">
              <span className="text-blue-500 dark:text-blue-400 font-medium shrink-0">{tool}:</span>
              <span className="text-slate-500 dark:text-slate-400">{fields}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-2 py-4">
        <NavLink
          to="/tax-savings"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          Continue to Tax Savings
          <span aria-hidden>→</span>
        </NavLink>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          You can return to update these values at any time — your other calculators will reflect the changes.
        </p>
      </div>

      <Disclaimer calculatorName="Portfolio" />
    </div>
  );
}
