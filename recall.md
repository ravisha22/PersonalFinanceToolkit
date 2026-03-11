# AusFinTools — Recall Log

> Running chain-of-thought log. Read this first when resuming after context compaction.

---

## Versioning Gates

| Version | Phase | Description | Status |
|---------|-------|-------------|--------|
| v0.1.0  | Phase 0–1  | File reorg + Vite/React/TS/Tailwind v4/Vitest scaffold | Pushed |
| v0.2.0  | Phase 2    | Australian data layer + utils | Pushed |
| v0.3.0  | Phase 3    | Shared UI components + theme + routing shell | Pushed |
| v0.4.0  | Phase 4    | Calculator: Offset vs Debt Recycling | Pushed |
| v0.5.0  | Phase 5    | Calculator: Direct Investing vs DR | Pushed |
| v0.6.0  | Phase 6    | Calculator: Tax Savings Guide (4 sub-tabs) | Pushed |
| v0.7.0  | Phase 7    | Calculator: House Affordability | Pushed |
| v0.8.0  | Phase 8    | Calculator: FIRE Suite (5 sub-tabs) | Pushed |
| v0.9.0  | Phase 9    | Calculator: Investment Comparison | Pushed |
| v0.10.0 | Phase 10   | Calculator: Savings Rate Impact | Pushed |
| v0.11.0 | Phase 11   | Calculator: Property Research Tool | Pushed |
| v1.0.0  | Phase 12   | README, LICENSE, CONTRIBUTING, GitHub Actions deploy | Pushed |
| v1.1.0  | Post-v1    | UX polish: dark mode fix, branding rename, default reset, AboutCalc, output explanations, IO/PI toggle, DR framing | Pushed |
| v1.2.0  | Post-v1    | Portfolio view, gear icon, light mode contrast, Investment lock, nav reorder/rerename, DR text removal | Pushed |

---

## PROJECT COMPLETE — v1.2.0

All 12 phases delivered + v1.1.0 and v1.2.0 UX polish. 9 views (Portfolio + 8 calculators) live.

### v1.1.0 Changes (post-v1.0)

- **Dark mode**: Added `@custom-variant dark (&:where(.dark, .dark *));` to `src/index.css` — Tailwind v4 requires this for class-based dark mode (the `dark:` prefix was silently no-oping without it)
- **Branding**: "AusFinTools" → "Australian Personal Finance Tools" everywhere (Navbar, Footer, Landing, README, CONTRIBUTING, package.json, index.html)
- **Neutral defaults**: All 8 calculators updated with round-number, non-personal defaults (e.g., income $85k, rate 6%, margTax 34.5%)
- **AboutCalc component**: New `src/components/shared/AboutCalc.tsx` — collapsible "About this calculator" accordion with plain-English definitions and reputable source links (Wikipedia, ATO, MoneySmart). Added to all 8 calculators.
- **Output explanations**: Plain-text explainer divs added above key data panels in all calculators (OffsetVsDR, DirectVsDR, HouseAffordability, InvestmentCompare, SavingsRate) — each with a free/public source link (MoneySmart, ATO, Wikipedia)
- **IO/PI toggle (Offset vs DR)**: `runDebtRecycling` engine now accepts optional `investLoanType: 'io' | 'pi'`, with PI amortisation logic. OffsetVsDR.tsx adds toggle buttons + 2-line plain-English explanation. Separate `useState` used (not useUrlParams) since it's a union type.
- **Direct vs DR framing fix**: AboutCalc explains why DR shows lower net wealth early (IO loan stays on books — net wealth = portfolio minus loan). Breakeven callout + result explanations added.
- **SuperBridge**: Added editable "Current Super Balance" NumberInput (previously hardcoded, was non-interactive)

### What was built

**Data layer (src/data/)**
- tax-brackets.ts: 2024-25 Stage 3 cuts, calcIncomeTax, calcMedicareLevy, getMarginalRate
- super-rules.ts: SG 12%, $30k concessional cap, Division 293, carry-forward rules
- stamp-duty-tables.ts: VIC + NSW full, QLD + WA stubs, calculateStampDuty()
- constants.ts: HELP thresholds, CGT discounts, LMI estimates, APRA buffer

**Utils (src/utils/)**
- formatters.ts: formatCompact, formatCurrency, formatPercent, formatDiff
- financial.ts: monthlyRepayment, futureValue, futureValueAnnuity, yearsToTarget, projectGrowth, estimateLMI, maxBorrowingCapacity

**Shared UI (src/components/)**
- ui/: SliderControl, NumberInput, StatCard, Tabs, Toggle, BarCompare
- layout/: Navbar (mobile hamburger), Footer, Layout (Outlet wrapper)
- shared/: Disclaimer, Assumptions (collapsible)

**Hooks (src/hooks/)**
- useTheme: dark/light toggle, URL param persist, dark class on html
- useUrlParams: generic calculator state sync to URL

**Calculators (src/calculators/) — 73 tests passing**
- offset-vs-dr: runOffset, runDebtRecycling, year-by-year comparison
- direct-vs-dr: runDirectInvest, findBreakevenReturn, leverage comparison
- tax-savings: super sacrifice (Div293), negative gearing, DR tax benefit, bracket visualiser
- house-affordability: APRA borrowing capacity, state stamp duty, LMI, stress test
- fire: Classic/Coast/Barista/LeanFat FIRE + SuperBridge (AU-specific dual-phase)
- investment-compare: up to 4 scenarios, marginal/super/tax-free tax treatment
- savings-rate: rate vs years-to-FIRE chart
- property-research: 130-point checklist, dealbreakers, live score panel

**Deploy**
- .github/workflows/deploy.yml: GitHub Actions → GitHub Pages (VITE_BASE=/PersonalFinanceToolkit/)
- vite.config.ts: VITE_BASE env var for base path (defaults to / for Vercel)

---

## Key Technical Notes (if resuming)

- React Router v7: createBrowserRouter + RouterProvider in App.tsx
- Tailwind v4: @tailwindcss/vite plugin, no config file, @import "tailwindcss" in CSS
- Tailwind v4 dark mode: requires `@custom-variant dark (&:where(.dark, .dark *));` in index.css — without it, `dark:` classes are silently ignored even when the `dark` class is on `<html>`
- TypeScript strict: no any, all engine functions fully typed
- Recharts Tooltip formatter: value is ValueType | undefined, always guard
- URL params: useUrlParams<T>(defaults) for all calculator state — no localStorage
- GitHub Pages base: set via VITE_BASE env var in deploy workflow
- Git email: ravisha22@users.noreply.github.com (set in repo-level git config)

---

## Deferred (post-v1.0)

- Stamp duty full tables: QLD, WA, SA, TAS, ACT, NT (stubs in place)
- Franking credits on ETF dividends (not modelled — noted in Assumptions)
- Inflation-adjusted projections
- Variable rate scenarios
- FIRE: sequence-of-returns risk modelling

---

## v1.2.0 — COMPLETE

### Fixes

**Fix 1 — Gear icon for settings (Offset vs Debt Recycling)**
- Heroicons cog SVG + "Settings"/"Close" text in top-right of card header. Replaces external toggle button. Settings panel expands inline.

**Fix 2 — Light mode contrast (elegant, not jarring)**
- Page bg: `bg-slate-50` → `bg-slate-100`; card borders: `→ border-slate-300`; label text: `text-slate-400` → `text-slate-500`; stat cards add `shadow-sm`

**Fix 3 — Portfolio view (new first view)**
- `src/pages/Portfolio.tsx` + `src/context/PortfolioContext.tsx` (session-only React Context, no localStorage)
- Sections: Income & Tax, Cash & Savings, Mortgage, Investments, Superannuation, Expenses (17 itemised categories)
- Footer CTA: "→ Continue to Tax Savings"
- All 7 downstream calculators consume context as optional initial defaults (fall back to built-in defaults when portfolio is 0)
- Wired: TaxSavingsGuide (salary + margTax + mortgageBalance + mortgageRate), FIREDashboard (savingsBalance+etfValue, monthlySavingsContrib×12, superBalance), SavingsRate (grossSalary, savingsBalance+etfValue), HouseAffordability (grossSalary, savingsBalance, propertyValue, mortgageRate, mortgageYearsRemaining), InvestmentCompare (3 scenarios pre-filled from etfValue/superBalance/savingsBalance + monthlys), OffsetVsDR (mortgageBalance, mortgageRate, mortgageYearsRemaining, etfReturn, margTax), DirectVsDR (etfValue, etfReturn, mortgageRate, margTax)

**Fix 4 — Investment Comparison: lock default scenarios**
- Remove button hidden for default 3 scenarios; only user-added 4th can be removed (`i >= DEFAULT_SCENARIOS.length`)

**Fix 5 — Navigation reorder + route renames**
- `/offset-vs-dr` → `/offset-vs-debt-recycling`; `/direct-vs-dr` → `/direct-vs-debt-recycling`; old routes get `<Navigate replace />`
- Nav order: Portfolio → Tax Savings → Savings Rate → FIRE → Investment Comparison → House Affordability → Property Research → Offset vs Debt Recycling → Direct vs Debt Recycling

**Fix 6 — Remove "DR" abbreviation everywhere**
- All user-facing text uses "Debt Recycling" in full (OffsetVsDR.tsx and DirectVsDR.tsx updated; internal file names unchanged)

### Also added
- `docs/PersonaFlowAnalysis.md` — market research document with real ATO/APRA/ABS/BetaShares data, 7 persona definitions, tool relevance matrix, recommended nav order rationale

