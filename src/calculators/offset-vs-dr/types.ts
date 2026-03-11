export interface OffsetYearlyRow {
  year: number;
  balance: number;
  totalInterest: number;
  netWealth: number;
}

export interface DRYearlyRow {
  year: number;
  homeLoanBal: number;
  investLoanBal: number;
  portfolioValue: number;
  totalInterestPaid: number;
  taxDeductions: number;
  netWealth: number;
  netWealthAfterCGT: number;
}

export interface OffsetResult {
  totalInterest: number;
  interestSaved: number;
  monthsToPayoff: number;
  yearsToPayoff: string;
  offsetValue: number;
  yearly: OffsetYearlyRow[];
}

export interface DRResult {
  totalInterest: number;
  taxDeductions: number;
  netInterestCost: number;
  portfolioValue: number;
  cgtIfSold: number;
  netWealthPostCGT: number;
  yearly: DRYearlyRow[];
}
