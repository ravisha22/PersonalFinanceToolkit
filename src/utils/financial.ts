/**
 * Shared financial math utilities.
 * Pure functions — no side effects, no imports from React.
 * Use monthly compounding throughout unless stated otherwise.
 */

/**
 * Calculate monthly P&I repayment amount.
 * @param principal - Loan amount in AUD
 * @param annualRatePct - Annual interest rate as a percentage (e.g. 6.0 for 6%)
 * @param years - Loan term in years
 */
export function monthlyRepayment(
  principal: number,
  annualRatePct: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Future value of a lump sum with compound growth.
 * @param present - Present value
 * @param annualRatePct - Annual rate as a percentage
 * @param years - Number of years
 */
export function futureValue(present: number, annualRatePct: number, years: number): number {
  return present * Math.pow(1 + annualRatePct / 100, years);
}

/**
 * Future value of regular contributions (ordinary annuity).
 * @param annualContribution - Amount added each year
 * @param annualRatePct - Annual rate as a percentage
 * @param years - Number of years
 */
export function futureValueAnnuity(
  annualContribution: number,
  annualRatePct: number,
  years: number,
): number {
  if (annualRatePct === 0) return annualContribution * years;
  const r = annualRatePct / 100;
  return annualContribution * ((Math.pow(1 + r, years) - 1) / r);
}

/**
 * Years required for a portfolio to grow from current value to a target,
 * given annual contributions and a return rate.
 * Uses binary search (no closed-form solution with contributions).
 */
export function yearsToTarget(
  current: number,
  annualContribution: number,
  targetAmount: number,
  annualRatePct: number,
  maxYears = 100,
): number {
  if (current >= targetAmount) return 0;
  let balance = current;
  const r = annualRatePct / 100;
  for (let y = 1; y <= maxYears; y++) {
    balance = balance * (1 + r) + annualContribution;
    if (balance >= targetAmount) return y;
  }
  return maxYears;
}

/**
 * Compound growth projection array — one entry per year.
 * @returns Array of balances at end of each year (length = years)
 */
export function projectGrowth(
  initial: number,
  annualContribution: number,
  annualRatePct: number,
  years: number,
): number[] {
  const r = annualRatePct / 100;
  const result: number[] = [];
  let balance = initial;
  for (let y = 1; y <= years; y++) {
    balance = balance * (1 + r) + annualContribution;
    result.push(Math.round(balance));
  }
  return result;
}

/**
 * Estimate Lenders Mortgage Insurance (LMI) premium.
 * Approximate only — actual premiums vary by lender.
 */
export function estimateLMI(loanAmount: number, propertyValue: number): number {
  if (propertyValue <= 0) return 0;
  const lvr = loanAmount / propertyValue;
  if (lvr <= 0.80) return 0;
  if (lvr <= 0.85) return loanAmount * 0.006;
  if (lvr <= 0.90) return loanAmount * 0.013;
  if (lvr <= 0.95) return loanAmount * 0.025;
  return loanAmount * 0.040;
}

/**
 * APRA serviceability: maximum borrowing at (rate + buffer), 30% income cap.
 */
export function maxBorrowingCapacity(
  grossIncome: number,
  annualRatePct: number,
  years = 30,
  buffer = 3.0,
  maxHousingRatio = 0.30,
): number {
  const assessmentRate = annualRatePct + buffer;
  const maxMonthlyRepayment = (grossIncome * maxHousingRatio) / 12;
  const r = assessmentRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return maxMonthlyRepayment * n;
  // Invert monthlyRepayment formula to solve for principal
  return (maxMonthlyRepayment * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}
