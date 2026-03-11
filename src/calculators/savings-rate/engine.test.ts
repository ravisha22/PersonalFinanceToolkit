import { describe, it, expect } from 'vitest';
import { yearsToFIREFromNW, yearsToFIREBySavingsRate, projectBySavingsRate } from './engine';

describe('yearsToFIREFromNW', () => {
  it('returns 0 when already at FIRE number', () => {
    expect(yearsToFIREFromNW(2000000, 50000, 2000000, 7)).toBe(0);
  });

  it('returns 0 when net worth exceeds FIRE number', () => {
    expect(yearsToFIREFromNW(3000000, 50000, 2000000, 7)).toBe(0);
  });

  it('higher savings rate reduces years to FIRE', () => {
    const lowSavings = yearsToFIREFromNW(0, 20000, 500000, 7);
    const highSavings = yearsToFIREFromNW(0, 80000, 500000, 7);
    expect(highSavings).toBeLessThan(lowSavings);
  });

  it('higher return rate reduces years to FIRE', () => {
    const lowReturn = yearsToFIREFromNW(0, 50000, 1000000, 4);
    const highReturn = yearsToFIREFromNW(0, 50000, 1000000, 10);
    expect(highReturn).toBeLessThan(lowReturn);
  });

  it('caps at 100 for zero savings and zero return', () => {
    expect(yearsToFIREFromNW(0, 0, 1000000, 0)).toBe(100);
  });

  it('starting net worth accelerates timeline', () => {
    const fromZero = yearsToFIREFromNW(0, 50000, 1000000, 7);
    const fromHalf = yearsToFIREFromNW(500000, 50000, 1000000, 7);
    expect(fromHalf).toBeLessThan(fromZero);
  });
});

describe('yearsToFIREBySavingsRate', () => {
  it('returns 17 rows (10% to 90% in 5% steps)', () => {
    const result = yearsToFIREBySavingsRate(150000, 200000, 7, 30);
    expect(result.rows).toHaveLength(17);
  });

  it('higher savings rate rows always have fewer years', () => {
    const result = yearsToFIREBySavingsRate(150000, 0, 7, 30);
    const { rows } = result;
    // Each successive step should have equal or fewer years
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].years).toBeLessThanOrEqual(rows[i - 1].years);
    }
  });

  it('currentRow matches the nearest 5%-step to currentSavingsRate', () => {
    const result = yearsToFIREBySavingsRate(150000, 200000, 7, 30);
    expect(Math.round(result.currentRow.rate * 100)).toBe(30);
  });

  it('currentRow clamps to 10% minimum', () => {
    const result = yearsToFIREBySavingsRate(150000, 200000, 7, 5);
    expect(Math.round(result.currentRow.rate * 100)).toBe(10);
  });

  it('50% savings rate on $150k should reach FIRE in under 25 years from $0', () => {
    const result = yearsToFIREBySavingsRate(150000, 0, 7, 50);
    const row50 = result.rows.find(r => Math.round(r.rate * 100) === 50)!;
    expect(row50.years).toBeLessThan(25);
  });

  it('FIRE number is correctly derived as expenses / 0.04', () => {
    const result = yearsToFIREBySavingsRate(100000, 0, 7, 40);
    // At 40% savings rate: expenses = 100000 * 0.60 = 60000; FIRE = 60000/0.04 = 1,500,000
    const row40 = result.rows.find(r => Math.round(r.rate * 100) === 40)!;
    expect(row40.fireNumber).toBeCloseTo(1500000, -2);
    expect(row40.annualExpenses).toBeCloseTo(60000, 0);
  });
});

describe('projectBySavingsRate', () => {
  it('generates correct number of years', () => {
    const proj = projectBySavingsRate(100000, 0, 30, 7, 20);
    expect(proj).toHaveLength(20);
  });

  it('balance grows each year with positive return and savings', () => {
    const proj = projectBySavingsRate(100000, 0, 30, 7, 10);
    for (let i = 1; i < proj.length; i++) {
      expect(proj[i]).toBeGreaterThan(proj[i - 1]);
    }
  });

  it('50% savings rate grows faster than 10%', () => {
    const proj10 = projectBySavingsRate(100000, 0, 10, 7, 20);
    const proj50 = projectBySavingsRate(100000, 0, 50, 7, 20);
    expect(proj50[19]).toBeGreaterThan(proj10[19]);
  });
});
