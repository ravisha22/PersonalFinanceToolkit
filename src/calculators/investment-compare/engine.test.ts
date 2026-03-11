import { describe, it, expect } from 'vitest';
import { runScenario, runAllScenarios } from './engine';

const baseParams = {
  label: 'Test',
  initial: 100000,
  monthlyContribution: 1000,
  annualReturn: 8,
  mer: 0.2,
  taxTreatment: 'marginal' as const,
  marginalRate: 0.32,
};

describe('runScenario', () => {
  it('tax-free grows faster than marginal for same return', () => {
    const marginal = runScenario(baseParams, 10);
    const taxFree = runScenario({ ...baseParams, taxTreatment: 'tax-free' }, 10);
    expect(taxFree.finalBalance).toBeGreaterThan(marginal.finalBalance);
  });

  it('higher MER reduces final value', () => {
    const lowMER = runScenario({ ...baseParams, mer: 0.1 }, 10);
    const highMER = runScenario({ ...baseParams, mer: 1.5 }, 10);
    expect(lowMER.finalBalance).toBeGreaterThan(highMER.finalBalance);
  });

  it('generates yearly array of correct length', () => {
    const result = runScenario(baseParams, 15);
    expect(result.yearly.length).toBe(15);
  });

  it('monthly contributions compound — final > initial + contributions', () => {
    const result = runScenario(baseParams, 10);
    const totalContributions = 100000 + 1000 * 12 * 10;
    expect(result.finalBalance).toBeGreaterThan(totalContributions);
  });

  it('super tax (15%) produces balance between marginal and tax-free', () => {
    const marginal = runScenario(baseParams, 10);
    const super_ = runScenario({ ...baseParams, taxTreatment: 'super' }, 10);
    const taxFree = runScenario({ ...baseParams, taxTreatment: 'tax-free' }, 10);
    expect(super_.finalBalance).toBeGreaterThan(marginal.finalBalance);
    expect(super_.finalBalance).toBeLessThan(taxFree.finalBalance);
  });
});

describe('runAllScenarios', () => {
  it('returns one result per scenario', () => {
    const results = runAllScenarios([baseParams, { ...baseParams, label: 'B' }], 5);
    expect(results).toHaveLength(2);
  });

  it('assigns different colors to different scenarios', () => {
    const results = runAllScenarios([
      baseParams,
      { ...baseParams, label: 'B' },
      { ...baseParams, label: 'C' },
    ], 5);
    expect(results[0].color).not.toBe(results[1].color);
  });
});
