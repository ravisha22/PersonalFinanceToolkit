import { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import { Assumptions } from '../../components/shared/Assumptions';
import { Disclaimer } from '../../components/shared/Disclaimer';
import { SuperSalarySacrifice } from './SuperSalarySacrifice';
import { DebtRecyclingTax } from './DebtRecyclingTax';
import { NegativeGearing } from './NegativeGearing';
import { TaxBracketVis } from './TaxBracketVis';

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
  const [activeTab, setActiveTab] = useState('super');
  const [grossSalary, setGrossSalary] = useState(250000);
  const [investLoanBal, setInvestLoanBal] = useState(300000);
  const [rate, setRate] = useState(5.7);
  const [margTax, setMargTax] = useState(47);

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

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === 'super' && (
          <SuperSalarySacrifice
            grossSalary={grossSalary}
            onGrossSalaryChange={setGrossSalary}
          />
        )}
        {activeTab === 'dr' && (
          <DebtRecyclingTax
            investLoanBal={investLoanBal}
            onInvestLoanBalChange={setInvestLoanBal}
            rate={rate}
            onRateChange={setRate}
            margTax={margTax}
            onMargTaxChange={setMargTax}
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
