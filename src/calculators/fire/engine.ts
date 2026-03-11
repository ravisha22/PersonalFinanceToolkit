/**
 * FIRE Calculator Suite — Financial Engine
 * Classic FIRE, Coast FIRE, Barista FIRE, Lean vs Fat, Super Bridge.
 * Pure functions, no React, no side effects.
 */

import { projectGrowth, yearsToTarget } from '../../utils/financial';
import { SUPER_RULES } from '../../data/super-rules';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SuperBridgeParams {
  currentAge: number;
  earlyRetirementAge: number;
  preservationAge: number;     // default 60 (born after 1 July 1964)
  nonSuperBalance: number;
  superBalance: number;
  annualSavingsNonSuper: number;
  annualSuperContribs: number;
  annualExpenses: number;
  nonSuperReturn: number;     // % pa
  superReturn: number;        // % pa
}

export interface SuperBridgeYearRow {
  age: number;
  nonSuperBalance: number;
  superBalance: number;
  phase: 'accumulation' | 'bridge' | 'retirement';
}

export interface SuperBridgeResult {
  nonSuperSufficientToBridge: boolean;
  shortfallAtPreservation: number;
  yearly: SuperBridgeYearRow[];
  ageNonSuperRunsOut: number | null;
}

export interface LeanFatRow {
  expenses: number;
  fireNumber: number;
  yearsToFIRE: number;
}

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * FIRE number = annual expenses / withdrawal rate.
 */
export function calculateFIRENumber(
  annualExpenses: number,
  withdrawalRate: number,
): number {
  if (withdrawalRate <= 0) return Infinity;
  return annualExpenses / withdrawalRate;
}

/**
 * Years required to reach the FIRE number from current investments.
 */
export function yearsToFIRE(
  currentInvestments: number,
  annualSavings: number,
  targetAmount: number,
  returnRate: number,
): number {
  return yearsToTarget(currentInvestments, annualSavings, targetAmount, returnRate);
}

/**
 * Project annual savings trajectory (array of balances, one per year).
 */
export function projectSavings(
  current: number,
  annualAddition: number,
  returnRate: number,
  years: number,
): number[] {
  return projectGrowth(current, annualAddition, returnRate, years);
}

/**
 * Coast FIRE number — amount needed today such that compound growth alone reaches target.
 *
 * @param targetAmount - FIRE number (total needed at retirement)
 * @param returnRate - Annual return as % (e.g. 7)
 * @param yearsToRetirement - Years until retirement
 */
export function coastFIRENumber(
  targetAmount: number,
  returnRate: number,
  yearsToRetirement: number,
): number {
  if (yearsToRetirement <= 0) return targetAmount;
  return targetAmount / Math.pow(1 + returnRate / 100, yearsToRetirement);
}

/**
 * Build a lean vs fat FIRE comparison table.
 */
export function leanVsFatTable(
  currentInvestments: number,
  annualSavings: number,
  returnRate: number,
  withdrawalRate: number,
  expenseLevels: number[],
): LeanFatRow[] {
  return expenseLevels.map(expenses => {
    const fireNumber = calculateFIRENumber(expenses, withdrawalRate);
    const years = yearsToFIRE(currentInvestments, annualSavings, fireNumber, returnRate);
    return {
      expenses,
      fireNumber: Math.round(fireNumber),
      yearsToFIRE: years,
    };
  });
}

/**
 * Calculate Australian Super Bridge strategy.
 *
 * Phase 1: currentAge → earlyRetirementAge (accumulation)
 * Phase 2: earlyRetirementAge → preservationAge (draw from non-super; super grows untouched)
 * Phase 3: preservationAge → 90 (draw from super first, then non-super)
 */
export function calculateSuperBridge(
  params: SuperBridgeParams,
): SuperBridgeResult {
  const {
    currentAge,
    earlyRetirementAge,
    preservationAge,
    nonSuperBalance,
    superBalance,
    annualSavingsNonSuper,
    annualSuperContribs,
    annualExpenses,
    nonSuperReturn,
    superReturn,
  } = params;

  const nonSuperR = nonSuperReturn / 100;
  const superR = superReturn / 100;
  const yearly: SuperBridgeYearRow[] = [];

  let ns = nonSuperBalance;
  let sup = superBalance;
  let ageNonSuperRunsOut: number | null = null;

  for (let age = currentAge; age <= 90; age++) {
    let phase: SuperBridgeYearRow['phase'];

    if (age < earlyRetirementAge) {
      // Accumulation: both grow, save into both
      phase = 'accumulation';
      ns = ns * (1 + nonSuperR) + annualSavingsNonSuper;
      sup = sup * (1 + superR) + annualSuperContribs;
    } else if (age < preservationAge) {
      // Bridge: draw from non-super, super grows untouched
      phase = 'bridge';
      ns = ns * (1 + nonSuperR) - annualExpenses;
      sup = sup * (1 + superR);
      if (ns < 0 && ageNonSuperRunsOut === null) {
        ageNonSuperRunsOut = age;
      }
      ns = Math.max(0, ns);
    } else {
      // Retirement: draw from super (then non-super if super runs out)
      phase = 'retirement';
      sup = sup * (1 + superR);
      if (sup >= annualExpenses) {
        sup -= annualExpenses;
      } else {
        const remaining = annualExpenses - sup;
        sup = 0;
        ns = ns * (1 + nonSuperR) - remaining;
        if (ns < 0 && ageNonSuperRunsOut === null) {
          ageNonSuperRunsOut = age;
        }
        ns = Math.max(0, ns);
      }
    }

    yearly.push({
      age,
      nonSuperBalance: Math.round(ns),
      superBalance: Math.round(Math.max(0, sup)),
      phase,
    });
  }

  // Check non-super at preservation age
  const atPreservation = yearly.find(r => r.age === preservationAge);
  const nonSuperAtPreservation = atPreservation?.nonSuperBalance ?? 0;

  return {
    nonSuperSufficientToBridge: ageNonSuperRunsOut === null || ageNonSuperRunsOut >= preservationAge,
    shortfallAtPreservation: Math.max(0, -nonSuperAtPreservation),
    yearly,
    ageNonSuperRunsOut,
  };
}

/**
 * Re-export preservation age from super rules for use in UI.
 */
export const PRESERVATION_AGE = SUPER_RULES.preservationAge;
