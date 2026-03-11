import { describe, it, expect } from 'vitest';
import { runDirectInvest, runDebtRecyclingStandalone, findBreakevenReturn } from './engine';

describe('findBreakevenReturn', () => {
  it('returns correct breakeven for 6% mortgage at 47% tax', () => {
    // 6 * (1 - 0.47) = 3.18
    expect(findBreakevenReturn(6, 47)).toBeCloseTo(3.18, 1);
  });

  it('returns full rate at 0% tax', () => {
    expect(findBreakevenReturn(6, 0)).toBe(6);
  });
});

describe('runDirectInvest', () => {
  it('final value > initial investment with positive return', () => {
    const result = runDirectInvest(100000, 8, 3, 0.32, 0.5, 10);
    expect(result.finalValue).toBeGreaterThan(100000);
  });

  it('generates yearly array of correct length', () => {
    const result = runDirectInvest(100000, 8, 3, 0.32, 0.5, 10);
    expect(result.yearly.length).toBe(10);
  });

  it('no CGT when portfolio value stays at cost base (0% return)', () => {
    const result = runDirectInvest(100000, 0, 0, 0.32, 0.5, 5);
    expect(result.cgtIfSold).toBe(0);
  });

  it('net wealth after CGT is less than final value when gain > 0', () => {
    const result = runDirectInvest(100000, 8, 3, 0.32, 0.5, 10);
    expect(result.netWealthAfterCGT).toBeLessThan(result.finalValue);
  });
});

describe('runDebtRecyclingStandalone', () => {
  it('generates yearly array of correct length', () => {
    const result = runDebtRecyclingStandalone(100000, 8, 3, 6, 0.32, 0.5, 10);
    expect(result.yearly.length).toBe(10);
  });

  it('totalInterestPaid > 0', () => {
    const result = runDebtRecyclingStandalone(100000, 8, 3, 6, 0.32, 0.5, 10);
    expect(result.totalInterestPaid).toBeGreaterThan(0);
  });

  it('totalTaxDeductions > 0 when margTax > 0', () => {
    const result = runDebtRecyclingStandalone(100000, 8, 3, 6, 0.32, 0.5, 10);
    expect(result.totalTaxDeductions).toBeGreaterThan(0);
  });

  it('DR net interest cost is less than gross interest (tax deductions reduce cost)', () => {
    // Breakeven = 6 * (1 - 0.32) = 4.08%
    // The value of DR is that the effective borrowing cost is reduced by the tax deduction
    const dr = runDebtRecyclingStandalone(100000, 10, 3, 6, 0.32, 0.5, 20);
    // Net interest cost must be less than gross interest paid
    expect(dr.netInterestCost).toBeLessThan(dr.totalInterestPaid);
    // Specifically, deductions = grossInterest * margTax
    expect(dr.totalTaxDeductions).toBeCloseTo(dr.totalInterestPaid * 0.32, 0);
  });
});
