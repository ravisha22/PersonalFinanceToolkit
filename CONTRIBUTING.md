# Contributing to AusFinTools

Thanks for helping improve Australia's best open-source finance calculator suite.

---

## Getting Started

```bash
git clone https://github.com/ravisha22/PersonalFinanceToolkit.git
cd PersonalFinanceToolkit
npm install
npm run dev
```

---

## How to Contribute

### Updating Tax Tables (most common)

Australian tax rates change each financial year. To update:

1. Edit `src/data/tax-brackets.ts` with new ATO brackets
2. Update `CURRENT_TAX_YEAR` in `src/data/constants.ts`
3. Update `HELP_REPAYMENT_THRESHOLDS_2024_25` in `src/data/constants.ts` if thresholds changed
4. Update `SUPER_RULES.sgRate` in `src/data/super-rules.ts` if SG rate increased
5. Run `npm test` to ensure all existing tests still pass
6. Add a new test case if a new rule was introduced

### Adding a State Stamp Duty Table

`src/data/stamp-duty-tables.ts` has stubs for QLD, WA, SA, TAS, ACT, NT. To implement:

1. Find the relevant state revenue office rate schedule
2. Fill in the `DutyBracket[]` array and `FHBConcession` object
3. Replace the stub assignment in `STATE_TABLES`
4. Add test cases to `src/calculators/house-affordability/engine.test.ts`

### Adding a New Calculator

1. Create `src/calculators/your-calc/` with:
   - `types.ts` — interfaces for params and results
   - `engine.ts` — pure functions, no React, import from `src/data/` and `src/utils/`
   - `engine.test.ts` — at minimum 3 test cases with known-answer validation
   - `YourCalc.tsx` — UI using shared components from `src/components/`
2. Add a route in `src/App.tsx`
3. Add a nav item in `src/components/layout/Navbar.tsx`
4. Add a landing card in `src/pages/Landing.tsx`

---

## Code Standards

- **No `any` types** — TypeScript strict mode is enforced
- **No inline styles** — Tailwind CSS classes only
- **No hardcoded rates** — always import from `src/data/`
- **Every engine function needs a test** — pure functions are easy to test
- **Every calculator page needs `<Disclaimer />` and `<Assumptions />`**
- **Dark + light mode** — use `dark:` Tailwind prefix throughout
- **Mobile responsive** — test at 375px width

---

## Running Tests

```bash
npm test           # run once
npm run test:watch # watch mode
npm run test:ui    # Vitest UI browser
```

---

## Commit Convention

```
feat(calc-name): add description
fix(tax): correct Medicare levy threshold
docs: update README
refactor(ui): extract StatCard variant
test(fire): add SuperBridge edge case
```

---

## Disclaimer

All contributions must maintain the educational-only framing. No calculator should produce output that could be construed as personalised financial advice.
