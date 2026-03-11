import { describe, it, expect } from 'vitest';
import { calculateAffordability } from './engine';
import { calculateStampDuty } from '../../data/stamp-duty-tables';

describe('calculateStampDuty', () => {
  it('VIC FHB at $550k → stamp duty = $0 (full exemption < $600k)', () => {
    const result = calculateStampDuty(550000, 'VIC', true);
    expect(result.dutyPayable).toBe(0);
    expect(result.concessionApplied).toBe(true);
  });

  it('VIC non-FHB at $800k → stamp duty > $30k', () => {
    const result = calculateStampDuty(800000, 'VIC', false);
    expect(result.dutyPayable).toBeGreaterThan(30000);
  });

  it('NSW FHB at $750k → stamp duty = $0 (full exemption < $800k)', () => {
    const result = calculateStampDuty(750000, 'NSW', true);
    expect(result.dutyPayable).toBe(0);
  });
});

describe('calculateAffordability', () => {
  const baseParams = {
    grossIncome: 250000,
    partnerIncome: 0,
    existingMonthlyDebts: 0,
    deposit: 150000,
    propertyPrice: 850000,
    state: 'VIC' as const,
    firstHomeBuyer: false,
    isNewHome: false,
    rate: 5.7,
    loanTerm: 30,
  };

  it('LVR > 90% → LMI > 0', () => {
    const result = calculateAffordability({
      ...baseParams,
      propertyPrice: 500000,
      deposit: 40000, // LVR = 92%
    });
    expect(result.lmi).toBeGreaterThan(0);
  });

  it('LVR <= 80% → LMI = 0', () => {
    const result = calculateAffordability({
      ...baseParams,
      propertyPrice: 500000,
      deposit: 110000, // LVR = 78%
    });
    expect(result.lmi).toBe(0);
  });

  it('borrowing capacity increases with income', () => {
    const low = calculateAffordability({ ...baseParams, grossIncome: 80000 });
    const high = calculateAffordability({ ...baseParams, grossIncome: 200000 });
    expect(high.borrowingCapacity).toBeGreaterThan(low.borrowingCapacity);
  });

  it('stress test generates 4 rows with increasing repayments', () => {
    const result = calculateAffordability(baseParams);
    expect(result.stressTest).toHaveLength(4);
    expect(result.stressTest[1].monthlyRepayment).toBeGreaterThan(
      result.stressTest[0].monthlyRepayment,
    );
  });

  it('monthly cost breakdown total > monthly repayment', () => {
    const result = calculateAffordability(baseParams);
    expect(result.monthlyCostBreakdown.total).toBeGreaterThan(
      result.monthlyCostBreakdown.principalAndInterest,
    );
  });
});
