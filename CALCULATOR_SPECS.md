# Calculator Specifications

Each calculator spec below defines: purpose, inputs, outputs, engine functions, UI layout, and test cases.

---

## 1. Offset vs Debt Recycling

**Route:** `/offset-vs-dr`
**Status:** Reference implementation exists in `reference/offset-vs-debt-recycling.jsx`

### Purpose
Compare parking a lump sum in a mortgage offset account vs using debt recycling to invest in ETFs.

### Inputs
| Parameter | Default | Range | Type |
|---|---|---|---|
| Loan amount | 925,000 | 50k–5M | NumberInput |
| Interest rate | 5.7% | 2–12% | Slider |
| Loan term | 15 years | 1–40 | NumberInput |
| ETF total return | 8.5% | 2–16% | Slider |
| Dividend yield | 2.5% | 0–8% | Slider |
| Marginal tax rate | 47% | 0–49% | Slider |
| CGT discount | 50% | 0–50% | Slider |
| Comparison amounts | 50k,100k,150k,200k,250k,300k | Custom CSV | TextInput |

### Engine Functions (engine.ts)

```typescript
function monthlyRepayment(principal: number, annualRate: number, years: number): number
function runOffset(loan: number, rate: number, years: number, offsetAmt: number): OffsetResult
function runDebtRecycling(loan: number, rate: number, years: number, investAmt: number, etfReturn: number, divYield: number, margTax: number, cgtDiscount: number): DRResult
```

### Outputs
- Summary table: all amounts side by side
- Detail cards: Offset breakdown vs DR breakdown for selected amount
- Year-by-year bar chart
- Stat cards at selected year snapshot

### Test Cases
1. $500k loan, 6%, 30yr, $100k offset → interest saved ≈ $149,000
2. Zero interest rate → monthly repayment = principal / (years × 12)
3. Offset amount = loan amount → zero interest paid
4. ETF return = mortgage rate, 0% tax → DR and offset should be roughly equal

---

## 2. Direct Investing vs Debt Recycling

**Route:** `/direct-vs-dr`

### Purpose
Compare investing a lump sum directly (unlevered) vs via debt recycling (levered with tax-deductible interest).

### Inputs
| Parameter | Default | Range |
|---|---|---|
| Lump sum | 200,000 | 10k–2M |
| ETF total return | 8.5% | 2–16% |
| Dividend yield | 2.5% | 0–8% |
| Mortgage rate | 5.7% | 2–12% |
| Marginal tax rate | 47% | 0–49% |
| CGT discount | 50% | 0–50% |
| Time horizon | 15 years | 1–40 |

### Engine Functions

```typescript
function runDirectInvest(amount: number, etfReturn: number, divYield: number, margTax: number, cgtDiscount: number, years: number): DirectResult
function runDebtRecyclingStandalone(amount: number, etfReturn: number, divYield: number, mortgageRate: number, margTax: number, cgtDiscount: number, years: number): DRStandaloneResult
function findBreakevenReturn(mortgageRate: number, margTax: number): number
```

### Outputs
- Side-by-side: final portfolio, tax deductions, CGT, net wealth
- Breakeven line: "DR outperforms direct investing when ETF return > X%"
- Year-by-year wealth trajectory (Recharts LineChart)
- After-tax cost of leverage display

### Key Formula
DR after-tax borrowing cost = mortgage rate × (1 − marginal tax rate)
Breakeven: ETF return must exceed this rate for DR to win.

---

## 3. Tax Savings Guide

**Route:** `/tax-savings`
**Layout:** Tabbed interface with 4 sub-calculators

### 3a. Super Salary Sacrifice

**Tab label:** "Super Sacrifice"

**Inputs:**
| Parameter | Default | Range |
|---|---|---|
| Gross salary | 250,000 | 50k–1M |
| Current super balance | 200,000 | 0–5M |
| Employer SG rate | 12% | 9.5–15% |
| Additional salary sacrifice (pa) | 10,000 | 0–30,000 |
| Unused concessional cap (carry-forward) | 0 | 0–150,000 |
| Age | 35 | 18–70 |
| Retirement age | 60 | 50–75 |
| Expected super return | 7% | 2–12% |

**Engine Functions:**
```typescript
function calculateSuperSacrifice(params: SuperSacrificeParams): SuperSacrificeResult
// Must handle:
// - $30k concessional cap (including employer SG)
// - Carry-forward unused cap (5 years, only if total super < $500k)
// - Division 293 tax (extra 15% if income + concessional contribs > $250k)
// - Compare: salary sacrifice into super (taxed at 15%) vs take-home + invest (taxed at marginal rate)
```

**Outputs:**
- Tax saved this year from salary sacrifice
- Available concessional cap (after employer SG)
- Division 293 warning if applicable
- Projected super balance at retirement
- Comparison: super path vs invest-outside-super path

### 3b. Debt Recycling Tax Calculator

**Tab label:** "DR Tax Benefit"

**Inputs:** Investment loan balance, interest rate, marginal tax rate
**Outputs:** Annual deduction, effective after-tax rate, cumulative deductions over 5/10/15 years

### 3c. Negative Gearing Estimator

**Tab label:** "Negative Gearing"

**Inputs:**
| Parameter | Default |
|---|---|
| Property value | 650,000 |
| Rental income (pw) | 450 |
| Mortgage rate | 6.0% |
| LVR | 80% |
| Council rates (pa) | 2,000 |
| Insurance (pa) | 1,500 |
| Property management (%) | 7% |
| Maintenance (pa) | 2,000 |
| Depreciation (pa) | 8,000 |
| Marginal tax rate | 47% |

**Engine Functions:**
```typescript
function calculateNegativeGearing(params: NegGearingParams): NegGearingResult
// Outputs: annual rental income, total expenses, taxable loss, tax refund, net cash position
```

### 3d. Tax Bracket Visualiser

**Tab label:** "Tax Brackets"

**Inputs:** Taxable income slider (0–500k)
**Outputs:**
- Stacked bar showing tax payable by bracket
- Marginal rate vs average (effective) rate
- Medicare levy amount
- HELP repayment amount (if toggle enabled)
- After-tax income

Use Recharts AreaChart or stacked BarChart.

---

## 4. House Purchasing Affordability

**Route:** `/house-affordability`

### Inputs
| Parameter | Default | Range |
|---|---|---|
| Gross household income | 250,000 | 30k–2M |
| Partner income | 0 | 0–1M |
| Existing debts (HELP) | 0 | 0–200k |
| Existing debts (other monthly) | 0 | 0–10k/mo |
| Deposit / savings | 150,000 | 0–5M |
| Property price | 850,000 | 100k–5M |
| State | VIC | Dropdown: VIC/NSW/QLD/WA/SA/TAS/ACT/NT |
| First home buyer | Yes | Toggle |
| Interest rate | 5.7% | 2–12% |
| Loan term | 30 years | 10–40 |

### Engine Functions

```typescript
function calculateBorrowingCapacity(income: number, partnerIncome: number, existingDebts: number, rate: number, serviceabilityBuffer: number): number
// Use APRA methodology: assess at rate + 3% buffer, 30% of gross income for housing

function calculateStampDuty(price: number, state: string, firstHomeBuyer: boolean): StampDutyResult
// Returns: duty amount, any concessions applied, FHOG if eligible

function calculateLMI(loanAmount: number, propertyValue: number): number
// Estimate LMI if LVR > 80%

function calculateTrueMonthlyCost(params: HouseParams): MonthlyCostBreakdown
// Returns: P&I repayment, council rates, water, insurance, strata, maintenance, total
```

### Outputs
- Maximum borrowing capacity
- Stamp duty + concessions
- LMI estimate (if applicable)
- Monthly repayment breakdown (P&I, rates, insurance, strata, maintenance)
- Total monthly cost of ownership
- Affordability ratio (housing % of income)
- Stress test: what if rates rise 1%, 2%, 3%?
- Bar chart: monthly cost breakdown

### Stamp Duty Implementation
Store tables in `src/data/stamp-duty-tables.ts`. Start with VIC and NSW (most common), add other states as `StampDutyTable` type with a calculator function per state.

---

## 5. Property Research Tool

**Route:** `/property-research`

### Purpose
Guided 130-point checklist for evaluating Australian investment properties, based on a 3-layer framework.

### Structure
Three collapsible layers, each with scored criteria:

**Layer 1 — Suburb Level (40 points)**
- Population growth trend (0-5)
- Median price trend (0-5)
- Rental yield (0-5)
- Days on market (0-5)
- Vacancy rate (0-5)
- Infrastructure pipeline (0-5)
- School quality (0-5)
- Crime rate (0-5)

**Layer 2 — Intra-Suburb (40 points)**
- Flood zone check (pass/fail — deal breaker)
- Bushfire zone check (pass/fail — deal breaker)
- Proximity to train/tram (0-5)
- Street type & traffic (0-5)
- Zoning & development risk (0-5)
- Walkability (0-5)
- Neighbouring properties condition (0-5)
- Power lines / easements (0-5)

**Layer 3 — Property Level (50 points)**
- Land size & ratio (0-5)
- Building age & condition (0-5)
- Floor plan functionality (0-5)
- Natural light (0-5)
- Parking (0-5)
- Depreciation potential (0-5)
- Renovation scope (0-5)
- Rental appeal (0-5)
- Body corporate / strata (0-5)
- Title type (0-5)

### UI
- Accordion sections for each layer
- Each criterion: slider (0-5) or pass/fail toggle
- Deal-breaker items (flood, bushfire) auto-flag as AVOID if failed
- Running score at top
- Final recommendation: Strong Buy (>100), Buy (80-100), Hold (60-80), Caution (40-60), Avoid (<40 or any deal-breaker)
- Sidebar with links to data sources (Domain, SQM Research, VicPlan, MySchool, Microburbs, etc.)

---

## 6. FIRE Calculator Suite

**Route:** `/fire`
**Layout:** Tabbed interface with 5 sub-calculators

### 6a. Classic FIRE (4% Rule)

**Inputs:**
| Parameter | Default |
|---|---|
| Current age | 35 |
| Annual expenses in retirement | 80,000 |
| Current investments (non-super) | 200,000 |
| Current super balance | 200,000 |
| Annual savings | 50,000 |
| Expected investment return | 7% |
| Safe withdrawal rate | 4% |

**Engine:**
```typescript
function calculateFIRENumber(annualExpenses: number, withdrawalRate: number): number
function yearsToFIRE(currentInvestments: number, annualSavings: number, targetAmount: number, returnRate: number): number
function projectSavings(current: number, annualAddition: number, returnRate: number, years: number): number[]
```

**Outputs:**
- FIRE number (expenses / SWR)
- Years to FIRE
- FIRE age
- Progress bar (current % of FIRE number)
- Trajectory chart (Recharts LineChart)
- Sensitivity table: SWR at 3%, 3.5%, 4%, 4.5%

### 6b. Coast FIRE

**Inputs:** Current investments, target FIRE number, expected return, target retirement age, current age
**Engine:**
```typescript
function coastFIRENumber(targetAmount: number, returnRate: number, yearsToRetirement: number): number
// Amount needed today such that compound growth alone reaches target
```
**Outputs:** Coast FIRE number, whether you've reached it, gap remaining

### 6c. Barista FIRE

**Inputs:** Current investments, part-time income, annual expenses, expected return, current age
**Outputs:** Annual gap (expenses - part-time income), years until portfolio covers the gap, trajectory chart

### 6d. Lean vs Fat FIRE

**Inputs:** Current savings, annual savings, return rate
**Outputs:** Side-by-side comparison at multiple expense levels ($40k, $60k, $80k, $100k, $120k) showing FIRE number and years to reach it

### 6e. Australian Super Bridge

**THIS IS THE KEY DIFFERENTIATOR vs US FIRE calculators.**

**Inputs:**
| Parameter | Default |
|---|---|
| Current age | 35 |
| Early retirement age | 50 |
| Super preservation age | 60 |
| Current non-super investments | 200,000 |
| Current super balance | 200,000 |
| Annual savings (non-super) | 40,000 |
| Annual super contributions (total) | 30,000 |
| Annual expenses in retirement | 80,000 |
| Non-super return | 7% |
| Super return | 7% |

**Engine:**
```typescript
function calculateSuperBridge(params: SuperBridgeParams): SuperBridgeResult
// Model two phases:
// Phase 1: Early retirement → preservation age (draw from non-super only)
// Phase 2: Preservation age → death (draw from super, topped up by non-super if needed)
// Key output: does non-super last until preservation age?
```

**Outputs:**
- Dual-track chart: non-super balance + super balance over time
- Critical question answered: "Do you have enough non-super to bridge to preservation age?"
- Gap analysis: if non-super runs out before 60, how much more do you need?
- Scenario comparison: retire at 45 vs 50 vs 55

---

## 7. Investment Comparison

**Route:** `/investment-compare`

### Inputs (up to 4 scenarios)
| Parameter | Per Scenario |
|---|---|
| Label | Text ("DHHF", "Super", "Savings Account") |
| Initial investment | NumberInput |
| Monthly contribution | NumberInput |
| Expected return | Slider |
| Annual fee / MER | Slider (0–2%) |
| Tax treatment | Dropdown: Marginal Rate / Super (15%) / Tax-Free |

Plus: shared time horizon and marginal tax rate.

**Outputs:**
- Line chart: all scenarios over time
- Final values table
- Total fees paid per scenario
- After-tax final value

---

## 8. Savings Rate Impact

**Route:** `/savings-rate`

### Inputs
| Parameter | Default |
|---|---|
| Annual after-tax income | 150,000 |
| Current net worth | 200,000 |
| Expected return | 7% |
| Annual expenses | Derived from income × (1 - savings rate) |

### Engine
```typescript
function yearsToFIREBySavingsRate(income: number, currentNW: number, returnRate: number): { rate: number; years: number }[]
// Calculate for savings rates 10% to 90% in 5% increments
```

### Outputs
- Interactive chart: savings rate (x-axis) vs years to FIRE (y-axis)
- Current savings rate highlighted
- Slider to adjust savings rate and see real-time impact
- Key insight callout: "Increasing your savings rate from 30% to 40% saves X years"

---

## Notes for All Calculators

1. **Every calculator page must include `<Disclaimer />` at the bottom**
2. **Every calculator must have a collapsible `<Assumptions />` section**
3. **All use the shared theme system (light/dark)**
4. **All parameters should be reflected in URL query params for shareability**
5. **Mobile responsive: stack columns vertically on small screens**
6. **Display "Based on 2024-25 ATO rates" where tax data is used**
