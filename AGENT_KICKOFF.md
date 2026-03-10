# Agent Kickoff Prompt

Copy-paste this into your Claude Code agent to start the build. Run it from the repo root directory.

---

## Prompt

```
Read CLAUDE.md and docs/CALCULATOR_SPECS.md in this repo. These contain the full project specification for AusFinTools — an Australian personal finance calculator suite.

Execute the build in this order:

1. **Scaffold the project:**
   - Initialize Vite + React + TypeScript in the current directory
   - Install dependencies: react-router-dom, recharts, tailwindcss, @tailwindcss/vite, vitest
   - Configure Tailwind v4 via Vite plugin
   - Configure Vitest
   - Set up the project structure as defined in CLAUDE.md

2. **Build the shared component library:**
   - Create all components in src/components/ui/ (SliderControl, NumberInput, StatCard, Tabs, BarCompare)
   - Create Layout, Navbar, Footer in src/components/layout/
   - Create Disclaimer and Assumptions in src/components/shared/
   - Implement the theme system (useTheme hook with dark class on html)
   - All components must support light and dark mode

3. **Set up routing:**
   - Create App.tsx with React Router
   - Add routes for all 8 calculators
   - Create a landing page (/) with cards linking to each calculator
   - Navbar should show all calculator links

4. **Set up Australian data files:**
   - Create src/data/tax-brackets.ts with 2024-25 brackets
   - Create src/data/super-rules.ts
   - Create src/data/stamp-duty-tables.ts (VIC and NSW to start)
   - Create src/data/constants.ts (Medicare, HELP, CGT)
   - Create src/utils/formatters.ts and src/utils/financial.ts

5. **Port the Offset vs DR calculator:**
   - Reference implementation is in reference/offset-vs-debt-recycling.jsx
   - Extract engine logic into src/calculators/offset-vs-dr/engine.ts
   - Write tests in engine.test.ts
   - Build the UI using shared components
   - Verify all functionality works

6. **Build calculators in this order** (follow specs in docs/CALCULATOR_SPECS.md):
   a. Direct Investing vs Debt Recycling
   b. Tax Savings Guide (all 4 sub-tabs)
   c. House Purchasing Affordability
   d. FIRE Calculator Suite (all 5 sub-tabs)
   e. Investment Comparison
   f. Savings Rate Impact
   g. Property Research Tool (checklist + scoring)

7. **After each calculator:**
   - Run `npx vitest` to verify engine tests pass
   - Run `npm run build` to verify no build errors
   - Commit with conventional commit message

8. **Final steps:**
   - Create README.md with project description, screenshots placeholder, usage instructions
   - Create LICENSE (MIT)
   - Create CONTRIBUTING.md
   - Create .github/workflows/deploy.yml for GitHub Pages deployment
   - Run full test suite
   - Run production build

Commit after each major step. Use conventional commit messages (feat, fix, docs, refactor, test).
```

---

## Alternative: Step-by-Step Prompts

If the agent struggles with the full prompt above, break it into sequential prompts:

### Prompt 1: Scaffold
```
Read CLAUDE.md. Scaffold the Vite + React + TypeScript project with all dependencies. Set up Tailwind v4 via Vite plugin, Vitest, and the full directory structure from CLAUDE.md. Create the Australian data files in src/data/ with the tax brackets, super rules, and stamp duty tables from CLAUDE.md. Don't build any calculators yet.
```

### Prompt 2: Shared UI
```
Read CLAUDE.md. Build all shared components: SliderControl, NumberInput, StatCard, Tabs, BarCompare, Layout, Navbar, Footer, Disclaimer, Assumptions. Implement the useTheme hook (dark/light mode). Set up React Router with placeholder pages for all 8 calculators. Create a landing page with cards for each calculator.
```

### Prompt 3: Offset vs DR
```
Read CLAUDE.md and docs/CALCULATOR_SPECS.md section 1. Port the reference implementation in reference/offset-vs-debt-recycling.jsx into the new structure. Extract engine into engine.ts with types. Write comprehensive tests in engine.test.ts. Build the UI page using shared components.
```

### Prompt 4: Direct vs DR + Tax Savings
```
Read docs/CALCULATOR_SPECS.md sections 2 and 3. Build the Direct vs DR calculator and the Tax Savings Guide (all 4 sub-tabs: Super Salary Sacrifice, DR Tax Benefit, Negative Gearing, Tax Bracket Visualiser). Write engine tests for all.
```

### Prompt 5: House Affordability
```
Read docs/CALCULATOR_SPECS.md section 4. Build the House Purchasing Affordability calculator with stamp duty engine (VIC + NSW), LMI estimation, APRA serviceability buffer methodology, and monthly cost breakdown. Write engine tests.
```

### Prompt 6: FIRE Suite
```
Read docs/CALCULATOR_SPECS.md section 6. Build the FIRE Calculator Suite with all 5 sub-tabs: Classic FIRE, Coast FIRE, Barista FIRE, Lean vs Fat, and Australian Super Bridge. The Super Bridge is the most important — it models the gap between early retirement and preservation age 60. Write engine tests.
```

### Prompt 7: Remaining + Polish
```
Read docs/CALCULATOR_SPECS.md sections 7 and 8. Build Investment Comparison and Savings Rate Impact calculators. Then build the Property Research Tool (section 5) as a guided checklist with scoring. Finally, create README.md, LICENSE, CONTRIBUTING.md, and the GitHub Actions deploy workflow. Run the full test suite and production build.
```

---

## Verification Checklist

After the build is complete, verify:

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` produces a clean build
- [ ] `npx vitest` — all tests pass
- [ ] All 8 calculators render correctly
- [ ] Light/dark mode toggle works globally
- [ ] Mobile responsive (test at 375px width)
- [ ] Every calculator has Disclaimer at bottom
- [ ] Every calculator has Assumptions section
- [ ] URL params work (change params, copy URL, paste in new tab → same state)
- [ ] Stamp duty calc matches VIC SRO online calculator for a test case
- [ ] Super salary sacrifice calc handles Division 293 correctly
- [ ] FIRE Super Bridge correctly shows gap between early retirement and preservation age
