/**
 * Tax Savings Guide — Financial Engine
 * Covers: Super Salary Sacrifice, DR Tax Benefit, Negative Gearing, Tax Breakdown.
 * Pure functions, no React, no side effects.
 * Based on 2024-25 ATO rates.
 */

import { SUPER_RULES, isDivision293 } from '../../data/super-rules';
import {
  calcIncomeTax,
  calcMedicareLevy,
  getMarginalRate,
} from '../../data/tax-brackets';
import { calcHELPRepayment } from '../../data/constants';
import { projectGrowth } from '../../utils/financial';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SuperSacrificeParams {
  grossSalary: number;
  currentSuperBalance: number;
  sgRate: number;          // decimal, e.g. 0.12
  additionalSacrifice: number;
  unusedCarryForward: number;
  age: number;
  retirementAge: number;
  superReturn: number;     // percentage, e.g. 7
}

export interface SuperSacrificeResult {
  employerSG: number;
  maxAdditionalAvailable: number;
  actualSacrifice: number;
  taxInSuper: number;
  taxSaving: number;
  isDiv293: boolean;
  div293Tax: number;
  projectedSuperAtRetirement: number;
  yearsToRetirement: number;
  incomeTaxWithSacrifice: number;
  incomeTaxWithoutSacrifice: number;
}

export interface NegGearingParams {
  propertyValue: number;
  rentalIncomeWeekly: number;
  mortgageRate: number;    // percentage
  lvr: number;             // percentage, e.g. 80
  councilRates: number;    // annual
  insurance: number;       // annual
  pmFeeRate: number;       // decimal, e.g. 0.07
  maintenance: number;     // annual
  depreciation: number;    // annual
  margTax: number;         // decimal
}

export interface NegGearingResult {
  rentalIncomeAnnual: number;
  mortgageInterest: number;
  totalExpenses: number;
  taxableLoss: number;
  taxRefund: number;
  netCashPosition: number;
  isPositivelyGeared: boolean;
}

export interface TaxBreakdown {
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  helpRepayment: number;
  total: number;
  afterTaxIncome: number;
  effectiveRate: number;
  marginalRate: number;
}

// ─── Super Salary Sacrifice ────────────────────────────────────────────────────

/**
 * Calculate tax savings and projected balance from additional salary sacrifice.
 *
 * @param params - SuperSacrificeParams
 * @returns SuperSacrificeResult
 *
 * Key rules:
 * - Concessional cap = $30,000 (2024-25); includes employer SG
 * - Carry-forward allows using unused cap from prior 5 years (only if total super < $500k)
 * - Division 293: extra 15% on concessional contributions if income + contribs > $250k
 */
export function calculateSuperSacrifice(
  params: SuperSacrificeParams,
): SuperSacrificeResult {
  const {
    grossSalary,
    currentSuperBalance,
    sgRate,
    additionalSacrifice,
    unusedCarryForward,
    age,
    retirementAge,
    superReturn,
  } = params;

  const employerSG = grossSalary * sgRate;

  // Effective concessional cap (base + carry-forward if eligible)
  const canUseCarryForward =
    currentSuperBalance < SUPER_RULES.carryForwardBalanceThreshold;
  const effectiveCap =
    SUPER_RULES.concessionalCap +
    (canUseCarryForward ? Math.min(unusedCarryForward, 150000) : 0);
  const maxAdditional = Math.max(0, effectiveCap - employerSG);
  const actualSacrifice = Math.min(additionalSacrifice, maxAdditional);

  // Tax in super on concessional contributions (15% standard)
  const taxInSuper = actualSacrifice * SUPER_RULES.taxRateInSuper;

  // Division 293 check
  const taxableIncome = grossSalary - actualSacrifice;
  const div293Applies = isDivision293(taxableIncome, employerSG + actualSacrifice);
  const div293Tax = div293Applies ? actualSacrifice * SUPER_RULES.division293Rate : 0;

  // Tax saving = marginal rate on sacrifice minus 15% super tax
  const marginalRate = getMarginalRate(grossSalary);
  const taxSaving = Math.max(
    0,
    actualSacrifice * marginalRate - taxInSuper - div293Tax,
  );

  // Income tax comparison
  const incomeTaxWithSacrifice =
    calcIncomeTax(taxableIncome) + calcMedicareLevy(taxableIncome);
  const incomeTaxWithoutSacrifice =
    calcIncomeTax(grossSalary) + calcMedicareLevy(grossSalary);

  // Projected super balance at retirement
  const yearsToRetirement = Math.max(0, retirementAge - age);
  const annualContribs = employerSG + actualSacrifice - taxInSuper - div293Tax;
  const projArray = projectGrowth(
    currentSuperBalance,
    annualContribs,
    superReturn,
    yearsToRetirement,
  );
  const projectedSuperAtRetirement =
    projArray[projArray.length - 1] ?? currentSuperBalance;

  return {
    employerSG: Math.round(employerSG),
    maxAdditionalAvailable: Math.round(maxAdditional),
    actualSacrifice: Math.round(actualSacrifice),
    taxInSuper: Math.round(taxInSuper),
    taxSaving: Math.round(taxSaving),
    isDiv293: div293Applies,
    div293Tax: Math.round(div293Tax),
    projectedSuperAtRetirement: Math.round(projectedSuperAtRetirement),
    yearsToRetirement,
    incomeTaxWithSacrifice: Math.round(incomeTaxWithSacrifice),
    incomeTaxWithoutSacrifice: Math.round(incomeTaxWithoutSacrifice),
  };
}

// ─── Negative Gearing ─────────────────────────────────────────────────────────

/**
 * Calculate cash position for a negatively geared investment property.
 */
export function calculateNegativeGearing(
  params: NegGearingParams,
): NegGearingResult {
  const {
    propertyValue,
    rentalIncomeWeekly,
    mortgageRate,
    lvr,
    councilRates,
    insurance,
    pmFeeRate,
    maintenance,
    depreciation,
    margTax,
  } = params;

  const rentalIncomeAnnual = rentalIncomeWeekly * 52;
  const loanAmount = propertyValue * (lvr / 100);
  const mortgageInterest = loanAmount * (mortgageRate / 100);
  const pmFees = rentalIncomeAnnual * pmFeeRate;
  const totalExpenses =
    mortgageInterest + councilRates + insurance + pmFees + maintenance + depreciation;

  const taxableLoss = rentalIncomeAnnual - totalExpenses; // negative = loss
  const taxRefund =
    taxableLoss < 0 ? Math.abs(taxableLoss) * margTax : 0;
  const netCashPosition =
    rentalIncomeAnnual - mortgageInterest - councilRates - insurance - pmFees - maintenance + taxRefund;

  return {
    rentalIncomeAnnual: Math.round(rentalIncomeAnnual),
    mortgageInterest: Math.round(mortgageInterest),
    totalExpenses: Math.round(totalExpenses),
    taxableLoss: Math.round(taxableLoss),
    taxRefund: Math.round(taxRefund),
    netCashPosition: Math.round(netCashPosition),
    isPositivelyGeared: taxableLoss >= 0,
  };
}

// ─── Tax Breakdown ─────────────────────────────────────────────────────────────

/**
 * Calculate full tax breakdown for a taxable income.
 *
 * @param taxableIncome - Annual taxable income in AUD
 * @param includeHELP - Whether to include HELP/HECS repayment
 */
export function calculateTaxBreakdown(
  taxableIncome: number,
  includeHELP: boolean,
): TaxBreakdown {
  const incomeTax = calcIncomeTax(taxableIncome);
  const medicareLevy = calcMedicareLevy(taxableIncome);
  const helpRepayment = includeHELP ? calcHELPRepayment(taxableIncome) : 0;
  const total = incomeTax + medicareLevy + helpRepayment;
  const afterTaxIncome = taxableIncome - total;
  const effectiveRate = taxableIncome > 0 ? total / taxableIncome : 0;
  const marginalRate = getMarginalRate(taxableIncome);

  return {
    taxableIncome,
    incomeTax: Math.round(incomeTax),
    medicareLevy: Math.round(medicareLevy),
    helpRepayment: Math.round(helpRepayment),
    total: Math.round(total),
    afterTaxIncome: Math.round(afterTaxIncome),
    effectiveRate,
    marginalRate,
  };
}

// ─── DR Tax Benefit ────────────────────────────────────────────────────────────

export interface DRTaxBenefitRow {
  year: number;
  annualDeduction: number;
  cumulative: number;
  effectiveAfterTaxRate: number;
}

/**
 * Calculate annual DR tax deductions over a number of years.
 *
 * @param investLoanBal - Investment loan balance
 * @param rate - Annual interest rate as %
 * @param margTax - Marginal tax rate as decimal
 * @param yearsArray - Array of years to show (e.g. [1, 5, 10, 15])
 */
export function calculateDRTaxBenefit(
  investLoanBal: number,
  rate: number,
  margTax: number,
  yearsArray: number[],
): DRTaxBenefitRow[] {
  const annualInterest = investLoanBal * (rate / 100);
  const annualDeduction = annualInterest * margTax;
  const effectiveAfterTaxRate = rate * (1 - margTax);

  return yearsArray.map(year => ({
    year,
    annualDeduction: Math.round(annualDeduction),
    cumulative: Math.round(annualDeduction * year),
    effectiveAfterTaxRate,
  }));
}
