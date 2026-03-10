# CLAUDE.md — AusFinTools Agent Instructions

## Project Overview

AusFinTools is a free, open-source, privacy-first suite of Australian personal finance calculators. It runs entirely client-side (no backend, no database, no API keys). All computation happens in the browser.

**Target audience:** Australian workers and investors making decisions about mortgages, tax, investing, superannuation, and FIRE planning.

**Key differentiator:** Everything is Australia-specific — tax brackets, super rules, CGT discount, Medicare levy, negative gearing, stamp duty by state. Most open-source finance tools are US-centric.

---

## Tech Stack

- **Framework:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS (utility classes only, no custom CSS where avoidable)
- **Routing:** React Router v6 (client-side SPA)
- **Charts:** Recharts
- **State:** React hooks only (useState, useReducer, useMemo). No Redux, no Zustand.
- **Hosting:** Vercel free tier (auto-deploy from GitHub) + GitHub Pages as fallback
- **Testing:** Vitest for engine functions (financial math must be tested)

---

## Project Structure

```
ausfintools/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx                       # Router + layout shell
│   ├── main.tsx                      # Entry point
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Top nav with calculator links + theme toggle
│   │   │   ├── Footer.tsx            # Disclaimer, GitHub link, "not financial advice"
│   │   │   └── Layout.tsx            # Wraps Navbar + content + Footer
│   │   ├── ui/
│   │   │   ├── SliderControl.tsx     # Label + range slider + value display
│   │   │   ├── NumberInput.tsx       # Label + number input with prefix/suffix
│   │   │   ├── StatCard.tsx          # Colored left-border metric card
│   │   │   ├── ComparisonTable.tsx   # Generic sortable comparison table
│   │   │   ├── BarCompare.tsx        # Horizontal dual-bar year-by-year chart
│   │   │   ├── Toggle.tsx            # Settings panel toggle button
│   │   │   └── Tabs.tsx             # Tab switcher for sub-modules
│   │   └── shared/
│   │       ├── Disclaimer.tsx        # Standard financial disclaimer block
│   │       └── Assumptions.tsx       # Collapsible assumptions panel
│   ├── calculators/
│   │   ├── offset-vs-dr/
│   │   │   ├── OffsetVsDR.tsx
│   │   │   ├── engine.ts
│   │   │   ├── engine.test.ts
│   │   │   └── types.ts
│   │   ├── direct-vs-dr/
│   │   │   ├── DirectVsDR.tsx
│   │   │   ├── engine.ts
│   │   │   └── engine.test.ts
│   │   ├── tax-savings/
│   │   │   ├── TaxSavingsGuide.tsx   # Parent with sub-tabs
│   │   │   ├── SuperSalarySacrifice.tsx
│   │   │   ├── DebtRecyclingTax.tsx
│   │   │   ├── NegativeGearing.tsx
│   │   │   ├── TaxBracketVis.tsx
│   │   │   ├── engine.ts
│   │   │   └── engine.test.ts
│   │   ├── house-affordability/
│   │   │   ├── HouseAffordability.tsx
│   │   │   ├── engine.ts
│   │   │   ├── engine.test.ts
│   │   │   └── stamp-duty.ts
│   │   ├── property-research/
│   │   │   ├── PropertyResearch.tsx
│   │   │   ├── checklist.ts
│   │   │   └── scoring.ts
│   │   ├── fire/
│   │   │   ├── FIREDashboard.tsx     # Parent with sub-tabs
│   │   │   ├── ClassicFIRE.tsx
│   │   │   ├── CoastFIRE.tsx
│   │   │   ├── BaristaFIRE.tsx
│   │   │   ├── LeanVsFat.tsx
│   │   │   ├── SuperBridge.tsx
│   │   │   ├── engine.ts
│   │   │   └── engine.test.ts
│   │   ├── investment-compare/
│   │   │   ├── InvestmentCompare.tsx
│   │   │   ├── engine.ts
│   │   │   └── engine.test.ts
│   │   └── savings-rate/
│   │       ├── SavingsRate.tsx
│   │       ├── engine.ts
│   │       └── engine.test.ts
│   ├── data/
│   │   ├── tax-brackets.ts
│   │   ├── super-rules.ts
│   │   ├── stamp-duty-tables.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useUrlParams.ts
│   └── utils/
│       ├── formatters.ts
│       └── financial.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── vitest.config.ts
├── README.md
├── LICENSE
├── CONTRIBUTING.md
└── CLAUDE.md
```

---

## Build Order

Follow this exact sequence. Each step should be a commit.

### Step 1: Scaffold
```bash
npm create vite@latest . -- --template react-ts
npm install react-router-dom recharts
npm install -D tailwindcss @tailwindcss/vite vitest
```

Configure Tailwind via Vite plugin (v4 style):
```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Add to src/index.css:
```css
@import "tailwindcss";
```

### Step 2: Theme System
Build `useTheme.ts` hook:
- Store theme in state (default: system preference via `prefers-color-scheme`)
- Apply `dark` class to `<html>` element
- Persist preference (URL param, NOT localStorage)

### Step 3: Shared UI Components
Build these reusable components. ALL calculators must use them for consistency:

**SliderControl** — props: `label, value, onChange, min, max, step, suffix, theme`
**NumberInput** — props: `label, value, onChange, min, max, step, prefix, suffix, theme`
**StatCard** — props: `label, value, color, theme`
**Tabs** — props: `tabs: {id, label}[], activeTab, onChange`

Design tokens (use Tailwind classes):
- Dark bg: `bg-slate-950`, cards: `bg-slate-900`, borders: `border-slate-800`
- Light bg: `bg-slate-50`, cards: `bg-white`, borders: `border-slate-200`
- Accent: `blue-600`, success: `green-600`, danger: `red-600`, purple: `violet-500`
- Font: `font-mono` for numbers, system sans for labels

### Step 4: Layout Shell
- Navbar with links to each calculator
- Mobile hamburger menu
- Footer with disclaimer
- React Router with routes for each calculator

### Step 5: Port Offset vs DR Calculator
The existing calculator code is in `reference/offset-vs-debt-recycling.jsx`. Port it into the new structure:
- Extract financial logic into `engine.ts` (pure functions)
- Write tests in `engine.test.ts`
- Build the UI using shared components
- All parameters configurable

### Steps 6-12: Build Each Calculator
Follow the specs in `docs/CALCULATOR_SPECS.md` for each module.

---

## Coding Standards

### Financial Engine Rules
1. **All financial calculations go in `engine.ts` files** — pure functions, no React, no side effects
2. **Every engine function must have a corresponding test** in `engine.test.ts`
3. **Use monthly compounding** unless explicitly stated otherwise
4. **All monetary values are in AUD cents internally** to avoid floating point issues (display in dollars)
5. **Never hardcode tax rates or thresholds** — always reference `src/data/` files
6. **Document every assumption** in JSDoc comments on engine functions

### UI Rules
1. **All calculators must support light and dark mode**
2. **All numeric inputs must have sensible min/max/step constraints**
3. **Every calculator must have a Disclaimer component at the bottom**
4. **Every calculator must have a collapsible Assumptions section**
5. **Use Recharts for charts** — LineChart for trajectories, BarChart for comparisons
6. **Mobile responsive** — calculators must work on 375px width
7. **No localStorage, no cookies** — use URL params for state persistence via `useUrlParams` hook

### TypeScript Rules
1. **Strict mode enabled** — no `any` types
2. **All engine function params and returns must be typed**
3. **Use interfaces for calculator state, not inline types**

---

## Australian Financial Data Reference

These values must be stored in `src/data/` and imported by engines. NEVER hardcode them.

### Tax Brackets 2024-25 (src/data/tax-brackets.ts)
```typescript
export const TAX_BRACKETS_2024_25 = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18201, max: 45000, rate: 0.16 },
  { min: 45001, max: 135000, rate: 0.30 },
  { min: 135001, max: 190000, rate: 0.37 },
  { min: 190001, max: Infinity, rate: 0.45 },
];

export const MEDICARE_LEVY_RATE = 0.02;
export const MEDICARE_LEVY_SURCHARGE_THRESHOLDS = {
  single: { tier1: 93000, tier2: 108000, tier3: 144000 },
  rates: { tier1: 0.01, tier2: 0.0125, tier3: 0.015 },
};
```

### Super Rules (src/data/super-rules.ts)
```typescript
export const SUPER_RULES = {
  sgRate: 0.12,                           // 12% from 1 July 2025
  concessionalCap: 30000,                 // Annual concessional contribution cap
  nonConcessionalCap: 120000,             // Annual non-concessional cap
  bringForwardCap: 360000,               // 3-year bring-forward
  taxRateInSuper: 0.15,                  // Concessional contributions tax
  division293Threshold: 250000,          // Extra 15% on concessional contribs
  preservationAge: 60,                   // For those born after 1 July 1964
  transferBalanceCap: 1900000,           // 2024-25 general TBC
  carryForwardYears: 5,                  // Unused concessional cap carry-forward
  totalSuperBalanceThreshold: 500000,    // Must be under this to use carry-forward
};
```

### Stamp Duty — Victoria (src/data/stamp-duty-tables.ts)
```typescript
export const VIC_STAMP_DUTY = {
  general: [
    { min: 0, max: 25000, rate: 0.014, base: 0 },
    { min: 25001, max: 130000, rate: 0.024, base: 350 },
    { min: 130001, max: 960000, rate: 0.06, base: 2870 },
    { min: 960001, max: Infinity, rate: 0.055, base: 52670 },
  ],
  firstHomeBuyer: {
    dutyExemptionThreshold: 600000,      // Full exemption under $600k
    dutyReductionThreshold: 750000,      // Sliding scale $600k-$750k
    fhogAmount: 10000,                   // First Home Owner Grant (new homes only)
    fhogPriceCapNew: 750000,
  },
};

// Add NSW, QLD, WA, SA, TAS, ACT, NT tables following same pattern
```

### Constants (src/data/constants.ts)
```typescript
export const HELP_REPAYMENT_THRESHOLDS_2024_25 = [
  { min: 0, max: 54434, rate: 0 },
  { min: 54435, max: 62850, rate: 0.01 },
  { min: 62851, max: 66620, rate: 0.02 },
  { min: 66621, max: 70618, rate: 0.025 },
  // ... continue per ATO schedule
  { min: 151201, max: Infinity, rate: 0.10 },
];

export const CGT_DISCOUNT_INDIVIDUAL = 0.50;    // 50% discount for assets held >12 months
export const CGT_DISCOUNT_SUPER = 0.3333;       // 33.33% discount in super
export const CGT_DISCOUNT_COMPANY = 0;           // No discount for companies
```

---

## Calculator Specifications

Detailed specs for each calculator are in `docs/CALCULATOR_SPECS.md`.

---

## Testing

Run tests with:
```bash
npx vitest
```

### What to test:
- **Every engine function** — inputs → expected outputs
- **Edge cases:** zero values, maximum values, division by zero guards
- **Known-answer tests:** manually calculated scenarios that verify the math

### Example test:
```typescript
// engine.test.ts
import { describe, it, expect } from 'vitest';
import { monthlyRepayment, runOffset } from './engine';

describe('monthlyRepayment', () => {
  it('calculates correctly for $500k at 6% over 30 years', () => {
    const result = monthlyRepayment(500000, 6, 30);
    expect(result).toBeCloseTo(2997.75, 0);
  });

  it('handles zero interest rate', () => {
    const result = monthlyRepayment(120000, 0, 10);
    expect(result).toBe(1000);
  });
});
```

---

## Deployment

### Vercel (Primary)
1. Connect GitHub repo to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Auto-deploys on push to `main`

### GitHub Pages (Fallback)
GitHub Actions workflow in `.github/workflows/deploy.yml` — see scaffold step.

Set `base` in `vite.config.ts` if using GitHub Pages:
```ts
export default defineConfig({
  base: '/ausfintools/',
  // ...
})
```

---

## Commit Convention

Use conventional commits:
```
feat(offset-dr): add year-by-year comparison chart
fix(tax): correct Division 293 threshold
docs: update README with calculator descriptions
refactor(ui): extract StatCard into shared component
test(fire): add Coast FIRE engine tests
```

---

## Important Reminders

1. **This is NOT financial advice** — every page must have a disclaimer
2. **All financial data has a tax year** — display "Based on 2024-25 ATO rates" prominently
3. **Australian context only** — no US/UK tax concepts
4. **Privacy first** — zero tracking, zero cookies, zero external API calls
5. **The financial math must be correct** — test thoroughly, document assumptions
6. **Mobile responsive** — many users will access on phones
7. **URL-shareable scenarios** — encode key params in URL so users can share specific calculations
