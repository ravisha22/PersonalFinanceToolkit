/**
 * Australian tax brackets and Medicare levy thresholds for 2024-25.
 * Source: ATO — ato.gov.au/rates/individual-income-tax-rates/
 * Stage 3 tax cuts apply from 1 July 2024.
 */

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  baseTax?: number; // Pre-calculated tax on the lower bound for efficiency
}

export const TAX_BRACKETS_2024_25: TaxBracket[] = [
  { min: 0,      max: 18200,   rate: 0,    baseTax: 0 },
  { min: 18201,  max: 45000,   rate: 0.16, baseTax: 0 },
  { min: 45001,  max: 135000,  rate: 0.30, baseTax: 4288 },
  { min: 135001, max: 190000,  rate: 0.37, baseTax: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, baseTax: 51638 },
];

export const MEDICARE_LEVY_RATE = 0.02;

export const MEDICARE_LEVY_REDUCTION = {
  threshold: 26000,   // Below this, full exemption
  shadeInRate: 0.10,  // Phase-in rate
};

export const MEDICARE_LEVY_SURCHARGE = {
  thresholds: { tier1: 93000, tier2: 108000, tier3: 144000 },
  rates: { tier1: 0.01, tier2: 0.0125, tier3: 0.015 },
};

export const LOW_INCOME_TAX_OFFSET = {
  maxOffset: 700,
  fullOffsetThreshold: 37500,
  phase1End: 45000,
  phase1Rate: 0.05,     // reduces offset by 5c per $1 over $37,500
  phase2End: 66667,
  phase2Rate: 0.015,    // reduces by 1.5c per $1 over $45,000
};

export const LOW_AND_MIDDLE_INCOME_TAX_OFFSET_ENDED = true; // LMITO ended 30 June 2022

/**
 * Calculate total income tax payable (excluding Medicare levy).
 * @param taxableIncome - Annual taxable income in AUD
 */
export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const bracket of TAX_BRACKETS_2024_25) {
    if (taxableIncome <= bracket.max) {
      const taxableInBracket = taxableIncome - bracket.min + 1;
      const baseTax = bracket.baseTax ?? 0;
      return baseTax + taxableInBracket * bracket.rate;
    }
  }
  return 0;
}

/**
 * Calculate Medicare levy.
 */
export function calcMedicareLevy(taxableIncome: number): number {
  if (taxableIncome <= MEDICARE_LEVY_REDUCTION.threshold) return 0;
  return taxableIncome * MEDICARE_LEVY_RATE;
}

/**
 * Calculate marginal tax rate for a given income level.
 */
export function getMarginalRate(taxableIncome: number): number {
  for (const bracket of [...TAX_BRACKETS_2024_25].reverse()) {
    if (taxableIncome > bracket.min) return bracket.rate;
  }
  return 0;
}

/**
 * Calculate effective (average) tax rate including Medicare levy.
 */
export function getEffectiveRate(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const totalTax = calcIncomeTax(taxableIncome) + calcMedicareLevy(taxableIncome);
  return totalTax / taxableIncome;
}
