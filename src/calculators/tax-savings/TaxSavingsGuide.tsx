import { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import { Assumptions } from '../../components/shared/Assumptions';
import { Disclaimer } from '../../components/shared/Disclaimer';
import { AboutCalc } from '../../components/shared/AboutCalc';
import { SuperSalarySacrifice } from './SuperSalarySacrifice';
import { DebtRecyclingTax } from './DebtRecyclingTax';
import { NegativeGearing } from './NegativeGearing';
import { TaxBracketVis } from './TaxBracketVis';
import { usePortfolio } from '../../context/PortfolioContext';

const TABS = [
  { id: 'super', label: 'Super Sacrifice' },
  { id: 'dr', label: 'DR Tax Benefit' },
  { id: 'negear', label: 'Negative Gearing' },
  { id: 'brackets', label: 'Tax Brackets' },
];

const ASSUMPTIONS: Record<string, string[]> = {
  super: [
    'Based on 2024-25 concessional contribution cap of $30,000.',
    'Division 293 applies when taxable income + concessional contributions > $250,000.',
    'Carry-forward unused cap available only if total super balance < $500,000.',
    'Projected balance uses annual compounding on employer SG + actual sacrifice (after 15% tax).',
    'No ongoing salary increases or changes in super return modelled.',
  ],
  dr: [
    'Investment loan is interest-only; balance stays constant.',
    'Annual deduction = loan balance × rate × marginal tax rate.',
    'Based on 2024-25 ATO rates.',
  ],
  negear: [
    'Mortgage interest calculated on property value × LVR.',
    'Property management fee applied to gross rental income.',
    'Depreciation is a non-cash deduction (reduces taxable income but not cash outflow).',
    'Positive gearing means rental income exceeds all deductible expenses.',
    'Based on 2024-25 ATO rates.',
  ],
  brackets: [
    'Stage 3 tax cuts apply from 1 July 2024.',
    'Medicare levy: 2% flat rate (with low-income reduction below $26,000).',
    'HELP repayment based on 2024-25 ATO repayment thresholds.',
    'LMITO (Low and Middle Income Tax Offset) ended 30 June 2022.',
  ],
};

export function TaxSavingsGuide() {
  const { portfolio } = usePortfolio();

  // Override values — only used when portfolio field is empty (0)
  const [grossSalaryOverride, setGrossSalaryOverride] = useState(85000);
  const [investLoanBalOverride, setInvestLoanBalOverride] = useState(300000);
  const [rateOverride, setRateOverride] = useState(6.0);
  const [margTaxOverride, setMargTaxOverride] = useState(34.5);

  const [activeTab, setActiveTab] = useState('super');

  // Effective values: portfolio wins when non-zero
  const grossSalary = portfolio.grossSalary > 0 ? portfolio.grossSalary : grossSalaryOverride;
  const investLoanBal = portfolio.mortgageBalance > 0 ? portfolio.mortgageBalance : investLoanBalOverride;
  const rate = portfolio.mortgageRate > 0 ? portfolio.mortgageRate : rateOverride;
  const margTax = portfolio.margTax > 0 ? portfolio.margTax : margTaxOverride;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Tax Savings Guide
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Australian tax strategies: super salary sacrifice, debt recycling deductions, negative gearing, and tax bracket visualisation.
          Based on 2024-25 ATO rates.
        </p>
      </div>

      <AboutCalc title="About this guide" concepts={[
        {
          term: 'What is salary sacrifice to superannuation?',
          definition: 'You ask your employer to redirect part of your pre-tax salary into super. That money is taxed at 15% (the super contribution rate) instead of your marginal income tax rate. If you earn $85k, your marginal rate is ~34.5% — so sacrificing $10,000 saves $1,950 in tax, subject to the $30,000 annual concessional cap.',
          link: 'https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/salary-sacrificing-super',
          linkLabel: 'ATO: Salary sacrificing into super',
        },
        {
          term: 'What is negative gearing?',
          definition: 'When your investment property\'s costs (mortgage interest, rates, insurance, maintenance) exceed the rent you receive, the loss is "negatively geared". You can deduct this loss from your other income (e.g., wages), reducing your total tax bill.',
          link: 'https://en.wikipedia.org/wiki/Negative_gearing',
          linkLabel: 'Wikipedia: Negative gearing',
        },
        {
          term: 'What is Division 293 tax?',
          definition: 'High earners (income + concessional super contributions over $250,000) pay an extra 15% tax on those contributions. This reduces the super tax benefit from 15% to effectively 30% for affected individuals.',
          link: 'https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/division-293-tax',
          linkLabel: 'ATO: Division 293 tax',
        },
      ]} />

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === 'super' && (
          <SuperSalarySacrifice
            grossSalary={grossSalary}
            onGrossSalaryChange={setGrossSalaryOverride}
          />
        )}
        {activeTab === 'dr' && (
          <DebtRecyclingTax
            investLoanBal={investLoanBal}
            onInvestLoanBalChange={setInvestLoanBalOverride}
            rate={rate}
            onRateChange={setRateOverride}
            margTax={margTax}
            onMargTaxChange={setMargTaxOverride}
          />
        )}
        {activeTab === 'negear' && <NegativeGearing />}
        {activeTab === 'brackets' && <TaxBracketVis />}
      </div>

      <Assumptions items={ASSUMPTIONS[activeTab] ?? []} />
      <Disclaimer calculatorName="Tax Savings Guide" />
    </div>
  );
}
