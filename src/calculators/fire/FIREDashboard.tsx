import { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import { Assumptions } from '../../components/shared/Assumptions';
import { Disclaimer } from '../../components/shared/Disclaimer';
import { AboutCalc } from '../../components/shared/AboutCalc';
import { ClassicFIRE } from './ClassicFIRE';
import { CoastFIRE } from './CoastFIRE';
import { BaristaFIRE } from './BaristaFIRE';
import { LeanVsFat } from './LeanVsFat';
import { SuperBridge } from './SuperBridge';
import { usePortfolio } from '../../context/PortfolioContext';

const TABS = [
  { id: 'classic', label: 'Classic FIRE' },
  { id: 'coast', label: 'Coast FIRE' },
  { id: 'barista', label: 'Barista FIRE' },
  { id: 'leanfat', label: 'Lean vs Fat' },
  { id: 'superbridge', label: 'Super Bridge' },
];

const ASSUMPTIONS = [
  'FIRE number = annual expenses / safe withdrawal rate (4% rule).',
  'Projections use annual compounding; no inflation adjustment.',
  'Super preservation age = 60 (born after 1 July 1964).',
  'Super Bridge assumes super cannot be accessed before preservation age.',
  'Coast FIRE: no further contributions needed after reaching coast number.',
  'Barista FIRE: part-time income covers daily expenses; portfolio covers the gap.',
  'Based on 2024-25 ATO rates.',
];

export function FIREDashboard() {
  const { portfolio } = usePortfolio();
  const [activeTab, setActiveTab] = useState('classic');
  const [currentAge, setCurrentAge] = useState(35);

  // Override values — used only when portfolio fields are empty
  const [investmentsOverride, setInvestmentsOverride] = useState(200000);
  const [annualSavingsOverride, setAnnualSavingsOverride] = useState(50000);
  const [superOverride, setSuperOverride] = useState(150000);

  const [returnRate, setReturnRate] = useState(7);

  // Effective values: portfolio wins when non-zero
  const portfolioInvestments = portfolio.savingsBalance + portfolio.etfValue;
  const portfolioAnnualSavings = portfolio.monthlySavingsContrib * 12;
  const currentInvestments = portfolioInvestments > 0 ? portfolioInvestments : investmentsOverride;
  const annualSavings = portfolioAnnualSavings > 0 ? portfolioAnnualSavings : annualSavingsOverride;
  const superBalance = portfolio.superBalance > 0 ? portfolio.superBalance : superOverride;

  const investmentsLocked = portfolioInvestments > 0;
  const annualSavingsLocked = portfolioAnnualSavings > 0;
  const superBalanceLocked = portfolio.superBalance > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          FIRE Calculator Suite
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Australian FIRE planning: Classic, Coast, Barista, Lean vs Fat, and the Super Bridge strategy.
        </p>
      </div>

      <AboutCalc title="About FIRE planning" concepts={[
        {
          term: 'What is FIRE (Financial Independence, Retire Early)?',
          definition: 'A movement focused on building enough investments to live off returns without working. The core idea: save and invest a large portion of income until your portfolio generates enough passive income to cover your expenses indefinitely.',
          link: 'https://en.wikipedia.org/wiki/FIRE_movement',
          linkLabel: 'Wikipedia: FIRE movement',
        },
        {
          term: 'What is the 4% rule (safe withdrawal rate)?',
          definition: 'A guideline from the Trinity Study: you can withdraw 4% of your portfolio each year with very low risk of running out of money over 30+ years. Your FIRE number = annual expenses ÷ 4%.',
          link: 'https://en.wikipedia.org/wiki/Trinity_study',
          linkLabel: 'Wikipedia: Trinity study',
        },
        {
          term: 'Classic FIRE: full retirement from investments',
          definition: 'The original FIRE model: save and invest aggressively until your portfolio covers 100% of your annual expenses at the safe withdrawal rate. You stop working entirely. Requires the largest portfolio — but gives you total freedom.',
        },
        {
          term: 'Coast FIRE: invest early, coast to retirement',
          definition: 'Reach a "coast number" early in life — a portfolio large enough that, with no further contributions, it will grow to your full FIRE number by traditional retirement age. After reaching Coast FIRE, you only need to earn enough to cover current expenses. No more saving required.',
        },
        {
          term: 'Barista FIRE: part-time work covers living costs',
          definition: 'Semi-retire with a smaller portfolio that covers the gap between your expenses and a modest part-time income. Named after the idea of working part-time at a coffee shop for income and benefits. Lower target than Classic FIRE, but requires continued part-time work.',
        },
        {
          term: 'Lean vs Fat FIRE: lifestyle trade-offs',
          definition: 'Lean FIRE targets minimal expenses (often under $40k/year) for maximum speed. Fat FIRE targets higher spending ($80k–$120k+/year) for a more comfortable lifestyle. Same maths — just different expense targets. This tab lets you compare the years-to-FIRE difference side by side.',
        },
        {
          term: 'The Australian Super Bridge',
          definition: 'Australian FIRE has a complication: superannuation cannot be accessed before preservation age (currently 60). If you retire early at 50, you need enough non-super assets to fund 10 years until you can access your super. This calculator models both phases — the bridge period and post-preservation.',
          link: 'https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super',
          linkLabel: 'ATO: Accessing your super',
        },
      ]} />

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === 'classic' && (
          <ClassicFIRE
            currentAge={currentAge}
            onCurrentAgeChange={setCurrentAge}
            currentInvestments={currentInvestments}
            onCurrentInvestmentsChange={setInvestmentsOverride}
            investmentsLocked={investmentsLocked}
            annualSavings={annualSavings}
            onAnnualSavingsChange={setAnnualSavingsOverride}
            annualSavingsLocked={annualSavingsLocked}
            returnRate={returnRate}
            onReturnRateChange={setReturnRate}
          />
        )}
        {activeTab === 'coast' && (
          <CoastFIRE
            currentInvestments={currentInvestments}
            returnRate={returnRate}
          />
        )}
        {activeTab === 'barista' && (
          <BaristaFIRE
            currentInvestments={currentInvestments}
            returnRate={returnRate}
            currentAge={currentAge}
          />
        )}
        {activeTab === 'leanfat' && (
          <LeanVsFat
            currentInvestments={currentInvestments}
            annualSavings={annualSavings}
            returnRate={returnRate}
          />
        )}
        {activeTab === 'superbridge' && (
          <SuperBridge
            currentAge={currentAge}
            nonSuperBalance={currentInvestments}
            superBalance={superBalance}
            onSuperBalanceChange={setSuperOverride}
            superBalanceLocked={superBalanceLocked}
            returnRate={returnRate}
          />
        )}
      </div>

      <Assumptions items={ASSUMPTIONS} />
      <Disclaimer calculatorName="FIRE Calculator Suite" />
    </div>
  );
}
