# AusFinTools — Recall Log

> Running chain-of-thought log. Read this first when resuming after context compaction.

---

## Versioning Gates

| Version | Phase | Description | Status |
|---------|-------|-------------|--------|
| v0.1.0  | Phase 0–1 | File reorg + scaffold | ✅ Pushed |
| v0.2.0  | Phase 2   | Australian data layer + utils | ✅ Pushed |
| v0.3.0  | Phase 3   | Shared UI + hooks + routing shell | ✅ Pushed |

---

## Current State (as of v0.3.0)

**Branch:** `main`

### Completed
- [x] Phase 0–1: File reorg + Vite/React 19/TS/Tailwind v4/Vitest scaffold
- [x] Phase 2: All `src/data/` and `src/utils/` files
- [x] Phase 3: Full shared UI library, hooks, routing
  - `src/hooks/useTheme.ts` — URL param persist, dark class on `<html>`
  - `src/hooks/useUrlParams.ts` — generic URL state sync
  - `src/components/ui/` — SliderControl, NumberInput, StatCard, Tabs, Toggle, BarCompare
  - `src/components/layout/` — Navbar (mobile hamburger), Footer, Layout
  - `src/components/shared/` — Disclaimer, Assumptions (collapsible)
  - `src/pages/Landing.tsx` — 8-card landing page
  - `src/App.tsx` — React Router v7 createBrowserRouter, all 8 routes lazy-loaded
  - Calculator stubs in place for all 8 routes

### Up Next (Phase 4)
Port reference/offset-vs-debt-recycling.jsx to typed TS:
- [ ] src/calculators/offset-vs-dr/types.ts
- [ ] src/calculators/offset-vs-dr/engine.ts
- [ ] src/calculators/offset-vs-dr/engine.test.ts
- [ ] src/calculators/offset-vs-dr/OffsetVsDR.tsx (full UI)

---

## Full Phase Roadmap

| Phase | Version | Description | Status |
|-------|---------|-------------|--------|
| 0–1   | v0.1.0  | File reorg + scaffold | ✅ |
| 2     | v0.2.0  | Data layer + utils | ✅ |
| 3     | v0.3.0  | Shared UI + routing | ✅ |
| 4     | v0.4.0  | Offset vs DR | 🔄 Next |
| 5     | v0.5.0  | Direct Investing vs DR | |
| 6     | v0.6.0  | Tax Savings Guide (4 sub-tabs) | |
| 7     | v0.7.0  | House Affordability | |
| 8     | v0.8.0  | FIRE Suite (5 sub-tabs) | |
| 9     | v0.9.0  | Investment Comparison | |
| 10    | v0.10.0 | Savings Rate Impact | |
| 11    | v0.11.0 | Property Research Tool | |
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
└── calculators/               stubs in place for all 8 (Phases 4–11)
```

---

## Key Technical Decisions

- React Router v7: createBrowserRouter + RouterProvider
- Lazy imports: each calculator = separate JS chunk
- Theme: useTheme hook → ?theme= URL param → dark class on <html>
- URL params: useUrlParams<T>(defaults) for all calculator state
- Tailwind v4: no config file, dark: prefix works via CSS cascade
- Recharts Tooltip: value is ValueType | undefined — guard with typeof checks

---

## Australian Data Quick Reference

Tax 2024-25 (Stage 3): 0% / 16% / 30% / 37% / 45% + 2% Medicare
Super: 12% SG, $30k concessional cap, Div 293 at $250k, preservation age 60
VIC FHB: full exemption <$600k, sliding $600k–$750k, full duty >$750k
CGT: individual 50% discount (>12mo), super 33.33%, company nil

---

## Bug Fixes Log

- v0.3.0: BarCompare Tooltip formatter — guard undefined value with typeof check

---

## Deferred

- Stamp duty full tables: QLD, WA, SA, TAS, ACT, NT (stubs in place)
- Franking credits, inflation, variable rates — not modelled v1.0
