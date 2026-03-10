/**
 * Australian financial constants for 2024-25.
 * Sources: ATO, ASIC MoneySmart.
 */

// ─── HELP / HECS Repayment Thresholds 2024-25 ────────────────────────────────

export interface HELPThreshold {
  min: number;
  max: number;
  rate: number;
}

export const HELP_REPAYMENT_THRESHOLDS_2024_25: HELPThreshold[] = [
  { min: 0,       max: 54434,   rate: 0 },
  { min: 54435,   max: 62850,   rate: 0.01 },
  { min: 62851,   max: 66620,   rate: 0.02 },
  { min: 66621,   max: 70618,   rate: 0.025 },
  { min: 70619,   max: 74855,   rate: 0.03 },
  { min: 74856,   max: 79346,   rate: 0.035 },
  { min: 79347,   max: 84107,   rate: 0.04 },
  { min: 84108,   max: 89154,   rate: 0.045 },
  { min: 89155,   max: 94503,   rate: 0.05 },
  { min: 94504,   max: 100174,  rate: 0.055 },
  { min: 100175,  max: 106185,  rate: 0.06 },
  { min: 106186,  max: 112556,  rate: 0.065 },
  { min: 112557,  max: 119309,  rate: 0.07 },
  { min: 119310,  max: 126467,  rate: 0.075 },
  { min: 126468,  max: 134056,  rate: 0.08 },
  { min: 134057,  max: 142100,  rate: 0.085 },
  { min: 142101,  max: 150626,  rate: 0.09 },
  { min: 150627,  max: 159663,  rate: 0.095 },
  { min: 159664,  max: Infinity, rate: 0.10 },
];

/**
 * Calculate HELP/HECS repayment for a given repayment income.
 */
export function calcHELPRepayment(repaymentIncome: number): number {
  for (const t of HELP_REPAYMENT_THRESHOLDS_2024_25) {
    if (repaymentIncome <= t.max) {
      return repaymentIncome * t.rate;
    }
  }
  return 0;
}

// ─── CGT Discount Rates ───────────────────────────────────────────────────────

/** 50% CGT discount for individuals — assets held >12 months */
export const CGT_DISCOUNT_INDIVIDUAL = 0.50;

/** 33.33% CGT discount for complying superannuation funds */
export const CGT_DISCOUNT_SUPER = 1 / 3;

/** No CGT discount for companies */
export const CGT_DISCOUNT_COMPANY = 0;

// ─── Lenders Mortgage Insurance (LMI) Estimates ───────────────────────────────
// Approximate premiums (vary by lender; use as indicative only)
export const LMI_ESTIMATES = [
  { minLvr: 0,    maxLvr: 0.80, rate: 0 },
  { minLvr: 0.80, maxLvr: 0.85, rate: 0.006 },
  { minLvr: 0.85, maxLvr: 0.90, rate: 0.013 },
  { minLvr: 0.90, maxLvr: 0.95, rate: 0.025 },
  { minLvr: 0.95, maxLvr: 1.00, rate: 0.040 },
];

// ─── APRA Serviceability Buffer ───────────────────────────────────────────────
export const APRA_SERVICEABILITY_BUFFER = 0.03; // 3% above the loan rate

// ─── Common Property Holding Cost Defaults ───────────────────────────────────
export const PROPERTY_HOLDING_COST_DEFAULTS = {
  councilRatesAnnual: 2000,
  waterRatesAnnual: 1200,
  insuranceAnnual: 1800,
  maintenanceRate: 0.005,     // ~0.5% of property value
  propertyManagementRate: 0.07,
  strataAnnual: 0,            // 0 for house; user sets for unit
};

// ─── Tax Year Label ───────────────────────────────────────────────────────────
export const CURRENT_TAX_YEAR = '2024-25';
