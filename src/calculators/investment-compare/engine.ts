/**
 * Investment Comparison — Financial Engine
 * Compare up to 4 investment scenarios with different tax treatments and fees.
 */

export type TaxTreatment = 'marginal' | 'super' | 'tax-free';

export interface ScenarioParams {
  label: string;
  initial: number;
  monthlyContribution: number;
  annualReturn: number;   // percent
  mer: number;            // percent annual fee
  taxTreatment: TaxTreatment;
  marginalRate: number;   // decimal (e.g. 0.32)
}

export interface ScenarioYearRow {
  year: number;
  balance: number;
  totalContributions: number;
  totalFeesPaid: number;
}

export interface ScenarioResult {
  label: string;
  color: string;
  finalBalance: number;
  totalContributions: number;
  totalFeesPaid: number;
  afterTaxFinalBalance: number;
  yearly: ScenarioYearRow[];
}

const SCENARIO_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

/**
 * Run a single investment scenario with monthly compounding.
 *
 * Tax treatment:
 * - marginal: growth taxed at marginalRate each month
 * - super: growth taxed at 15%
 * - tax-free: no tax on growth (e.g. offset account, TFSA)
 *
 * @param params - ScenarioParams
 * @param years - Projection horizon
 * @param colorIndex - Index for chart color assignment
 */
export function runScenario(
  params: ScenarioParams,
  years: number,
  colorIndex = 0,
): ScenarioResult {
  const {
    label,
    initial,
    monthlyContribution,
    annualReturn,
    mer,
    taxTreatment,
    marginalRate,
  } = params;

  const netAnnualReturn = annualReturn - mer;
  void netAnnualReturn; // netAnnualReturn derived below per-month

  const taxRate =
    taxTreatment === 'marginal' ? marginalRate :
    taxTreatment === 'super' ? 0.15 :
    0;

  let balance = initial;
  let totalContributions = initial;
  let totalFeesPaid = 0;
  const yearly: ScenarioYearRow[] = [];

  for (let m = 1; m <= years * 12; m++) {
    // Monthly growth (after MER, before tax)
    const grossGrowth = balance * (annualReturn / 100 / 12);
    const merCost = balance * (mer / 100 / 12);
    const netGrowth = grossGrowth - merCost;
    const taxOnGrowth = netGrowth > 0 ? netGrowth * taxRate : 0;
    const afterTaxGrowth = netGrowth - taxOnGrowth;

    balance += afterTaxGrowth + monthlyContribution;
    totalContributions += monthlyContribution;
    totalFeesPaid += merCost;

    if (m % 12 === 0) {
      yearly.push({
        year: m / 12,
        balance: Math.round(balance),
        totalContributions: Math.round(totalContributions),
        totalFeesPaid: Math.round(totalFeesPaid),
      });
    }
  }

  // After-tax final balance (no further CGT for super/tax-free; marginal has tax on growth already applied)
  const afterTaxFinalBalance = balance;

  return {
    label,
    color: SCENARIO_COLORS[colorIndex % SCENARIO_COLORS.length],
    finalBalance: Math.round(balance),
    totalContributions: Math.round(totalContributions),
    totalFeesPaid: Math.round(totalFeesPaid),
    afterTaxFinalBalance: Math.round(afterTaxFinalBalance),
    yearly,
  };
}

/**
 * Run all scenarios.
 */
export function runAllScenarios(
  scenarios: ScenarioParams[],
  years: number,
): ScenarioResult[] {
  return scenarios.map((s, i) => runScenario(s, years, i));
}

export { SCENARIO_COLORS };
