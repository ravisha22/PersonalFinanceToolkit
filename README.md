# AusFinTools

> Free, open-source, privacy-first suite of Australian personal finance calculators.

[![Build](https://github.com/ravisha22/PersonalFinanceToolkit/actions/workflows/deploy.yml/badge.svg)](https://github.com/ravisha22/PersonalFinanceToolkit/actions/workflows/deploy.yml)
![Based on 2024-25 ATO rates](https://img.shields.io/badge/ATO%20rates-2024--25-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green)
![No tracking](https://img.shields.io/badge/privacy-no%20tracking-brightgreen)

---

## What is this?

AusFinTools is a collection of calculators built specifically for **Australian** workers and investors. All calculations run entirely in your browser — no sign-up, no data collection, no backend.

Most open-source finance tools are US-centric. AusFinTools uses:
- **2024-25 ATO tax brackets** (Stage 3 cuts)
- **Australian super rules** (12% SG, $30k concessional cap, preservation age 60)
- **State-specific stamp duty** (VIC, NSW full tables; QLD, WA stubs)
- **APRA serviceability buffer** (3% above mortgage rate)
- **Australian CGT discount** (50% for individuals, 33.33% super)

---

## Calculators

| Calculator | Description |
|---|---|
| **Offset vs Debt Recycling** | Compare parking cash in your mortgage offset vs investing via debt recycling |
| **Direct Investing vs DR** | Unlevered investing vs debt recycling — find your breakeven ETF return |
| **Tax Savings Guide** | Super salary sacrifice, DR tax deductions, negative gearing, tax bracket visualiser |
| **House Affordability** | Borrowing capacity, stamp duty by state, LMI, and true monthly ownership cost |
| **FIRE Suite** | Classic, Coast, Barista, Lean/Fat FIRE + Australian Super Bridge calculator |
| **Investment Comparison** | Compare up to 4 scenarios with different tax treatments and fees |
| **Savings Rate Impact** | How your savings rate drives your years to financial independence |
| **Property Research Tool** | 130-point investment property checklist with suburb + location + property scoring |

---

## Tech Stack

- **Framework:** Vite 7 + React 19 + TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (utility classes, dark/light mode)
- **Routing:** React Router v7 (client-side SPA, lazy-loaded routes)
- **Charts:** Recharts 3
- **Testing:** Vitest 4 (73 engine tests)
- **Hosting:** GitHub Pages (via GitHub Actions)

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Production build
npm run build
```

**Requirements:** Node 20+

---

## Project Structure

```
src/
├── data/           # Australian financial constants (tax, super, stamp duty, HELP)
├── utils/          # Shared math (monthlyRepayment, futureValue, etc.) + formatters
├── hooks/          # useTheme (URL param), useUrlParams (state sync)
├── components/     # Shared UI: SliderControl, StatCard, Tabs, Navbar, Disclaimer, etc.
├── pages/          # Landing page
└── calculators/    # One directory per calculator: engine.ts, engine.test.ts, UI.tsx
```

---

## Australian Financial Data

All rates are sourced from ATO and stored in `src/data/`. **Never hardcoded in engines.**

- `tax-brackets.ts` — 2024-25 income tax brackets + Medicare levy
- `super-rules.ts` — SG rate, concessional cap, Division 293, carry-forward
- `stamp-duty-tables.ts` — VIC + NSW full tables, QLD + WA stubs
- `constants.ts` — HELP repayment thresholds, CGT discount rates

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

To update tax tables for a new financial year, edit `src/data/` and update the `CURRENT_TAX_YEAR` constant in `src/data/constants.ts`.

---

## Disclaimer

**This is NOT financial advice.** AusFinTools is an educational tool only. All calculations are estimates based on 2024-25 ATO rates and may not reflect your personal circumstances. Always consult a licensed Australian financial adviser (AFS licence holder) before acting.

---

## Licence

MIT — see [LICENSE](./LICENSE).
