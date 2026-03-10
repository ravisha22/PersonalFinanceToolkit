/**
 * Australian stamp duty (transfer duty) tables by state/territory — 2024-25.
 * Sources: state revenue offices.
 * VIC + NSW: full tables. All other states: stubs (to be completed post-v1.0).
 */

export interface DutyBracket {
  min: number;
  max: number;
  rate: number;   // marginal rate above min
  base: number;   // flat duty payable up to min
}

export interface FHBConcession {
  fullExemptionThreshold: number;
  concessionTopThreshold?: number;
  grantAmount?: number;            // FHOG for new homes
  grantPriceCapNew?: number;
}

export interface StampDutyTable {
  general: DutyBracket[];
  firstHomeBuyer: FHBConcession;
  foreignSurchargeRate?: number;   // Additional duty for foreign purchasers
}

// ─── Victoria ────────────────────────────────────────────────────────────────

export const VIC_STAMP_DUTY: StampDutyTable = {
  general: [
    { min: 0,       max: 25000,    rate: 0.014,  base: 0 },
    { min: 25000,   max: 130000,   rate: 0.024,  base: 350 },
    { min: 130000,  max: 960000,   rate: 0.06,   base: 2870 },
    { min: 960000,  max: 2000000,  rate: 0.055,  base: 52670 },
    { min: 2000000, max: Infinity, rate: 0.065,  base: 109870 },
  ],
  firstHomeBuyer: {
    fullExemptionThreshold: 600000,
    concessionTopThreshold: 750000,
    grantAmount: 10000,
    grantPriceCapNew: 750000,
  },
  foreignSurchargeRate: 0.08,
};

// ─── New South Wales ──────────────────────────────────────────────────────────

export const NSW_STAMP_DUTY: StampDutyTable = {
  general: [
    { min: 0,        max: 16000,    rate: 0.0125, base: 0 },
    { min: 16000,    max: 35000,    rate: 0.015,  base: 200 },
    { min: 35000,    max: 93000,    rate: 0.0175, base: 485 },
    { min: 93000,    max: 351000,   rate: 0.035,  base: 1500 },
    { min: 351000,   max: 1168000,  rate: 0.045,  base: 10530 },
    { min: 1168000,  max: 3505000,  rate: 0.055,  base: 47295 },
    { min: 3505000,  max: Infinity, rate: 0.07,   base: 175850 },
  ],
  firstHomeBuyer: {
    fullExemptionThreshold: 800000,
    concessionTopThreshold: 1000000,
    grantAmount: 10000,
    grantPriceCapNew: 600000,
  },
  foreignSurchargeRate: 0.08,
};

// ─── Queensland (stub) ────────────────────────────────────────────────────────
// TODO: Add full QLD table post-v1.0
export const QLD_STAMP_DUTY: StampDutyTable = {
  general: [
    { min: 0,       max: 5000,     rate: 0,      base: 0 },
    { min: 5000,    max: 75000,    rate: 0.015,  base: 0 },
    { min: 75000,   max: 540000,   rate: 0.035,  base: 1050 },
    { min: 540000,  max: 1000000,  rate: 0.045,  base: 17325 },
    { min: 1000000, max: Infinity, rate: 0.0575, base: 38025 },
  ],
  firstHomeBuyer: {
    fullExemptionThreshold: 500000,
    concessionTopThreshold: 550000,
    grantAmount: 30000,
    grantPriceCapNew: 750000,
  },
};

// ─── Other states (stubs) ─────────────────────────────────────────────────────
// TODO: WA, SA, TAS, ACT, NT — add full tables post-v1.0
export const WA_STAMP_DUTY: StampDutyTable = {
  general: [
    { min: 0,       max: 120000,   rate: 0.019,  base: 0 },
    { min: 120000,  max: 150000,   rate: 0.0285, base: 2280 },
    { min: 150000,  max: 360000,   rate: 0.03,   base: 3135 },
    { min: 360000,  max: 725000,   rate: 0.0515, base: 9435 },
    { min: 725000,  max: Infinity, rate: 0.051,  base: 28278 },
  ],
  firstHomeBuyer: {
    fullExemptionThreshold: 430000,
    concessionTopThreshold: 530000,
  },
};

// ─── State lookup ─────────────────────────────────────────────────────────────

export type AustralianState = 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

const STATE_TABLES: Record<AustralianState, StampDutyTable> = {
  VIC: VIC_STAMP_DUTY,
  NSW: NSW_STAMP_DUTY,
  QLD: QLD_STAMP_DUTY,
  WA:  WA_STAMP_DUTY,
  SA:  WA_STAMP_DUTY,  // stub — using WA as placeholder
  TAS: WA_STAMP_DUTY,  // stub
  ACT: WA_STAMP_DUTY,  // stub
  NT:  WA_STAMP_DUTY,  // stub
};

export interface StampDutyResult {
  dutyPayable: number;
  concessionApplied: boolean;
  concessionSaving: number;
  fhogAmount: number;
  netCost: number;     // dutyPayable - fhogAmount
}

/**
 * Calculate stamp duty for a property purchase.
 * @param price - Purchase price in AUD
 * @param state - Australian state/territory
 * @param firstHomeBuyer - Whether purchaser is a first home buyer
 * @param isNewHome - Whether property is a new build (affects FHOG)
 */
export function calculateStampDuty(
  price: number,
  state: AustralianState,
  firstHomeBuyer: boolean,
  isNewHome = false,
): StampDutyResult {
  const table = STATE_TABLES[state];
  const fullDuty = calcDutyFromTable(price, table.general);
  const fhb = table.firstHomeBuyer;

  let dutyPayable = fullDuty;
  let concessionApplied = false;
  let concessionSaving = 0;
  let fhogAmount = 0;

  if (firstHomeBuyer) {
    if (price <= fhb.fullExemptionThreshold) {
      dutyPayable = 0;
      concessionApplied = true;
      concessionSaving = fullDuty;
    } else if (fhb.concessionTopThreshold && price <= fhb.concessionTopThreshold) {
      // Sliding scale: interpolate between full exemption and full duty
      const range = fhb.concessionTopThreshold - fhb.fullExemptionThreshold;
      const overshoot = price - fhb.fullExemptionThreshold;
      const fraction = overshoot / range;
      dutyPayable = fullDuty * fraction;
      concessionApplied = true;
      concessionSaving = fullDuty - dutyPayable;
    }

    if (
      fhb.grantAmount &&
      isNewHome &&
      fhb.grantPriceCapNew &&
      price <= fhb.grantPriceCapNew
    ) {
      fhogAmount = fhb.grantAmount;
    }
  }

  return {
    dutyPayable: Math.round(dutyPayable),
    concessionApplied,
    concessionSaving: Math.round(concessionSaving),
    fhogAmount,
    netCost: Math.round(dutyPayable - fhogAmount),
  };
}

function calcDutyFromTable(price: number, brackets: DutyBracket[]): number {
  for (const b of brackets) {
    if (price <= b.max) {
      return b.base + (price - b.min) * b.rate;
    }
  }
  return 0;
}
