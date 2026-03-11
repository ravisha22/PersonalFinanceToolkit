/**
 * House Affordability — Financial Engine
 * Uses APRA serviceability methodology.
 * All monetary inputs/outputs in AUD.
 */

import {
  calculateStampDuty,
  type AustralianState,
  type StampDutyResult,
} from '../../data/stamp-duty-tables';
import {
  maxBorrowingCapacity,
  monthlyRepayment,
  estimateLMI,
} from '../../utils/financial';
import { PROPERTY_HOLDING_COST_DEFAULTS } from '../../data/constants';

export type { AustralianState };

export interface HouseParams {
  grossIncome: number;
  partnerIncome: number;
  existingMonthlyDebts: number;  // other monthly commitments (repayments)
  deposit: number;
  propertyPrice: number;
  state: AustralianState;
  firstHomeBuyer: boolean;
  isNewHome: boolean;
  rate: number;       // annual rate %
  loanTerm: number;   // years
}

export interface StressTestRow {
  rateIncrease: number;  // 0, 1, 2, 3
  totalRate: number;
  monthlyRepayment: number;
  monthlyChange: number;
  annualCost: number;
}

export interface MonthlyCostBreakdown {
  principalAndInterest: number;
  councilRates: number;
  water: number;
  insurance: number;
  maintenance: number;
  strata: number;
  total: number;
}

export interface AffordabilityResult {
  loanAmount: number;
  lvr: number;
  borrowingCapacity: number;
  affordableWithDeposit: boolean;
  stampDuty: StampDutyResult;
  lmi: number;
  totalUpfrontCost: number;
  monthlyRepayment: number;
  affordabilityRatio: number;   // annual P&I / combined income
  monthlyCostBreakdown: MonthlyCostBreakdown;
  stressTest: StressTestRow[];
}

/**
 * Calculate comprehensive house affordability metrics.
 */
export function calculateAffordability(params: HouseParams): AffordabilityResult {
  const {
    grossIncome,
    partnerIncome,
    existingMonthlyDebts,
    deposit,
    propertyPrice,
    state,
    firstHomeBuyer,
    isNewHome,
    rate,
    loanTerm,
  } = params;

  const combinedIncome = grossIncome + partnerIncome;
  const loanAmount = Math.max(0, propertyPrice - deposit);
  const lvr = propertyPrice > 0 ? (loanAmount / propertyPrice) * 100 : 0;

  // APRA borrowing capacity (3% buffer)
  const rawCapacity = maxBorrowingCapacity(combinedIncome, rate, loanTerm);
  // Reduce by capitalised existing monthly debts
  const existingDebtReduction = existingMonthlyDebts > 0
    ? (existingMonthlyDebts * (Math.pow(1 + (rate + 3) / 100 / 12, loanTerm * 12) - 1)) / ((rate + 3) / 100 / 12 * Math.pow(1 + (rate + 3) / 100 / 12, loanTerm * 12))
    : 0;
  const borrowingCapacity = Math.max(0, rawCapacity - existingDebtReduction);

  // Stamp duty + FHOG
  const stampDuty = calculateStampDuty(propertyPrice, state, firstHomeBuyer, isNewHome);

  // LMI
  const lmi = estimateLMI(loanAmount, propertyPrice);

  const totalUpfrontCost = deposit + stampDuty.dutyPayable + lmi;

  // Monthly P&I repayment
  const mPmt = monthlyRepayment(loanAmount, rate, loanTerm);

  // Affordability ratio (annual mortgage / combined income)
  const affordabilityRatio = combinedIncome > 0 ? (mPmt * 12) / combinedIncome : 0;

  // Monthly cost breakdown
  const defaults = PROPERTY_HOLDING_COST_DEFAULTS;
  const maintenance = propertyPrice * defaults.maintenanceRate / 12;
  const councilMonthly = defaults.councilRatesAnnual / 12;
  const waterMonthly = defaults.waterRatesAnnual / 12;
  const insuranceMonthly = defaults.insuranceAnnual / 12;
  const strataMonthly = defaults.strataAnnual / 12;
  const monthlyCostBreakdown: MonthlyCostBreakdown = {
    principalAndInterest: Math.round(mPmt),
    councilRates: Math.round(councilMonthly),
    water: Math.round(waterMonthly),
    insurance: Math.round(insuranceMonthly),
    maintenance: Math.round(maintenance),
    strata: Math.round(strataMonthly),
    total: Math.round(mPmt + councilMonthly + waterMonthly + insuranceMonthly + maintenance + strataMonthly),
  };

  // Stress test: rate +0%, +1%, +2%, +3%
  const baseMonthly = mPmt;
  const stressTest: StressTestRow[] = [0, 1, 2, 3].map(inc => {
    const stressedRate = rate + inc;
    const stressedPmt = monthlyRepayment(loanAmount, stressedRate, loanTerm);
    return {
      rateIncrease: inc,
      totalRate: stressedRate,
      monthlyRepayment: Math.round(stressedPmt),
      monthlyChange: Math.round(stressedPmt - baseMonthly),
      annualCost: Math.round(stressedPmt * 12),
    };
  });

  return {
    loanAmount: Math.round(loanAmount),
    lvr: Math.round(lvr * 10) / 10,
    borrowingCapacity: Math.round(borrowingCapacity),
    affordableWithDeposit: loanAmount <= borrowingCapacity,
    stampDuty,
    lmi: Math.round(lmi),
    totalUpfrontCost: Math.round(totalUpfrontCost),
    monthlyRepayment: Math.round(mPmt),
    affordabilityRatio,
    monthlyCostBreakdown,
    stressTest,
  };
}
