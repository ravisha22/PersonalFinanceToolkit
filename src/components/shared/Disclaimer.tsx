import { CURRENT_TAX_YEAR } from '../../data/constants';

interface DisclaimerProps {
  calculatorName?: string;
}

export function Disclaimer({ calculatorName }: DisclaimerProps) {
  return (
    <div className="mt-6 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-xs text-red-700 dark:text-red-400 leading-relaxed">
      <strong>Disclaimer:</strong> This {calculatorName ?? 'calculator'} is for educational
      purposes only and does not constitute financial advice. All figures are estimates based
      on {CURRENT_TAX_YEAR} ATO rates and may not reflect your personal circumstances.
      Past performance does not guarantee future returns. Tax outcomes depend on individual
      circumstances — consult a registered tax agent or licensed financial adviser before
      acting on any calculation.
    </div>
  );
}
