/**
 * Australian superannuation rules for 2024-25.
 * Source: ATO — ato.gov.au/individuals-and-families/super-for-individuals-and-families/
 * Note: SG rate increases to 12% on 1 July 2025.
 */

export const SUPER_RULES = {
  /** Superannuation Guarantee rate (12% from 1 July 2025) */
  sgRate: 0.12,

  /** Annual concessional (pre-tax) contribution cap */
  concessionalCap: 30000,

  /** Annual non-concessional (post-tax) contribution cap */
  nonConcessionalCap: 120000,

  /** Non-concessional 3-year bring-forward cap */
  bringForwardCap: 360000,

  /** Tax rate on concessional contributions inside super */
  taxRateInSuper: 0.15,

  /**
   * Division 293 threshold — extra 15% tax on concessional contributions
   * if income + concessional contributions > $250,000
   */
  division293Threshold: 250000,

  /** Division 293 extra tax rate */
  division293Rate: 0.15,

  /** Preservation age for those born after 1 July 1964 */
  preservationAge: 60,

  /** Transfer Balance Cap 2024-25 */
  transferBalanceCap: 1900000,

  /**
   * Unused concessional cap carry-forward:
   * - Can carry forward unused amounts from the previous 5 financial years
   * - Only available if total super balance < $500,000 at 30 June of prior year
   */
  carryForwardYears: 5,
  carryForwardBalanceThreshold: 500000,

  /** Total super balance threshold for non-concessional contributions (bring-forward) */
  totalSuperBalanceNCCThreshold: 1680000, // FY24-25

  /** Minimum drawdown rates by age bracket (for pension phase) */
  minimumDrawdown: [
    { minAge: 55, maxAge: 64, rate: 0.04 },
    { minAge: 65, maxAge: 74, rate: 0.05 },
    { minAge: 75, maxAge: 79, rate: 0.06 },
    { minAge: 80, maxAge: 84, rate: 0.07 },
    { minAge: 85, maxAge: 89, rate: 0.09 },
    { minAge: 90, maxAge: 94, rate: 0.11 },
    { minAge: 95, maxAge: Infinity, rate: 0.14 },
  ],
} as const;

/**
 * Calculate the maximum additional salary sacrifice amount available.
 * @param grossSalary - Annual gross salary
 * @param sgRate - Employer SG rate (decimal)
 * @returns Maximum additional concessional contribution
 */
export function maxAdditionalSacrifice(grossSalary: number, sgRate: number): number {
  const employerSG = grossSalary * sgRate;
  const remaining = SUPER_RULES.concessionalCap - employerSG;
  return Math.max(0, remaining);
}

/**
 * Check if Division 293 tax applies.
 * @param income - Taxable income
 * @param concessionalContribs - Total concessional contributions
 */
export function isDivision293(income: number, concessionalContribs: number): boolean {
  return income + concessionalContribs > SUPER_RULES.division293Threshold;
}
