# AusFinTools — Recall Log

> This file is a running chain-of-thought log. Update it at every versioning gate.
> It exists specifically to survive context compaction — always read this first when resuming.

---

## Versioning Gates

| Version | Phase | Description | Pushed to GitHub |
|---------|-------|-------------|-----------------|
| v0.1.0  | Phase 0–1 | File reorganisation + Vite/React/TS/Tailwind v4/Vitest scaffold | ✅ Pushed |
| v0.2.0  | Phase 2   | Australian data layer + shared math utils | ✅ Pushed |

---

## Current State (as of v0.2.0)

**Branch:** `main`

### Completed
- [x] Phase 0: Seed files → `docs/` and `reference/`
- [x] Phase 1: Vite 7 + React 19 + TypeScript + Tailwind CSS v4 + Vitest scaffolded
- [x] Phase 2: Australian data layer
  - `src/data/tax-brackets.ts` — TAX_BRACKETS_2024_25, calcIncomeTax, calcMedicareLevy, getMarginalRate, getEffectiveRate
  - `src/data/super-rules.ts` — SUPER_RULES, maxAdditionalSacrifice, isDivision293
  - `src/data/stamp-duty-tables.ts` — VIC + NSW full tables, QLD + WA stubs, calculateStampDuty()
  - `src/data/constants.ts` — HELP thresholds, CGT discounts, LMI estimates, APRA buffer, CURRENT_TAX_YEAR
  - `src/utils/formatters.ts` — formatCompact, formatCurrency, formatPercent, formatPct, formatYears, formatDiff
  - `src/utils/financial.ts` — monthlyRepayment, futureValue, futureValueAnnuity, yearsToTarget, projectGrowth, estimateLMI, maxBorrowingCapacity

### Up Next (Phase 3)
- [ ] `src/hooks/useTheme.ts` — system pref default, URL param persist, `dark` class on `<html>`
- [ ] `src/hooks/useUrlParams.ts` — generic URL state sync hook
- [ ] `src/components/ui/SliderControl.tsx`
- [ ] `src/components/ui/NumberInput.tsx`
- [ ] `src/components/ui/StatCard.tsx`
- [ ] `src/components/ui/Tabs.tsx`
- [ ] `src/components/ui/Toggle.tsx`
- [ ] `src/components/ui/BarCompare.tsx` (Recharts)
- [ ] `src/components/layout/Navbar.tsx` — links to all 8 calculators + theme toggle + mobile hamburger
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/components/layout/Layout.tsx`
- [ ] `src/components/shared/Disclaimer.tsx`
- [ ] `src/components/shared/Assumptions.tsx`
- [ ] `src/App.tsx` — React Router v7 + all routes + landing page

---

## Full Phase Roadmap

| Phase | Version Gate | Description | Status |
|-------|-------------|-------------|--------|
| 0–1   | v0.1.0 ✓   | File reorg + scaffold | ✅ Done |
| 2     | v0.2.0 ✓   | Australian data layer + utils | ✅ Done |
| 3     | v0.3.0      | Shared UI components + theme + routing shell | 🔄 Next |
| 4     | v0.4.0      | Calculator: Offset vs Debt Recycling | |
| 5     | v0.5.0      | Calculator: Direct Investing vs DR | |
| 6     | v0.6.0      | Calculator: Tax Savings Guide (4 sub-tabs) | |
| 7     | v0.7.0      | Calculator: House Purchasing Affordability | |
| 8     | v0.8.0      | Calculator: FIRE Suite (5 sub-tabs) | |
| 9     | v0.9.0      | Calculator: Investment Comparison | |
| 10    | v0.10.0     | Calculator: Savings Rate Impact | |
| 11    | v0.11.0     | Calculator: Property Research Tool | |
| 12    | v1.0.0      | README, LICENSE, CONTRIBUTING, GitHub Actions deploy | |

**Rule: After every version gate, push to `git push origin main` before proceeding.**

---

## Key Technical Decisions (locked in)

- **Tailwind v4** — `@tailwindcss/vite` plugin. No `tailwind.config.js`. CSS: `@import "tailwindcss";`
- **React 19 + React Router v7** (`react-router-dom@^7`) — use `createBrowserRouter` + `RouterProvider`
- **Recharts 3** for charts
- **No localStorage** — URL params only via `useUrlParams` hook
- **All monetary values in AUD** — no cents-as-integers
- **All financial data in `src/data/`** — engines import constants, never hardcode
- **Strict TypeScript** — no `any`
- **Monthly compounding** throughout

---

## Australian Financial Data (2024-25) — Quick Reference

### Tax Brackets (Stage 3 cuts, from 1 July 2024)
- $0–$18,200: 0%
- $18,201–$45,000: 16%
- $45,001–$135,000: 30%
- $135,001–$190,000: 37%
- $190,001+: 45%
- Medicare levy: +2%

### Super
- SG rate: 12% (from 1 July 2025)
- Concessional cap: $30,000
- Division 293 threshold: $250,000 (extra 15%)
- Preservation age: 60
- Carry-forward: up to 5 yrs unused cap if total super < $500k

### Stamp Duty — VIC FHB
- < $600k: full exemption
- $600k–$750k: sliding scale
- > $750k: full duty

### CGT
- Individual >12 months: 50% discount
- Super fund: 33.33% discount
- Company: no discount

---

## Architecture

```
src/
├── App.tsx                    # React Router shell + routes
├── main.tsx                   # Entry point
├── index.css                  # @import "tailwindcss"
├── vite-env.d.ts
├── data/                      ✅ Done
│   ├── tax-brackets.ts
│   ├── super-rules.ts
│   ├── stamp-duty-tables.ts
│   └── constants.ts
├── utils/                     ✅ Done
│   ├── formatters.ts
│   └── financial.ts
├── hooks/                     🔄 Phase 3
│   ├── useTheme.ts
│   └── useUrlParams.ts
├── components/
│   ├── layout/                🔄 Phase 3
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── ui/                    🔄 Phase 3
│   │   ├── SliderControl.tsx
│   │   ├── NumberInput.tsx
│   │   ├── StatCard.tsx
│   │   ├── Tabs.tsx
│   │   ├── Toggle.tsx
│   │   └── BarCompare.tsx
│   └── shared/                🔄 Phase 3
│       ├── Disclaimer.tsx
│       └── Assumptions.tsx
└── calculators/               🔄 Phases 4–11
    ├── offset-vs-dr/
    ├── direct-vs-dr/
    ├── tax-savings/
    ├── house-affordability/
    ├── fire/
    ├── investment-compare/
    ├── savings-rate/
    └── property-research/
```

---

## Known Issues / Watch Points

- React Router v7 uses `createBrowserRouter` + `RouterProvider` (not `<BrowserRouter>` wrapper)
- Recharts 3 API: `<ResponsiveContainer>` + named chart types, same as v2
- Tailwind v4: no arbitrary values need `[]` notation — use standard classes
- `npm run build` includes `tsc -b` — TypeScript errors will fail the build

---

## Bug Fixes Log

*(none yet)*

---

## Deferred Items

- Stamp duty: QLD, WA, SA, TAS, ACT, NT — stub tables added, full tables post-v1.0
- Franking credits on ETF dividends — not modelled (noted in Assumptions)
- Inflation adjustments — not modelled
- Rate changes / variable rate scenarios — out of scope v1.0
