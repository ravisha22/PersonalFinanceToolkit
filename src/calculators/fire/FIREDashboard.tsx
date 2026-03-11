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
  const [activeTab, setActiveTab] = useState('classic');
  const [currentAge, setCurrentAge] = useState(35);
  const [currentInvestments, setCurrentInvestments] = useState(200000);
  const [annualSavings, setAnnualSavings] = useState(50000);
  const [returnRate, setReturnRate] = useState(7);
  const [superBalance, setSuperBalance] = useState(150000);

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

      <AboutCalc concepts={[
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
          term: 'What is the Australian Super Bridge?',
          definition: 'Australian FIRE has a complication: superannuation cannot be accessed before preservation age (currently 60). If you retire early at 50, you need enough non-super assets to fund 10 years until you can access your super. This calculator models both phases.',
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
            onCurrentInvestmentsChange={setCurrentInvestments}
            annualSavings={annualSavings}
            onAnnualSavingsChange={setAnnualSavings}
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
            onSuperBalanceChange={setSuperBalance}
            returnRate={returnRate}
          />
        )}
      </div>

      <Assumptions items={ASSUMPTIONS} />
      <Disclaimer calculatorName="FIRE Calculator Suite" />
    </div>
  );
}
