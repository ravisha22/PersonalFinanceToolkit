/**
 * Savings Rate Impact — Financial Engine
 *
 * Models how dramatically savings rate affects years to financial independence.
 * Uses the 4% safe withdrawal rule (FIRE number = annual expenses / 0.04).
 *
 * Assumptions:
 * - Annual compounding
 * - "Years to FIRE" = years until portfolio covers annual expenses via 4% SWR
 * - Annual expenses = income × (1 - savingsRate)
 * - SWR is fixed at 4%
 */

const SWR = 0.04;

export interface SavingsRateRow {
  /** Savings rate as a decimal (0.10 to 0.90) */
  rate: number;
  /** Annual expenses when spending income * (1 - rate) */
  annualExpenses: number;
  /** FIRE number = annualExpenses / SWR */
  fireNumber: number;
  /** Years to reach FIRE from currentNW */
  years: number;
}

export interface SavingsRateResult {
  rows: SavingsRateRow[];
  /** Row matching the user's actual savings rate (closest step) */
  currentRow: SavingsRateRow;
}

/**
 * Calculate years to reach a FIRE target from a given starting net worth,
 * with annual savings and a fixed annual return rate.
 *
 * @param currentNW - Current net worth / investable assets ($)
 * @param annualSavings - Amount saved per year ($)
 * @param fireNumber - Target portfolio size ($)
 * @param returnRate - Annual investment return as percent (e.g. 7)
 * @returns Years to FIRE (integer, capped at 100 if unreachable)
 */
export function yearsToFIREFromNW(
  currentNW: number,
  annualSavings: number,
  fireNumber: number,
  returnRate: number,
): number {
  if (currentNW >= fireNumber) return 0;
  if (annualSavings <= 0 && returnRate <= 0) return 100;

  const r = returnRate / 100;
  let balance = currentNW;

  for (let y = 1; y <= 100; y++) {
    balance = balance * (1 + r) + annualSavings;
    if (balance >= fireNumber) return y;
  }
  return 100;
}

/**
 * Build a table of savings rates from 10% to 90% (in 5% steps) showing
 * the impact on years to financial independence.
 *
 * @param income - Annual after-tax income ($)
 * @param currentNW - Current net worth ($)
 * @param returnRate - Annual return rate as percent (e.g. 7)
 * @param currentSavingsRate - User's current savings rate as percent (e.g. 30)
 * @returns SavingsRateResult with all rows and the highlighted current row
 */
export function yearsToFIREBySavingsRate(
  income: number,
  currentNW: number,
  returnRate: number,
  currentSavingsRate: number,
): SavingsRateResult {
  const steps = Array.from({ length: 17 }, (_, i) => 10 + i * 5); // 10..90

  const rows: SavingsRateRow[] = steps.map(pct => {
    const rate = pct / 100;
    const annualExpenses = income * (1 - rate);
    const annualSavings = income * rate;
    const fireNumber = annualExpenses / SWR;
    const years = yearsToFIREFromNW(currentNW, annualSavings, fireNumber, returnRate);
    return { rate, annualExpenses, fireNumber, years };
  });

  // Find the row closest to the user's current savings rate
  const targetPct = Math.round(currentSavingsRate / 5) * 5;
  const clampedPct = Math.max(10, Math.min(90, targetPct));
  const currentRow = rows.find(r => Math.round(r.rate * 100) === clampedPct) ?? rows[4]; // fallback 30%

  return { rows, currentRow };
}

/**
 * Build a year-by-year projection for a given savings rate and income.
 * Useful for the trajectory line chart.
 *
 * @param income - Annual after-tax income ($)
 * @param currentNW - Current net worth ($)
 * @param savingsRatePct - Savings rate as percent (e.g. 30)
 * @param returnRate - Annual return rate as percent (e.g. 7)
 * @param maxYears - How many years to project
 * @returns Array of balances indexed by year (index 0 = end of year 1)
 */
export function projectBySavingsRate(
  income: number,
  currentNW: number,
  savingsRatePct: number,
  returnRate: number,
  maxYears: number,
): number[] {
  const annualSavings = income * (savingsRatePct / 100);
  const r = returnRate / 100;
  let balance = currentNW;
  const result: number[] = [];

  for (let y = 1; y <= maxYears; y++) {
    balance = balance * (1 + r) + annualSavings;
    result.push(Math.round(balance));
  }
  return result;
}
