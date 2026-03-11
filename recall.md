# AusFinTools — Recall Log

> Running chain-of-thought log. Read this first when resuming after context compaction.

---

## Versioning Gates

| Version | Phase | Description | Status |
|---------|-------|-------------|--------|
| v0.1.0  | Phase 0–1 | File reorg + scaffold | ✅ Pushed |
| v0.2.0  | Phase 2   | Australian data layer + utils | ✅ Pushed |
| v0.3.0  | Phase 3   | Shared UI + hooks + routing shell | ✅ Pushed |
| v0.4.0  | Phase 4   | Offset vs Debt Recycling | ✅ Pushed |
| v0.5.0  | Phase 5   | Direct Investing vs Debt Recycling | ✅ Pushed |
| v0.6.0  | Phase 6   | Tax Savings Guide (4 sub-tabs) | ✅ Pushed |
| v0.7.0  | Phase 7   | House Affordability | ✅ Pushed |
| v0.8.0  | Phase 8   | FIRE Suite (5 sub-tabs) | ✅ Pushed |
| v0.9.0  | Phase 9   | Investment Comparison | ✅ Pushed |
| v0.10.0 | Phase 10  | Savings Rate Impact | ✅ Pushed |

---

## Current State (as of v0.9.0)

**Branch:** `main`

### Completed
- [x] Phase 0–1: File reorg + Vite/React 19/TS/Tailwind v4/Vitest scaffold
- [x] Phase 2: All `src/data/` and `src/utils/` files
- [x] Phase 3: Full shared UI library, hooks, routing
- [x] Phase 4: Offset vs DR — engine + tests + full UI
- [x] Phase 5: Direct Investing vs DR — engine + tests + full UI
- [x] Phase 6: Tax Savings Guide — engine + tests + 4 sub-tab UI
- [x] Phase 7: House Affordability — engine + tests + full UI
- [x] Phase 8: FIRE Suite — engine + tests + 5 sub-tab UI
- [x] Phase 9: Investment Comparison — engine + tests + full UI
- [x] Phase 10: Savings Rate Impact — engine + tests + full UI

### Up Next (Phase 11)
Property Research Tool:
- [ ] src/calculators/property-research/criteria.ts
- [ ] src/calculators/property-research/scoring.ts
- [ ] src/calculators/property-research/PropertyResearch.tsx

---

## Full Phase Roadmap

| Phase | Version | Description | Status |
|-------|---------|-------------|--------|
| 0–1   | v0.1.0  | File reorg + scaffold | ✅ |
| 2     | v0.2.0  | Data layer + utils | ✅ |
| 3     | v0.3.0  | Shared UI + routing | ✅ |
| 4     | v0.4.0  | Offset vs DR | ✅ |
| 5     | v0.5.0  | Direct Investing vs DR | ✅ |
| 6     | v0.6.0  | Tax Savings Guide (4 sub-tabs) | ✅ |
| 7     | v0.7.0  | House Affordability | ✅ |
| 8     | v0.8.0  | FIRE Suite (5 sub-tabs) | ✅ |
| 9     | v0.9.0  | Investment Comparison | ✅ |
| 10    | v0.10.0 | Savings Rate Impact | ✅ |
| 11    | v0.11.0 | Property Research Tool | 🔄 Next |
| 12    | v1.0.0  | README, LICENSE, deploy workflow | |

---

## Architecture (current)

```
src/
├── App.tsx                    ✅ React Router v7 createBrowserRouter, lazy imports
├── pages/Landing.tsx          ✅ 8-card landing page
├── data/                      ✅ tax-brackets, super-rules, stamp-duty-tables, constants
├── utils/                     ✅ formatters, financial
├── hooks/                     ✅ useTheme, useUrlParams
├── components/
│   ├── layout/                ✅ Navbar, Footer, Layout
│   ├── ui/                    ✅ SliderControl, NumberInput, StatCard, Tabs, Toggle, BarCompare
│   └── shared/                ✅ Disclaimer, Assumptions
└── calculators/
    ├── offset-vs-dr/          ✅ engine, tests, UI
    ├── direct-vs-dr/          ✅ engine, tests, UI
    ├── tax-savings/           ✅ engine, tests, 4-tab UI
    ├── house-affordability/   ✅ engine, tests, UI
    ├── fire/                  ✅ engine, tests, 5-tab UI
    ├── investment-compare/    ✅ engine, tests, UI
    ├── savings-rate/          ✅ engine, tests, UI
    └── property-research/     stub
```

---

## Key Technical Decisions

- React Router v7: createBrowserRouter + RouterProvider
- Lazy imports: each calculator = separate JS chunk
- Theme: useTheme hook → ?theme= URL param → dark class on <html>
- URL params: useUrlParams<T>(defaults) for all calculator state
- Tailwind v4: no config file, dark: prefix works via CSS cascade
- Recharts Tooltip: value is ValueType | undefined — guard with typeof checks
- Investment Compare engine: MER and tax applied monthly per-balance (not via netAnnualReturn shortcut)

---

## Australian Data Quick Reference

Tax 2024-25 (Stage 3): 0% / 16% / 30% / 37% / 45% + 2% Medicare
Super: 12% SG, $30k concessional cap, Div 293 at $250k, preservation age 60
VIC FHB: full exemption <$600k, sliding $600k–$750k, full duty >$750k
CGT: individual 50% discount (>12mo), super 33.33%, company nil

---

## Bug Fixes Log

- v0.3.0: BarCompare Tooltip formatter — guard undefined value with typeof check
- v0.4.0: runOffset interestSaved test — spec approximation corrected to validated range
- v0.5.0: DirectVsDR engine — removed unused monthlyDivNet; DR net-wealth test corrected to economic model
- v0.6.0: Super sacrifice test — use $150k salary to stay within concessional cap
- v0.8.0: ClassicFIRE unused Legend import; FIREDashboard const-only superBalance; CoastFIRE invalid require() rewrite
- v0.9.0: Investment Compare engine — removed unused costBase and void-suppressed netAnnualReturn

---

## Deferred

- Stamp duty full tables: QLD, WA, SA, TAS, ACT, NT (stubs in place)
- Franking credits, inflation, variable rates — not modelled v1.0
