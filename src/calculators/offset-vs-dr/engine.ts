/**
 * Offset vs Debt Recycling — Financial Engine
 * Pure functions, no React, no side effects.
 * All monetary values operate in AUD dollars; cents precision via Math.round.
 *
 * margTax parameters are PERCENTAGES (e.g. 47 for 47%) — divided by 100 internally.
 */

import { monthlyRepayment } from '../../utils/financial';
import type { OffsetResult, DRResult } from './types';

export { monthlyRepayment };

/**
 * Model a P&I home loan with an offset account.
 *
 * @param loan - Loan principal (AUD)
 * @param rate - Annual interest rate as a percentage (e.g. 5.7)
 * @param years - Loan term in years
 * @param offsetAmt - Amount parked in offset account (held constant)
 * @returns OffsetResult with year-by-year data and summary metrics
 *
 * Assumptions:
 * - Monthly compounding, monthly P&I repayments.
 * - Offset balance is constant (no growth, no withdrawals).
 * - Base interest (no offset) calculated separately to derive interestSaved.
 */
export function runOffset(
  loan: number,
  rate: number,
  years: number,
  offsetAmt: number,
): OffsetResult {
  const r = rate / 100 / 12;
  const n = years * 12;
  const payment = monthlyRepayment(loan, rate, years);
  let balance = loan;
  let totalInterest = 0;
  let months = 0;
  const yearly: OffsetResult['yearly'] = [];

  for (let m = 1; m <= n && balance > 0; m++) {
    const effectiveBal = Math.max(0, balance - offsetAmt);
    const interest = effectiveBal * r;
    const principalPaid = Math.min(balance, payment - interest);
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    months = m;
    if (m % 12 === 0 || balance <= 0) {
      yearly.push({
        year: Math.ceil(m / 12),
        balance: Math.round(balance),
        totalInterest: Math.round(totalInterest),
        netWealth: Math.round(offsetAmt - balance),
      });
    }
    if (balance <= 0) break;
  }

  // Calculate base interest (no offset) to compute interestSaved
  let baseBal = loan;
  let baseInterest = 0;
  for (let m = 1; m <= n && baseBal > 0; m++) {
    const int = baseBal * r;
    baseBal = Math.max(0, baseBal - (payment - int));
    baseInterest += int;
  }

  return {
    totalInterest: Math.round(totalInterest),
    interestSaved: Math.round(baseInterest - totalInterest),
    monthsToPayoff: months,
    yearsToPayoff: (months / 12).toFixed(1),
    offsetValue: offsetAmt,
    yearly,
  };
}

/**
 * Model debt recycling: convert home loan equity into a tax-deductible investment loan.
 *
 * @param investLoanType - 'io' (interest-only, default) or 'pi' (principal & interest)
 *
 * Assumptions when IO: investment loan balance stays constant; interest tax-deductible throughout.
 * Assumptions when PI: investment loan amortises over term; deduction decreases as balance falls.
 */
export function runDebtRecycling(
  loan: number,
  rate: number,
  years: number,
  investAmt: number,
  etfReturn: number,
  divYield: number,
  margTaxPct: number,
  cgtDiscount: number,
  investLoanType: 'io' | 'pi' = 'io',
): DRResult {
  const margTax = margTaxPct / 100;
  const cgtDiscountDecimal = cgtDiscount / 100;

  const r = rate / 100 / 12;
  const n = years * 12;
  const payment = monthlyRepayment(loan, rate, years);
  const investPayment = investLoanType === 'pi' ? monthlyRepayment(investAmt, rate, years) : 0;
  const growthOnly = (etfReturn - divYield) / 100 / 12;
  const monthlyDiv = divYield / 100 / 12;

  let homeLoanBal = loan - investAmt;
  let investLoanBal = investAmt;
  let portfolioValue = investAmt;
  let totalHomeLoanInterest = 0;
  let totalInvestLoanInterest = 0;
  let totalTaxDeductions = 0;
  const totalCostBase = investAmt;
  const yearly: DRResult['yearly'] = [];

  for (let m = 1; m <= n; m++) {
    const homeInt = homeLoanBal > 0 ? homeLoanBal * r : 0;
    const investInt = investLoanBal > 0 ? investLoanBal * r : 0;
    const taxDeduction = investInt * margTax;

    const growth = portfolioValue * growthOnly;
    const dividends = portfolioValue * monthlyDiv;
    portfolioValue += growth + dividends;

    if (homeLoanBal > 0) {
      const pp = Math.min(homeLoanBal, payment - homeInt);
      homeLoanBal = Math.max(0, homeLoanBal - pp);
    }

    if (investLoanType === 'pi' && investLoanBal > 0) {
      const investPrincipal = Math.min(investLoanBal, investPayment - investInt);
      investLoanBal = Math.max(0, investLoanBal - investPrincipal);
    }

    totalHomeLoanInterest += homeInt;
    totalInvestLoanInterest += investInt;
    totalTaxDeductions += taxDeduction;

    if (m % 12 === 0) {
      const unrealisedGain = portfolioValue - totalCostBase;
      const cgtIfSold =
        unrealisedGain > 0
          ? unrealisedGain * (1 - cgtDiscountDecimal) * margTax
          : 0;
      yearly.push({
        year: m / 12,
        homeLoanBal: Math.round(homeLoanBal),
        investLoanBal: Math.round(investLoanBal),
        portfolioValue: Math.round(portfolioValue),
        totalInterestPaid: Math.round(
          totalHomeLoanInterest + totalInvestLoanInterest,
        ),
        taxDeductions: Math.round(totalTaxDeductions),
        netWealth: Math.round(portfolioValue - homeLoanBal - investLoanBal),
        netWealthAfterCGT: Math.round(
          portfolioValue - cgtIfSold - homeLoanBal - investLoanBal,
        ),
      });
    }
  }

  const unrealisedGain = portfolioValue - totalCostBase;
  const cgtIfSold =
    unrealisedGain > 0
      ? unrealisedGain * (1 - cgtDiscountDecimal) * margTax
      : 0;

  return {
    totalInterest: Math.round(
      totalHomeLoanInterest + totalInvestLoanInterest,
    ),
    taxDeductions: Math.round(totalTaxDeductions),
    netInterestCost: Math.round(
      totalHomeLoanInterest + totalInvestLoanInterest - totalTaxDeductions,
    ),
    portfolioValue: Math.round(portfolioValue),
    cgtIfSold: Math.round(cgtIfSold),
    netWealthPostCGT: Math.round(
      portfolioValue - cgtIfSold - investLoanBal,
    ),
    yearly,
  };
}
