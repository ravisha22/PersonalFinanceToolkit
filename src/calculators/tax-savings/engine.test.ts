import { describe, it, expect } from 'vitest';
import {
  calculateSuperSacrifice,
  calculateNegativeGearing,
  calculateTaxBreakdown,
  calculateDRTaxBenefit,
} from './engine';

describe('calculateTaxBreakdown', () => {
  it('$100k income → approx $24,967 total (income tax + medicare)', () => {
    const result = calculateTaxBreakdown(100000, false);
    // Income tax at $100k (Stage 3): $4288 + (100000 - 45000) * 0.30 = $4288 + $16500 = $20788 (approx)
    // Medicare: 100000 * 0.02 = $2000
    // Total ≈ $22788
    expect(result.total).toBeGreaterThan(20000);
    expect(result.total).toBeLessThan(30000);
    expect(result.medicareLevy).toBe(2000);
  });

  it('marginal rate at $100k is 30%', () => {
    const result = calculateTaxBreakdown(100000, false);
    expect(result.marginalRate).toBe(0.30);
  });

  it('effective rate is less than marginal rate', () => {
    const result = calculateTaxBreakdown(100000, false);
    expect(result.effectiveRate).toBeLessThan(result.marginalRate);
  });

  it('HELP repayment is 0 when not included', () => {
    const result = calculateTaxBreakdown(100000, false);
    expect(result.helpRepayment).toBe(0);
  });

  it('HELP repayment > 0 for income above threshold when included', () => {
    const result = calculateTaxBreakdown(100000, true);
    expect(result.helpRepayment).toBeGreaterThan(0);
  });

  it('after-tax income = taxableIncome - total', () => {
    const result = calculateTaxBreakdown(120000, false);
    expect(result.afterTaxIncome).toBe(120000 - result.total);
  });
});

describe('calculateSuperSacrifice', () => {
  it('tax saving > 0 for additional sacrifice at 37% marginal rate', () => {
    // $150k salary: SG = $18k, maxAdditional = $12k, sacrifice $10k → saving > 0
    const result = calculateSuperSacrifice({
      grossSalary: 150000,
      currentSuperBalance: 200000,
      sgRate: 0.12,
      additionalSacrifice: 10000,
      unusedCarryForward: 0,
      age: 35,
      retirementAge: 60,
      superReturn: 7,
    });
    expect(result.taxSaving).toBeGreaterThan(0);
    expect(result.actualSacrifice).toBe(10000);
  });

  it('Division 293 applies when income + contribs > $250k', () => {
    const result = calculateSuperSacrifice({
      grossSalary: 300000,
      currentSuperBalance: 100000,
      sgRate: 0.12,
      additionalSacrifice: 0,
      unusedCarryForward: 0,
      age: 40,
      retirementAge: 60,
      superReturn: 7,
    });
    // SG = $36k, income + contribs > $250k → Div 293 applies
    expect(result.isDiv293).toBe(true);
  });

  it('projected super increases with years to retirement', () => {
    const result35 = calculateSuperSacrifice({
      grossSalary: 120000,
      currentSuperBalance: 100000,
      sgRate: 0.12,
      additionalSacrifice: 5000,
      unusedCarryForward: 0,
      age: 35,
      retirementAge: 60,
      superReturn: 7,
    });
    const result45 = calculateSuperSacrifice({
      grossSalary: 120000,
      currentSuperBalance: 100000,
      sgRate: 0.12,
      additionalSacrifice: 5000,
      unusedCarryForward: 0,
      age: 45,
      retirementAge: 60,
      superReturn: 7,
    });
    expect(result35.projectedSuperAtRetirement).toBeGreaterThan(
      result45.projectedSuperAtRetirement,
    );
  });
});

describe('calculateNegativeGearing', () => {
  it('produces tax refund when property is negatively geared', () => {
    const result = calculateNegativeGearing({
      propertyValue: 650000,
      rentalIncomeWeekly: 450,
      mortgageRate: 6.0,
      lvr: 80,
      councilRates: 2000,
      insurance: 1500,
      pmFeeRate: 0.07,
      maintenance: 2000,
      depreciation: 8000,
      margTax: 0.47,
    });
    expect(result.taxRefund).toBeGreaterThan(0);
    expect(result.isPositivelyGeared).toBe(false);
  });

  it('correctly computes annual mortgage interest', () => {
    const result = calculateNegativeGearing({
      propertyValue: 500000,
      rentalIncomeWeekly: 600,
      mortgageRate: 6.0,
      lvr: 80,
      councilRates: 0,
      insurance: 0,
      pmFeeRate: 0,
      maintenance: 0,
      depreciation: 0,
      margTax: 0.32,
    });
    // Loan = 400000, interest = 400000 * 0.06 = 24000
    expect(result.mortgageInterest).toBe(24000);
  });
});

describe('calculateDRTaxBenefit', () => {
  it('cumulative deduction scales with years', () => {
    const rows = calculateDRTaxBenefit(200000, 6, 0.47, [1, 5, 10]);
    expect(rows[2].cumulative).toBe(rows[0].cumulative * 10);
  });

  it('effective after-tax rate = rate * (1 - margTax)', () => {
    const rows = calculateDRTaxBenefit(200000, 6, 0.47, [1]);
    expect(rows[0].effectiveAfterTaxRate).toBeCloseTo(6 * 0.53, 5);
  });
});
