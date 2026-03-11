import { describe, it, expect } from 'vitest';
import {
  calculateFIRENumber,
  coastFIRENumber,
  yearsToFIRE,
  calculateSuperBridge,
  leanVsFatTable,
} from './engine';

describe('calculateFIRENumber', () => {
  it('$80k expenses at 4% → $2,000,000', () => {
    expect(calculateFIRENumber(80000, 0.04)).toBe(2000000);
  });

  it('returns Infinity for 0% withdrawal rate', () => {
    expect(calculateFIRENumber(80000, 0)).toBe(Infinity);
  });
});

describe('coastFIRENumber', () => {
  it('$2M target, 7% return, 25 years → approx $369k', () => {
    const result = coastFIRENumber(2000000, 7, 25);
    expect(result).toBeGreaterThan(350000);
    expect(result).toBeLessThan(400000);
  });

  it('0 years to retirement → returns targetAmount', () => {
    expect(coastFIRENumber(2000000, 7, 0)).toBe(2000000);
  });
});

describe('yearsToFIRE', () => {
  it('$500k current, $50k savings, $2M target, 7% return → reasonable value', () => {
    const years = yearsToFIRE(500000, 50000, 2000000, 7);
    expect(years).toBeGreaterThan(0);
    expect(years).toBeLessThan(25);
  });

  it('already at target → 0 years', () => {
    expect(yearsToFIRE(2000000, 50000, 2000000, 7)).toBe(0);
  });
});

describe('leanVsFatTable', () => {
  it('generates a row per expense level', () => {
    const rows = leanVsFatTable(200000, 50000, 7, 0.04, [40000, 60000, 80000]);
    expect(rows).toHaveLength(3);
  });

  it('higher expenses → higher FIRE number and more years', () => {
    const rows = leanVsFatTable(200000, 50000, 7, 0.04, [40000, 80000]);
    expect(rows[1].fireNumber).toBeGreaterThan(rows[0].fireNumber);
    expect(rows[1].yearsToFIRE).toBeGreaterThanOrEqual(rows[0].yearsToFIRE);
  });
});

describe('calculateSuperBridge', () => {
  it('generates yearly rows from currentAge to 90', () => {
    const result = calculateSuperBridge({
      currentAge: 35,
      earlyRetirementAge: 50,
      preservationAge: 60,
      nonSuperBalance: 200000,
      superBalance: 200000,
      annualSavingsNonSuper: 40000,
      annualSuperContribs: 30000,
      annualExpenses: 80000,
      nonSuperReturn: 7,
      superReturn: 7,
    });
    expect(result.yearly.length).toBe(90 - 35 + 1);
  });

  it('non-super runs out before 60 when balance is very low', () => {
    const result = calculateSuperBridge({
      currentAge: 50,
      earlyRetirementAge: 50,
      preservationAge: 60,
      nonSuperBalance: 100000,  // only 100k to last 10 years at 80k/pa
      superBalance: 500000,
      annualSavingsNonSuper: 0,
      annualSuperContribs: 0,
      annualExpenses: 80000,
      nonSuperReturn: 7,
      superReturn: 7,
    });
    expect(result.nonSuperSufficientToBridge).toBe(false);
  });
});
