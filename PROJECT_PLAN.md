# AusFinTools — Australian Personal Finance Toolkit
## Project Plan & Architecture

---

## 1. Vision

A free, open-source, privacy-first suite of Australian personal finance calculators — hosted on GitHub, deployed to a free platform, with zero backend dependencies. All computation runs client-side. No accounts, no tracking, no ads.

**Target audience:** Australian workers and investors making decisions about mortgages, tax, investing, superannuation, and FIRE planning.

**Differentiator:** Everything is Australia-specific (tax brackets, super rules, CGT discount, Medicare levy, negative gearing, stamp duty by state) — most open-source finance tools are US-centric.

---

## 2. Calculator Modules

### 2.1 Offset vs Debt Recycling ✅ (Already Built)
Compare parking cash in an offset account vs debt recycling into ETFs.

**Inputs:** Loan amount, rate, term, ETF return, dividend yield, marginal tax, CGT discount, lump-sum amounts.

**Outputs:** Year-by-year net wealth comparison, interest savings, tax deductions, portfolio growth, CGT liability.

**Status:** Complete. Needs integration into the shell.

---

### 2.2 Direct Investing vs Debt Recycling (NEW)
Compare investing the same lump sum directly (no leverage) vs via debt recycling.

**Inputs:**
- Lump sum amount
- ETF expected return & dividend yield
- Mortgage rate (for DR cost-of-leverage calculation)
- Marginal tax rate, CGT discount
- Investment horizon

**Outputs:**
- Direct invest: portfolio value, CGT on exit, after-tax return
- Debt recycling: portfolio value, tax deductions earned, CGT on exit, net cost of leverage
- Breakeven analysis: at what return rate does DR outperform direct investing?
- Year-by-year wealth comparison chart

**Key insight this surfaces:** DR's advantage is the tax arbitrage — the interest is deductible. Direct investing avoids leverage risk. The breakeven depends on marginal tax rate and mortgage rate.

---

### 2.3 Australian Tax Savings Guide (NEW)
Interactive walkthrough of the most common tax optimisation strategies, with calculators for each.

**Sub-modules:**

#### a) Superannuation Salary Sacrifice Calculator
- Inputs: salary, current super balance, employer SG rate, additional concessional contributions, carry-forward unused cap (last 5 years), age, retirement age
- Outputs: tax saved now, projected super balance at retirement, comparison of salary sacrifice vs take-home investing, preservation age implications
- Rules engine: $30k concessional cap (2024-25), carry-forward rules, Division 293 tax for >$250k income

#### b) Debt Recycling Tax Benefit Estimator
- Simplified version of the full DR calculator focused purely on the tax deduction
- Inputs: investment loan balance, interest rate, marginal tax rate
- Outputs: annual tax deduction, effective after-tax borrowing cost, 5/10/15 year cumulative deductions

#### c) Negative Gearing (IP) Tax Estimator
- Inputs: property value, rental income, mortgage rate, LVR, expenses (council rates, insurance, property management, maintenance, depreciation)
- Outputs: annual cash flow, taxable income impact, tax refund/cost, net position after tax

#### d) Tax Bracket Visualiser
- Interactive chart showing effective tax rate at any income level
- Includes Medicare levy, Medicare levy surcharge, LMITO (if applicable), HELP debt repayment thresholds
- Shows marginal vs average rate clearly

---

### 2.4 House Purchasing Affordability Calculator (NEW)
"Can I afford this house?" — comprehensive Australian mortgage affordability tool.

**Inputs:**
- Gross household income (single or dual)
- Existing debts (HELP, car loan, credit cards)
- Deposit / savings amount
- State (for stamp duty calculation)
- First home buyer? (stamp duty concessions)
- Number of dependents
- Lifestyle expenses estimate

**Outputs:**
- Maximum borrowing capacity (using APRA's 3% serviceability buffer methodology)
- Stamp duty calculation (state-specific: VIC, NSW, QLD, WA, SA, TAS, ACT, NT)
- First home buyer concessions applied
- Lenders Mortgage Insurance estimate (if LVR > 80%)
- Monthly repayment breakdown: P&I, council rates, water, insurance, strata
- Total true monthly cost of ownership
- Affordability ratio (housing cost as % of income)
- Buffer analysis: what if rates rise 1%, 2%, 3%?

**State rules engine:**
- Victoria: stamp duty table, first home buyer duty exemption (<$600k), First Home Owner Grant
- NSW: stamp duty table, first home buyer exemptions, surcharges
- QLD: transfer duty, first home concession, FHOG
- (Lookup tables for each state/territory)

---

### 2.5 Property Research Tool (Existing Skill — Adapted)
Integration of your IP Hunter Pro 130-point framework.

**This module is different:** it's a guided checklist + scoring tool rather than a pure calculator. It would work as:
- User inputs a suburb + property address
- Tool provides a structured 130-point checklist across 3 layers (suburb, intra-suburb, property)
- Each criterion is scored and weighted
- Aggregated into a Buy/Hold/Avoid recommendation
- Links to the 30+ data sources (Domain, SQM, VicPlan, MySchool, Microburbs etc.)

**Implementation note:** This can't auto-scrape those sites (TOS issues), but it CAN provide a structured form with links that open each source in a new tab, plus a scoring calculator.

---

### 2.6 FIRE Calculator Suite (NEW)
Multiple FIRE models in one place, all adapted for Australian context (super, tax).

#### a) Classic FIRE (4% Rule / Trinity Study)
- Inputs: current age, target retirement age, annual expenses in retirement, current savings, annual savings rate, expected return
- Outputs: FIRE number (expenses × 25), years to FIRE, projected savings trajectory chart
- Shows: safe withdrawal rate sensitivity (3%, 3.5%, 4%, 4.5%)

#### b) Coast FIRE
- "I have enough invested — compound growth will get me to my FIRE number even if I stop saving"
- Inputs: current investments, target FIRE number, expected return, target retirement age
- Outputs: coast FIRE number at current age, whether you've already hit it, how much more you need

#### c) Barista FIRE
- Part-time work covering expenses, investments left to grow
- Inputs: current investments, part-time income, annual expenses, expected return
- Outputs: can you cover the gap? When does your portfolio reach full FIRE?

#### d) Lean FIRE vs Fat FIRE Comparison
- Side-by-side comparison at different expense levels
- Shows the tradeoff between lifestyle and years to FIRE

#### e) Australian Super Integration
- Critical differentiator: models the gap between early retirement and preservation age (60)
- Splits projections into: pre-preservation (need non-super funds) and post-preservation (super kicks in)
- Inputs: current super balance, non-super investments, SG rate, salary sacrifice amount
- Outputs: dual-track projection showing when non-super runs out, when super access begins, whether the bridge is funded

#### f) Monte Carlo Simulation (Stretch Goal)
- Instead of smooth returns, run 1000+ simulations using historical return distributions
- Show success rate (% of scenarios where money lasts)
- This is the "Luxemburg Model" you mentioned — likely referring to the ERN (Early Retirement Now) safe withdrawal rate series methodology

---

### 2.7 Investment Comparison Calculator (NEW)
General-purpose tool for comparing investment options side by side.

**Inputs (per scenario, up to 4):**
- Initial investment
- Regular contributions (monthly/annual)
- Expected return
- Fee/MER drag
- Tax treatment (taxed at marginal rate, in super at 15%, tax-free)
- Time horizon

**Outputs:**
- Final value for each scenario
- Impact of fees over time ($ cost of fees)
- After-tax returns
- Chart showing divergence over time

**Use case:** Compare DHHF vs VDHG, or ETF vs super vs savings account vs IP.

---

### 2.8 Savings Rate Impact Calculator (NEW — Simple)
How does your savings rate affect your time to financial independence?

Based on the classic Mr Money Mustache chart — but interactive and Australian-tax-aware.

**Inputs:** Income, savings rate, current net worth, expected return, annual expenses
**Outputs:** Years to FIRE at current rate, interactive slider showing how each 5% savings rate increase shaves years off

---

## 3. Architecture

### Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Vite + React + TypeScript** | Fast builds, tree-shaking, type safety |
| Styling | **Tailwind CSS** | Utility-first, small bundle, consistent design system |
| Routing | **React Router** | Client-side routing for SPA |
| Charts | **Recharts** | React-native charting, lightweight |
| State | **React state (useState/useReducer)** | No external state library needed — each calculator is self-contained |
| Hosting | **GitHub Pages** or **Vercel (free)** | Zero cost, auto-deploy from GitHub |
| CI/CD | **GitHub Actions** | Build + deploy on push to main |
| Analytics | **None** (privacy-first) | Optional: self-hosted Plausible or Umami if desired later |

### Why NOT Next.js?
These are pure client-side calculators with no SSR, no API routes, no database. Vite + React is simpler, faster to build, and deploys to any static host. No server-side rendering overhead.

### Project Structure

```
ausfintools/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── App.tsx                     # Router + layout shell
│   ├── main.tsx                    # Entry point
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Top nav with calculator links
│   │   │   ├── Footer.tsx          # Disclaimer + links
│   │   │   └── ThemeToggle.tsx     # Light/dark mode
│   │   ├── ui/
│   │   │   ├── Slider.tsx          # Reusable slider control
│   │   │   ├── NumberInput.tsx     # Reusable number input
│   │   │   ├── StatCard.tsx        # Metric display card
│   │   │   ├── ComparisonTable.tsx # Side-by-side table
│   │   │   └── BarChart.tsx        # Horizontal bar chart
│   │   └── shared/
│   │       ├── Disclaimer.tsx      # Standard financial disclaimer
│   │       └── Assumptions.tsx     # Collapsible assumptions panel
│   ├── calculators/
│   │   ├── offset-vs-dr/
│   │   │   ├── OffsetVsDR.tsx      # Main page component
│   │   │   ├── engine.ts           # Financial computation functions
│   │   │   └── types.ts            # TypeScript interfaces
│   │   ├── direct-vs-dr/
│   │   │   ├── DirectVsDR.tsx
│   │   │   └── engine.ts
│   │   ├── tax-savings/
│   │   │   ├── TaxSavingsGuide.tsx # Parent with sub-tabs
│   │   │   ├── SuperSalarySacrifice.tsx
│   │   │   ├── DebtRecyclingTax.tsx
│   │   │   ├── NegativeGearing.tsx
│   │   │   ├── TaxBracketVis.tsx
│   │   │   └── engine.ts
│   │   ├── house-affordability/
│   │   │   ├── HouseAffordability.tsx
│   │   │   ├── engine.ts
│   │   │   └── stamp-duty.ts       # State-specific lookup tables
│   │   ├── property-research/
│   │   │   ├── PropertyResearch.tsx
│   │   │   ├── checklist.ts        # 130-point framework data
│   │   │   └── scoring.ts
│   │   ├── fire/
│   │   │   ├── FIREDashboard.tsx   # Parent with sub-tabs
│   │   │   ├── ClassicFIRE.tsx
│   │   │   ├── CoastFIRE.tsx
│   │   │   ├── BaristaFIRE.tsx
│   │   │   ├── LeanVsFat.tsx
│   │   │   ├── SuperBridge.tsx     # Australian super preservation gap
│   │   │   └── engine.ts
│   │   ├── investment-compare/
│   │   │   ├── InvestmentCompare.tsx
│   │   │   └── engine.ts
│   │   └── savings-rate/
│   │       ├── SavingsRate.tsx
│   │       └── engine.ts
│   ├── data/
│   │   ├── tax-brackets.ts        # Australian tax brackets 2024-25
│   │   ├── super-rules.ts         # Concessional caps, SG rate, preservation age
│   │   ├── stamp-duty-tables.ts   # By state/territory
│   │   └── constants.ts           # Medicare levy, HELP thresholds, etc.
│   ├── hooks/
│   │   ├── useTheme.ts            # Dark/light mode
│   │   └── useUrlParams.ts        # Shareable calculator state via URL params
│   ├── utils/
│   │   ├── formatters.ts          # Currency, percentage formatters
│   │   └── financial.ts           # Shared financial math (compound interest, etc.)
│   └── styles/
│       └── globals.css            # Tailwind imports + custom CSS vars
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions: build + deploy
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

### Key Architectural Decisions

1. **Each calculator is self-contained** — own engine.ts (pure functions, testable), own page component, own types. Can be developed and tested independently.

2. **Shared UI library** — all calculators use the same Slider, NumberInput, StatCard, and chart components. Consistent UX across the suite.

3. **URL state persistence** — via `useUrlParams` hook. Users can share a specific scenario by copying the URL (e.g., `?loan=925000&rate=5.7&term=15`). No localStorage needed.

4. **Data layer for Australian rules** — tax brackets, super rules, stamp duty tables are centralised in `src/data/`. When the ATO updates brackets (typically July each year), you update one file.

5. **No backend, no database, no auth** — everything is client-side. Zero operational cost. Zero privacy risk.

---

## 4. Hosting & Deployment

### Recommended: Vercel (Free Tier)

| Feature | Vercel Free | GitHub Pages |
|---|---|---|
| Custom domain | ✅ Free SSL | ✅ Free SSL |
| Auto-deploy from GitHub | ✅ On push | ✅ Via Actions |
| Preview deployments | ✅ Per PR | ❌ |
| Bandwidth | 100 GB/month | 100 GB/month |
| Build framework support | ✅ Vite native | Manual config |
| Analytics | ✅ Web vitals | ❌ |

**Recommendation:** Use **Vercel** for production (better DX, preview deploys, built-in analytics) with **GitHub Pages** as a fallback or mirror.

### Deploy Setup

```yaml
# .github/workflows/deploy.yml (for GitHub Pages)
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

For Vercel: just connect the GitHub repo — zero config needed for Vite.

---

## 5. Build Phases

### Phase 1 — Foundation (Week 1)
- [ ] Set up Vite + React + TypeScript + Tailwind project
- [ ] Build shared component library (Slider, NumberInput, StatCard, etc.)
- [ ] Implement theme system (light/dark)
- [ ] Set up React Router with nav shell
- [ ] Port existing Offset vs DR calculator into the new structure
- [ ] Deploy to Vercel/GitHub Pages
- [ ] Write README + CONTRIBUTING.md

### Phase 2 — Core Calculators (Weeks 2-3)
- [ ] House Affordability Calculator (with stamp duty engine)
- [ ] Tax Savings Guide (super salary sacrifice + tax bracket visualiser)
- [ ] Direct Investing vs Debt Recycling
- [ ] FIRE Classic (4% rule) + Coast FIRE

### Phase 3 — Advanced Calculators (Weeks 3-4)
- [ ] FIRE: Barista FIRE, Lean vs Fat, Super Bridge
- [ ] Negative Gearing Tax Estimator
- [ ] Investment Comparison Calculator
- [ ] Savings Rate Impact Calculator

### Phase 4 — Polish & Property (Week 5)
- [ ] Property Research Tool (checklist + scoring)
- [ ] URL sharing for all calculators
- [ ] Mobile responsiveness pass
- [ ] Accessibility audit (aria labels, keyboard nav)
- [ ] SEO metadata (title, description, OG tags per calculator)

### Phase 5 — Stretch Goals
- [ ] Monte Carlo simulation for FIRE
- [ ] PDF export of scenarios
- [ ] "Compare my scenario" — save multiple param sets and compare side by side
- [ ] PWA support (installable on mobile)

---

## 6. Feasibility Assessment

### Difficulty Rating by Module

| Module | Complexity | Effort | Key Challenge |
|---|---|---|---|
| Offset vs DR | ★★★☆☆ | ✅ Done | Financial engine already built |
| Direct vs DR | ★★☆☆☆ | 2-3 hours | Simplified variant of above |
| Super Salary Sacrifice | ★★★☆☆ | 4-5 hours | Carry-forward rules, Division 293 |
| Tax Bracket Visualiser | ★★☆☆☆ | 2-3 hours | Data entry + chart |
| House Affordability | ★★★★☆ | 8-10 hours | State-specific stamp duty, LMI calc, APRA buffer |
| Property Research | ★★★★☆ | 6-8 hours | 130-point framework data entry, scoring logic |
| FIRE Classic + Coast | ★★☆☆☆ | 3-4 hours | Standard formulas |
| FIRE Super Bridge | ★★★★☆ | 5-6 hours | Dual-track modelling, preservation age logic |
| Barista / Lean-Fat | ★★☆☆☆ | 2-3 hours | Variants of classic FIRE |
| Investment Compare | ★★☆☆☆ | 3-4 hours | Multiple scenario state management |
| Negative Gearing | ★★★☆☆ | 4-5 hours | Depreciation schedules, expense categories |
| Savings Rate Impact | ★☆☆☆☆ | 1-2 hours | Simple maths, nice chart |
| Monte Carlo | ★★★★★ | 8-10 hours | Statistical engine, performance optimisation |
| Shell + shared UI | ★★★☆☆ | 6-8 hours | Design system, routing, theme, responsive |

### Total Estimated Effort: ~60-80 hours of focused development

### Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Australian tax rules change annually | Medium | Centralised data files, version by tax year, add last-updated date |
| Stamp duty tables are complex | Medium | Start with VIC + NSW, add states incrementally |
| Users mistake tool for financial advice | High | Prominent disclaimers on every page, "not financial advice" in footer |
| Scope creep (adding more calculators) | Medium | Modular architecture — each calculator is independent |
| Maintenance burden | Low | No backend, no database, no API keys. Only update: tax tables once a year |

---

## 7. What Makes This Different

Most existing tools are:
- **US-centric** (401k, Roth IRA, Social Security — useless for Australians)
- **Behind paywalls** (Frollo, PocketSmith, WeMoney premium features)
- **Single-purpose** (one FIRE calculator OR one mortgage calculator, never integrated)
- **Not open source** (can't verify the maths, can't contribute)

AusFinTools would be:
- **100% Australian context** — tax brackets, super rules, stamp duty by state, Medicare levy, CGT discount, negative gearing
- **Free and open source** — MIT licensed, all code on GitHub
- **Privacy-first** — zero tracking, zero data collection, runs entirely in the browser
- **Integrated** — all calculators in one place with consistent UX
- **Shareable** — URL-encoded scenarios you can send to your partner or adviser
- **Transparent** — every assumption documented, every formula visible in source

---

## 8. Naming & Branding Options

| Name | Domain availability | Vibe |
|---|---|---|
| **AusFinTools** | ausfintools.com | Professional, descriptive |
| **OzCalc** | ozcalc.com | Short, catchy |
| **FinStack.au** | finstack.au | Modern, techy |
| **MoneyMaths** | moneymaths.au | Approachable |
| **DollarBoard** | dollarboard.com | Visual metaphor |

---

## 9. Next Steps

1. **Confirm scope** — which calculators to include in v1.0 vs later
2. **Scaffold the project** — Vite + React + TS + Tailwind + Router
3. **Build shared component library** — the UI primitives
4. **Port the offset vs DR calculator** as the first module
5. **Build one new calculator at a time**, testing each before moving on
6. **Deploy to Vercel** from day one (so you always have a live URL)

---

*This document was generated as a planning artifact. It should be treated as a living document and updated as the project evolves.*
