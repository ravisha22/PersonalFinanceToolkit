/**
 * Direct Investing vs Debt Recycling — Financial Engine
 * Pure functions, no React, no side effects.
 *
 * margTax parameters are DECIMALS (e.g. 0.32 for 32%).
 * Rates are PERCENTAGES (e.g. 8.5 for 8.5% pa).
 */

export interface DirectYearlyRow {
  year: number;
  portfolioValue: number;
  totalDividendsTaxPaid: number;
  netWealth: number;
}

export interface DirectResult {
  finalValue: number;
  totalDividendsTaxPaid: number;
  cgtIfSold: number;
  netWealthAfterCGT: number;
  yearly: DirectYearlyRow[];
}

export interface DRStandaloneYearlyRow {
  year: number;
  portfolioValue: number;
  totalInterestPaid: number;
  totalTaxDeductions: number;
  netInterestCost: number;
  netWealth: number;
}

export interface DRStandaloneResult {
  finalValue: number;
  totalInterestPaid: number;
  totalTaxDeductions: number;
  netInterestCost: number;
  cgtIfSold: number;
  netWealthAfterCGT: number;
  yearly: DRStandaloneYearlyRow[];
}

/**
 * Run a direct (unlevered) ETF investment.
 *
 * @param amount - Initial investment (AUD)
 * @param etfReturn - Total annual return as % (e.g. 8.5)
 * @param divYield - Dividend yield as % (e.g. 2.5) — taxed at margTax each month
 * @param margTax - Marginal tax rate as DECIMAL (e.g. 0.32)
 * @param cgtDiscount - CGT discount as DECIMAL (e.g. 0.5)
 * @param years - Projection horizon
 *
 * Assumptions:
 * - Monthly compounding: portfolio grows at growthOnly per month.
 * - Dividends taxed each month at margTax (reduces effective dividend).
 * - CGT on unrealised gain at end with cgtDiscount discount.
 */
export function runDirectInvest(
  amount: number,
  etfReturn: number,
  divYield: number,
  margTax: number,
  cgtDiscount: number,
  years: number,
): DirectResult {
  const growthOnlyMonthly = (etfReturn - divYield) / 100 / 12;
  const monthlyDivGross = divYield / 100 / 12;

  let portfolioValue = amount;
  let totalDividendsTaxPaid = 0;
  const costBase = amount;
  const yearly: DirectResult['yearly'] = [];

  for (let m = 1; m <= years * 12; m++) {
    const growth = portfolioValue * growthOnlyMonthly;
    const divGross = portfolioValue * monthlyDivGross;
    const divTax = divGross * margTax;
    const divNet = divGross - divTax;
    portfolioValue += growth + divNet;
    totalDividendsTaxPaid += divTax;

    if (m % 12 === 0) {
      const unrealisedGain = portfolioValue - costBase;
      const cgt =
        unrealisedGain > 0 ? unrealisedGain * (1 - cgtDiscount) * margTax : 0;
      yearly.push({
        year: m / 12,
        portfolioValue: Math.round(portfolioValue),
        totalDividendsTaxPaid: Math.round(totalDividendsTaxPaid),
        netWealth: Math.round(portfolioValue - cgt),
      });
    }
  }

  const unrealisedGain = portfolioValue - costBase;
  const cgtIfSold =
    unrealisedGain > 0 ? unrealisedGain * (1 - cgtDiscount) * margTax : 0;

  return {
    finalValue: Math.round(portfolioValue),
    totalDividendsTaxPaid: Math.round(totalDividendsTaxPaid),
    cgtIfSold: Math.round(cgtIfSold),
    netWealthAfterCGT: Math.round(portfolioValue - cgtIfSold),
    yearly,
  };
}

/**
 * Run a debt-recycled ETF investment (levered, tax-deductible interest).
 *
 * @param amount - Investment / loan amount (AUD)
 * @param etfReturn - Total annual ETF return as %
 * @param divYield - Dividend yield as %
 * @param mortgageRate - Borrowing rate as %
 * @param margTax - Marginal tax rate as DECIMAL
 * @param cgtDiscount - CGT discount as DECIMAL
 * @param years - Projection horizon
 *
 * Assumptions:
 * - IO loan at mortgageRate; interest deducted at margTax each month.
 * - Portfolio grows same as direct but interest is an ongoing cost.
 * - Net wealth = portfolioValue - loanBalance.
 */
export function runDebtRecyclingStandalone(
  amount: number,
  etfReturn: number,
  divYield: number,
  mortgageRate: number,
  margTax: number,
  cgtDiscount: number,
  years: number,
): DRStandaloneResult {
  const growthOnlyMonthly = (etfReturn - divYield) / 100 / 12;
  const monthlyDivGross = divYield / 100 / 12;
  const monthlyInterestRate = mortgageRate / 100 / 12;

  let portfolioValue = amount;
  const loanBalance = amount; // IO — stays constant
  let totalInterestPaid = 0;
  let totalTaxDeductions = 0;
  let totalDividendsTaxPaid = 0;
  const costBase = amount;
  const yearly: DRStandaloneResult['yearly'] = [];

  for (let m = 1; m <= years * 12; m++) {
    const growth = portfolioValue * growthOnlyMonthly;
    const divGross = portfolioValue * monthlyDivGross;
    const divTax = divGross * margTax;
    const divNet = divGross - divTax;
    portfolioValue += growth + divNet;
    totalDividendsTaxPaid += divTax;

    const interest = loanBalance * monthlyInterestRate;
    const deduction = interest * margTax;
    totalInterestPaid += interest;
    totalTaxDeductions += deduction;

    if (m % 12 === 0) {
      const unrealisedGain = portfolioValue - costBase;
      const cgt =
        unrealisedGain > 0 ? unrealisedGain * (1 - cgtDiscount) * margTax : 0;
      const netInterestSoFar = totalInterestPaid - totalTaxDeductions;
      yearly.push({
        year: m / 12,
        portfolioValue: Math.round(portfolioValue),
        totalInterestPaid: Math.round(totalInterestPaid),
        totalTaxDeductions: Math.round(totalTaxDeductions),
        netInterestCost: Math.round(netInterestSoFar),
        netWealth: Math.round(portfolioValue - cgt - loanBalance),
      });
    }
  }

  const unrealisedGain = portfolioValue - costBase;
  const cgtIfSold =
    unrealisedGain > 0 ? unrealisedGain * (1 - cgtDiscount) * margTax : 0;

  return {
    finalValue: Math.round(portfolioValue),
    totalInterestPaid: Math.round(totalInterestPaid),
    totalTaxDeductions: Math.round(totalTaxDeductions),
    netInterestCost: Math.round(totalInterestPaid - totalTaxDeductions),
    cgtIfSold: Math.round(cgtIfSold),
    netWealthAfterCGT: Math.round(portfolioValue - cgtIfSold - loanBalance),
    yearly,
  };
}

/**
 * Breakeven ETF return for DR to match direct investing.
 * DR after-tax borrowing cost = mortgageRate × (1 − marginalTaxRate).
 *
 * @param mortgageRate - Annual borrowing rate as %
 * @param margTaxPct - Marginal tax rate as PERCENTAGE (e.g. 47)
 */
export function findBreakevenReturn(
  mortgageRate: number,
  margTaxPct: number,
): number {
  return mortgageRate * (1 - margTaxPct / 100);
}
