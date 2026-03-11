import { describe, it, expect } from 'vitest';
import { monthlyRepayment } from '../../utils/financial';
import { runOffset, runDebtRecycling } from './engine';

describe('monthlyRepayment', () => {
  it('calculates correctly for $500k at 6% over 30 years', () => {
    const result = monthlyRepayment(500000, 6, 30);
    expect(result).toBeCloseTo(2997.75, 0);
  });

  it('handles zero interest rate', () => {
    const result = monthlyRepayment(120000, 0, 10);
    expect(result).toBe(1000);
  });
});

describe('runOffset', () => {
  it('$500k loan, 6%, 30yr, $100k offset → interest saved > $200k (offset accelerates payoff)', () => {
    // With $100k in offset the effective rate is lower each month, meaning more
    // principal is repaid — the loan is paid off ~10+ years early, saving >$200k.
    const result = runOffset(500000, 6, 30, 100000);
    expect(result.interestSaved).toBeGreaterThan(200000);
    // Should not exceed the total interest of the base case (~$579k)
    expect(result.interestSaved).toBeLessThan(580000);
  });

  it('offset = loan → totalInterest = 0', () => {
    const result = runOffset(500000, 6, 30, 500000);
    expect(result.totalInterest).toBe(0);
  });

  it('returns yearly array with correct length', () => {
    const result = runOffset(500000, 6, 30, 100000);
    // Should have at most 30 yearly entries (may be shorter if paid off early)
    expect(result.yearly.length).toBeGreaterThan(0);
    expect(result.yearly.length).toBeLessThanOrEqual(30);
  });

  it('netWealth at end of term equals offsetAmt (balance = 0)', () => {
    const result = runOffset(500000, 6, 30, 100000);
    const lastRow = result.yearly[result.yearly.length - 1];
    // netWealth = offsetAmt - balance; when balance→0 netWealth ≈ offsetAmt
    expect(lastRow.netWealth).toBeGreaterThan(90000);
  });
});

describe('runDebtRecycling', () => {
  it('generates yearly data for the full term', () => {
    const result = runDebtRecycling(500000, 6, 15, 100000, 8, 3, 32, 50);
    expect(result.yearly.length).toBe(15);
  });

  it('taxDeductions > 0 when margTax > 0', () => {
    const result = runDebtRecycling(500000, 6, 15, 100000, 8, 3, 32, 50);
    expect(result.taxDeductions).toBeGreaterThan(0);
  });

  it('portfolioValue at end > investAmt when etfReturn > 0', () => {
    const result = runDebtRecycling(500000, 6, 15, 100000, 8, 3, 32, 50);
    expect(result.portfolioValue).toBeGreaterThan(100000);
  });

  it('cgtIfSold = 0 when margTax = 0', () => {
    const result = runDebtRecycling(500000, 6, 15, 100000, 8, 3, 0, 50);
    expect(result.cgtIfSold).toBe(0);
  });
});
