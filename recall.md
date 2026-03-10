# AusFinTools — Recall Log

> This file is a running chain-of-thought log. Update it at every versioning gate.
> It exists specifically to survive context compaction — always read this first when resuming.

---

## Versioning Gates

| Version | Phase | Description | Pushed to GitHub |
|---------|-------|-------------|-----------------|
| v0.1.0  | Phase 0–1 | File reorganisation + Vite/React/TS/Tailwind v4/Vitest scaffold | No — PUSH NEEDED |

---

## Current State (as of v0.1.0)

**Branch:** `main`
**Last commit:** `e42d6fd` — feat: scaffold vite + react + ts + tailwind v4 + vitest

### Completed
- [x] Phase 0: Seed files moved → `docs/` and `reference/`
- [x] Phase 1: Vite 7 + React 19 + TypeScript + Tailwind CSS v4 + Vitest 4 scaffolded
  - `vite.config.ts` — `@tailwindcss/vite` plugin (v4 pattern, no `tailwind.config.js`)
  - `vitest.config.ts` — globals: true, environment: jsdom
  - `src/App.tsx` — placeholder "coming soon" screen
  - `src/index.css` — `@import "tailwindcss";`
  - `public/favicon.svg` — blue AUD $ icon
  - `npm run build` passes clean ✓

### Up Next (Phase 2)
- [ ] `src/data/tax-brackets.ts` — TAX_BRACKETS_2024_25, MEDICARE_LEVY_RATE, MEDICARE_LEVY_SURCHARGE_THRESHOLDS
- [ ] `src/data/super-rules.ts` — SUPER_RULES (12% SG rate, $30k concessional cap, etc.)
- [ ] `src/data/stamp-duty-tables.ts` — VIC + NSW tables (other states: stub with TODO)
- [ ] `src/data/constants.ts` — HELP thresholds, CGT discounts, Medicare
- [ ] `src/utils/formatters.ts` — formatCurrency, formatPercent, formatCompact ($1.2M, $450k)
- [ ] `src/utils/financial.ts` — monthlyRepayment, compoundGrowth, calcTax (shared math)

---

## Full Phase Roadmap

| Phase | Version Gate | Description |
|-------|-------------|-------------|
| 0–1   | v0.1.0 ✓   | File reorg + scaffold |
| 2     | v0.2.0      | Australian data layer + utils |
| 3     | v0.3.0      | Shared UI components + theme + routing shell |
| 4     | v0.4.0      | Calculator: Offset vs Debt Recycling |
| 5     | v0.5.0      | Calculator: Direct Investing vs DR |
| 6     | v0.6.0      | Calculator: Tax Savings Guide (4 sub-tabs) |
| 7     | v0.7.0      | Calculator: House Purchasing Affordability |
| 8     | v0.8.0      | Calculator: FIRE Suite (5 sub-tabs) |
| 9     | v0.9.0      | Calculator: Investment Comparison |
| 10    | v0.10.0     | Calculator: Savings Rate Impact |
| 11    | v0.11.0     | Calculator: Property Research Tool |
| 12    | v1.0.0      | README, LICENSE, CONTRIBUTING, GitHub Actions deploy |

**Rule: After every version gate, prompt user to `git push origin main` before proceeding.**

---

## Key Technical Decisions (locked in)

- **Tailwind v4** — uses `@tailwindcss/vite` Vite plugin. No `tailwind.config.js`. CSS entry is `@import "tailwindcss";`
- **React 19 + React Router v7** (installed as `react-router-dom@^7`)
- **Recharts 3** for charts (LineChart trajectories, BarChart comparisons)
- **No localStorage, no cookies** — URL params only for state persistence (`useUrlParams` hook)
- **All monetary values in AUD** — no cents-as-integers approach needed (JS floats fine for display)
- **All financial data in `src/data/`** — engines import from there, never hardcode
- **Strict TypeScript** — no `any`, all engine params/returns typed
- **Monthly compounding** throughout unless stated otherwise

---

## Australian Financial Data (2024-25) — Quick Reference

- Tax brackets: 0%, 16%, 30%, 37%, 45% (Stage 3 cuts)
- Medicare levy: 2%
- Super SG rate: 12% (from 1 July 2025)
- Concessional cap: $30,000
- Division 293 threshold: $250,000
- Preservation age: 60 (born after 1 July 1964)
- CGT discount individual: 50% (assets held >12 months)
- VIC FHB stamp duty exemption: <$600k full, $600k–$750k sliding

---

## Architecture Notes

```
src/
├── App.tsx                    # React Router shell + routes
├── main.tsx                   # Entry point
├── index.css                  # @import "tailwindcss"
├── vite-env.d.ts
├── data/                      # Australian financial constants (import, never hardcode)
├── utils/                     # Shared pure math + formatting
├── hooks/                     # useTheme, useUrlParams
├── components/
│   ├── layout/                # Navbar, Footer, Layout
│   ├── ui/                    # SliderControl, NumberInput, StatCard, Tabs, BarCompare, Toggle
│   └── shared/                # Disclaimer, Assumptions
└── calculators/
    ├── offset-vs-dr/          # engine.ts, engine.test.ts, types.ts, OffsetVsDR.tsx
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

- `tsconfig.tsbuildinfo` is committed — add to `.gitignore` next pass
- `dist/` is committed — ensure it remains in `.gitignore` and purge from tracking if needed
- React Router v7 API is slightly different from v6 — use `createBrowserRouter` + `RouterProvider` pattern

---

## Bug Fixes Log

*(none yet)*

---

## Deferred Items

- Stamp duty tables for QLD, WA, SA, TAS, ACT, NT — stub with TODO comments, implement post-v1.0.0
- Franking credits on ETF dividends — not modelled in DR calculators (noted in Assumptions)
- Inflation adjustments — not modelled (noted in Assumptions)
- Rate changes / variable rate scenarios — out of scope v1.0.0

