# Australian Personal Finance Tools — User Persona & Flow Analysis

**Version:** 1.0 — March 2026
**Purpose:** Market research to inform user experience design, navigation ordering, and feature prioritisation
**Scope:** Australian working adults aged 22–65 using a free, privacy-first personal finance calculator suite

---

## Table of Contents

1. [Australian Personal Finance Landscape](#1-australian-personal-finance-landscape)
2. [Income & Tax Profile](#2-income--tax-profile)
3. [Superannuation Landscape](#3-superannuation-landscape)
4. [Property & Housing](#4-property--housing)
5. [Investment Behaviour](#5-investment-behaviour)
6. [User Persona Definitions](#6-user-persona-definitions)
7. [User Journey Analysis — Tool Relevance by Persona](#7-user-journey-analysis--tool-relevance-by-persona)
8. [Recommended Navigation Order & Rationale](#8-recommended-navigation-order--rationale)
9. [Cross-Links Between Tools](#9-cross-links-between-tools)
10. [Data Sources & Methodology](#10-data-sources--methodology)

---

## 1. Australian Personal Finance Landscape

Australia has a distinctive personal finance environment shaped by three structural factors that make locally-specific tools essential:

**1. Compulsory superannuation.** Australia operates a mandated employer super contribution system (12% of wages from 1 July 2025). With $4.49 trillion in total super assets as of December 2025 (APRA, 2026), super is the largest financial asset most Australians will ever accumulate — yet many do not actively engage with it until their late 40s or 50s.

**2. High property prices relative to income.** Australia has some of the world's highest dwelling prices relative to incomes. As of 2024, Sydney's median house price exceeds $1.4 million, and Melbourne's exceeds $900,000. For many Australians, property — and the mortgage that funds it — is the single most consequential financial decision they make.

**3. Capital gains tax discount and franking credits.** Australia's tax system uniquely rewards long-term investing: individuals who hold assets for >12 months pay CGT on only 50% of the gain. Combined with franking credits on Australian equities, this creates strong incentives for long-term ETF investing — particularly relevant to the debt recycling strategy modelled in this toolkit.

These three factors together explain why most mainstream US-centric personal finance tools fail Australian users: the super system, CGT discount, dividend imputation, and state-by-state stamp duty regimes are simply not modelled.

---

## 2. Income & Tax Profile

### 2.1 Taxable Income Distribution

**Source:** ATO, Taxation Statistics 2022–23 (published June 2025) — 16.1 million individual tax returns

| Income Bracket | Share of All Taxpayers | Share of Total Net Tax |
|---|---|---|
| $18,200 or less | 15.8% | 0.1% |
| $18,201–$45,000 | 24.4% | 2.7% |
| **$45,001–$120,000** | **44.9%** | **39.1%** |
| $120,001–$180,000 | 9.5% | 21.2% |
| $180,001+ | 5.3% | 37.0% |

**The $45k–$120k band covers nearly half (44.9%) of all taxpayers** and represents the primary target audience for this toolkit. This is the segment that earns enough to have meaningful saving and investing choices, but not so much that they have professional tax advisers.

### 2.2 Average and Median Incomes

| Metric | Male 2022–23 | Female 2022–23 | Total 2022–23 |
|---|---|---|---|
| Average taxable income | $86,199 | $62,046 | **$74,240** |
| **Median taxable income** | $65,051 | $48,533 | **$55,868** |
| Average net tax | $28,206 | $18,465 | $23,562 |
| Median net tax | $17,118 | $11,324 | $14,095 |

The income **gap of $23k (mean)** between male and female earners is persistent across all years, creating notably different super trajectories — particularly relevant for the super balance gender gap at retirement (see Section 3).

### 2.3 Salary & Employment

| Metric | Value (2022–23) |
|---|---|
| Individuals receiving salary or wages | 12,843,712 |
| Average salary | $73,612 |
| Median salary | $62,041 |
| Individuals with rental property income | 2,261,080 |
| Rental properties at a net loss (negative gearing) | 1,117,175 (49.4%) |
| Rental properties neutral/profitable | 1,143,905 (50.6%) |

**Key insight:** Nearly 2.26 million Australians hold investment properties, and almost half run at a net loss — the core driver of interest in the negative gearing and tax savings features of this tool.

### 2.4 Savings & Deductions Behaviour

| Deduction Category | Users | Average | Median |
|---|---|---|---|
| Work-related expenses | 10,321,491 | $2,739 | $1,338 |
| Personal super contributions | 679,004 | $17,380 | $14,600 |
| Gifts/donations | 4,480,670 | $2,032 | $150 |
| Total deductions (all individuals) | 16,108,843 | $3,518 | $890 |

Only **679,004 Australians** (4.2% of taxpayers) made personal super contributions (voluntary, above employer SG). This is a major under-utilised tax benefit — salary sacrifice is poorly understood by the majority of Australian workers, despite providing substantial savings for those earning $45k–$180k.

---

## 3. Superannuation Landscape

### 3.1 System Scale

**Source:** APRA, Quarterly Superannuation Performance Statistics Highlights, December 2025

| Metric | Dec 2025 | YoY Change |
|---|---|---|
| Total super assets | **$4,485.5 billion** | +8.1% |
| APRA-regulated assets | $3,181.4 billion | +9.1% |
| Self-managed super funds (SMSF) | $1,061.4 billion | +6.0% |
| Annual contributions (system-wide) | $220.8 billion | +11.5% |
| Annual benefit payments | $139.9 billion | +12.5% |
| Net contribution flows | $72.2 billion | +6.1% |
| Annual rate of return | 8.7% | — |
| 5-year annualised return | 7.2% | — |

### 3.2 Super Balances by Income (Proxy for Age)

**Source:** ATO Taxation Statistics 2022–23 — Super balance by taxable income range

| Taxable Income | Individuals | Average Super Balance | Median Super Balance |
|---|---|---|---|
| $18,200 or less | 1,820,414 | $173,346 | $20,951 |
| $18,201–$45,000 | 3,467,784 | $109,904 | $16,703 |
| **$45,001–$120,000** | **7,027,673** | **$146,136** | **$68,821** |
| $120,001–$180,000 | 1,504,102 | $299,603 | $182,201 |
| $180,001+ | 833,052 | $576,821 | $315,261 |
| **Total (all)** | **17,892,696** | **$172,834** | **$60,037** |

The dramatic gap between **average ($172,834) and median ($60,037)** super balances reveals a highly skewed distribution: the majority of Australians have far less super than the average suggests. This is the single biggest driver of retirement anxiety and explains why FIRE planning and super bridge strategies resonate strongly with the target audience.

### 3.3 Gender Super Gap

| Metric | Male | Female | Gap |
|---|---|---|---|
| Average super balance 2022–23 | $192,119 | $154,641 | **$37,478** |
| Median super balance 2022–23 | $68,568 | $54,349 | **$14,219** |

This persistent gap reflects both the income gap and more years out of the workforce (e.g., parental leave). The FIRE and superannuation tools in this toolkit are specifically relevant to female users who may be behind on their super trajectory.

### 3.4 Key Insight for Tool Design

The median super balance of **$60,037** across the entire working population means that most users opening the FIRE calculator or Portfolio view will have far less super than they expect to need. Tools that show users their actual runway — and demonstrate how salary sacrifice or catch-up contributions can close the gap — are highly valuable to this audience.

---

## 4. Property & Housing

### 4.1 Tenure Type

**Source:** ABS 2021 Census

| Tenure Type | 2021 Share | 2016 Share |
|---|---|---|
| Owned outright (no mortgage) | 31.0% | 31.0% |
| Owned with mortgage | 35.0% | 34.5% |
| Renting | 30.6% | 30.0% |
| Other | 2.0% | 1.9% |
| **Total ownership** | **66%** | **65.5%** |

**Two in three Australian households own their home** (or are paying one off). Ownership has remained remarkably stable in aggregate, but the composition has shifted dramatically by age — younger cohorts own at substantially lower rates than equivalent age cohorts 20–30 years ago.

### 4.2 Housing Costs and Stress

**Source:** ABS 2021 Census

| Metric | 2021 | 2016 |
|---|---|---|
| Median weekly rent | $375 | $340 |
| Median monthly mortgage repayments | $1,863 | $1,755 |
| Renters paying >30% of income on rent | **32.2%** | 36.0% |
| Mortgage holders paying >30% of income | **14.5%** | 19.3% |

Over **32% of renters** experience housing stress (defined as spending >30% of gross income on rent). Mortgage stress, while lower, affects nearly 1 in 7 mortgage-holding households. This quantifies the pressure that makes the House Affordability and Offset vs Debt Recycling calculators essential for a significant portion of the target audience.

### 4.3 Property Prices (2024 Data)

**Sources:** CoreLogic/Cotality Home Value Index, Domain Research (widely reported)

| City | Median House Price (2024) | Median Unit Price (2024) |
|---|---|---|
| Sydney | ~$1,400,000 | ~$830,000 |
| Melbourne | ~$900,000 | ~$600,000 |
| Brisbane | ~$830,000 | ~$590,000 |
| Perth | ~$720,000 | ~$470,000 |
| Adelaide | ~$750,000 | ~$490,000 |
| National (combined) | ~$785,000 | ~$620,000 |

*Note: These figures are indicative medians from widely reported data as at mid-2024 and change quarterly.*

**Average first home buyer age** is approximately 33–35 years nationally (APRA/Domain Research, widely cited), reinforcing the importance of the $45k–$120k income band as the primary user segment — these are the people actively saving for a first deposit.

### 4.4 Mortgage Market Context

- Average new owner-occupier loan size: approximately **$620,000** (2024, ABS Housing Finance)
- Average variable mortgage rate: approximately **6.0–6.5%** (2024–25 after RBA rate cycle)
- Standard variable rate: approximately **6.2%** (December 2025, RBA cash rate 3.85%)

These figures directly inform the sensible defaults in the Offset vs Debt Recycling and House Affordability calculators.

---

## 5. Investment Behaviour

### 5.1 ETF Market Growth

**Source:** BetaShares, Australian ETF Review, September 2025

| Metric | Value (Sep 2025) |
|---|---|
| Total Australian ETF industry AUM | **$309.3 billion** |
| Monthly net inflows | ~$5 billion |
| 12-month AUM growth | **+36.3% ($82.4 billion)** |
| Monthly ASX ETF trading volume | ~$16 billion |

The Australian ETF market is growing at 36% year-on-year — an extraordinary rate reflecting rapid adoption. BetaShares alone reports serving more than **1 million investors**.

### 5.2 Share Ownership and Investor Demographics

**Sources:** ASX Investor Study 2023 (highlights widely reported); ATO 2022–23 dividend data

- Approximately **9 million Australians** (36% of the adult population) own shares or managed funds outside super (ASX Investor Study 2023)
- **3,045,331** Australian individuals received franked dividends in 2022–23 (ATO data)
- Average franked dividend income: $10,537; average franking credit: $4,217
- **ETFs are now the fastest-growing investment vehicle** among first-time investors under 35 (ASX Investor Study)

### 5.3 Negative Gearing and Property Investment

From ATO 2022–23 data:
- **2,261,080 individuals** hold at least one investment property
- **49.4% of all rental property interests** are negatively geared (net rental loss)
- This represents approximately **1.117 million** negatively geared property interests
- Negative gearing peaked in 2021–22 (949,519 loss properties) before rising to 1.117M in 2022–23, likely driven by rising mortgage costs

---

## 6. User Persona Definitions

Seven primary personas cover the realistic range of Australian users who would seek out and use a free personal finance calculator suite. Percentages of the total taxpaying/working population are indicative and based on the ATO income distribution data above.

---

### Persona 1 — Young Renter: "Just Starting Out"

**Demographics**
- Age: 22–30
- Relationship: Single or early relationship, no children
- Housing: Renting
- Employment: Full-time, often early-career
- Income: $50,000–$90,000 (aligns with ATO median salary band $45k–$120k)
- Tax bracket: 16–32% marginal
- HECS/HELP debt: Very common (Australian student loan system; repayment compulsory >$54,435 income)

**Financial Profile**
- Super: Low balance ($15,000–$40,000), employer SG only
- Savings: Small emergency fund, possibly a house deposit savings goal
- Investments: May have opened a CommSec/Stake account; ETF ownership growing in this cohort
- Mortgage: None; considering first home
- Debt: HECS, possibly car loan

**Financial Questions They're Asking**
- "Am I saving enough?"
- "Should I invest in ETFs or save for a house first?"
- "How do I reduce tax — is salary sacrifice worth it on my income?"
- "How much can I borrow if I want to buy?"
- "When could I retire if I start now?"

**Estimated Share of Target Audience:** ~15–20%
**Likely Primary Entry Point:** Savings Rate, then Tax Savings

---

### Persona 2 — First Home Buyer: "Saving for the Deposit"

**Demographics**
- Age: 28–38
- Relationship: Couple (married or de facto), no children or planning
- Housing: Renting, actively saving for first home
- Employment: Both working full-time
- Combined income: $120,000–$200,000
- Tax brackets: 30–37% marginal (each)

**Financial Profile**
- Super: Growing ($30,000–$100,000 each)
- Savings: Active deposit savings ($80,000–$200,000 combined)
- Investments: ETFs started or being considered
- Mortgage: None yet; actively researching borrowing capacity
- First Home Super Saver Scheme (FHSS): May be eligible and unaware

**Financial Questions They're Asking**
- "How much can we borrow with our income?"
- "How much stamp duty will we pay?"
- "How long do we need to save for a deposit?"
- "Should we use our super for the first home deposit (FHSS)?"
- "Is this specific property a good buy or overpriced?"

**Estimated Share of Target Audience:** ~20–25%
**Likely Primary Entry Point:** House Affordability, then Property Research

---

### Persona 3 — New Homeowner: "Mortgage Optimizer"

**Demographics**
- Age: 30–42
- Relationship: Couple, may have children (0–2)
- Housing: Owns home with mortgage ($500k–$900k outstanding)
- Employment: Both working or one full-time, one part-time
- Household income: $150,000–$250,000
- Marginal tax rate: 32–37%

**Financial Profile**
- Mortgage: $500k–$900k outstanding, variable or recently re-fixed
- Super: Growing ($60,000–$180,000 each); more aware
- ETF/investments: Beginning to invest outside super
- Cash: Offset account or redraw facility
- Negative gearing: May have or be considering investment property

**Financial Questions They're Asking**
- "Offset account vs paying down the mortgage — which is better?"
- "What is debt recycling and should I do it?"
- "P&I vs interest-only for the investment loan?"
- "How do I maximise tax deductions through negative gearing?"
- "When could we retire if we stay on this track?"

**Estimated Share of Target Audience:** ~20–25%
**Likely Primary Entry Point:** Offset vs Debt Recycling

---

### Persona 4 — FIRE Aspirant Couple: "Wealth Builders"

**Demographics**
- Age: 28–42
- Relationship: Couple (dual income, high savings rate)
- Children: 0 or 1 (childless or deferring family)
- Housing: Owns home with mortgage, OR renting and investing aggressively
- Combined income: $180,000–$350,000
- Marginal tax rate: 37–47%

**Financial Profile**
- Mortgage: May or may not have one; if yes, using offset and debt recycling
- Super: Above-average balances ($80k–$300k each); salary sacrificing
- ETF portfolio: Active; $100k–$500k+ combined
- Savings rate: High (30–60% of take-home)
- Goal: Financial independence at 45–55

**Financial Questions They're Asking**
- "What savings rate do we need to FIRE at 45?"
- "Classic FIRE vs Barista FIRE — what's the number?"
- "How does super bridge work for early retirement?"
- "Should we do debt recycling or invest directly?"
- "How do we optimise between super and taxable investments for FIRE?"

**Estimated Share of Target Audience:** ~10–15% (niche but highly engaged; disproportionate share of usage)
**Likely Primary Entry Point:** FIRE, then Savings Rate and Offset vs Debt Recycling

---

### Persona 5 — Established Family: "Mortgage + Kids"

**Demographics**
- Age: 35–52
- Relationship: Married, 1–3 children
- Housing: Owns home (may have equity), possibly considering upgrade
- Employment: One or both working; one may be part-time (childcare/school years)
- Household income: $120,000–$220,000
- Large expenses: School fees, childcare ($20,000–$40,000/year), food, activities

**Financial Profile**
- Mortgage: $400k–$750k outstanding
- Super: Moderate ($100k–$350k each); not maximised, life gets in the way
- ETF/investments: Some, typically sporadic/inconsistent contributions
- Savings rate: Low to moderate (10–25%) due to high expenses
- Financial stress: Present for many in this cohort despite good incomes

**Financial Questions They're Asking**
- "How do we balance mortgage repayment with investing?"
- "How far behind are we on super — can we catch up?"
- "How do we reduce our tax burden?"
- "When can I realistically retire?"
- "Should we salary sacrifice more?"

**Estimated Share of Target Audience:** ~20–25%
**Likely Primary Entry Point:** Tax Savings, then FIRE or Offset vs Debt Recycling

---

### Persona 6 — Property Investor: "Building a Portfolio"

**Demographics**
- Age: 35–60
- Relationship: Married or partnered
- Employment: Salaried or business owner
- Income: $120,000–$300,000 individual
- Housing: Owns PPOR, plus 1–3 investment properties

**Financial Profile**
- Mortgages: PPOR + investment loans; typically interest-only on investment properties
- Super: Moderate to good ($200k–$600k); salary sacrifice sometimes
- Negative gearing: Using it; aware of tax deductibility of interest
- ETF portfolio: Often substituted for property — a comparison is relevant

**Financial Questions They're Asking**
- "What is the after-tax return on my investment property vs an ETF in super?"
- "Should I do debt recycling on my PPOR while holding investment properties?"
- "How does negative gearing actually affect my tax bill?"
- "Is this property I'm looking at worth buying — does the yield stack up?"
- "When should I sell vs hold and how does the CGT discount apply?"

**Estimated Share of Target Audience:** ~10–15%
**Likely Primary Entry Point:** Tax Savings (negative gearing tab), then Property Research

---

### Persona 7 — Pre-Retiree: "The Countdown"

**Demographics**
- Age: 52–65
- Relationship: Married, children grown or nearly
- Housing: Owns outright or close to (mortgage nearly paid off)
- Employment: Full-time but thinking about transition
- Income: $80,000–$200,000 individual

**Financial Profile**
- Super: Large ($300,000–$900,000+) — most significant financial asset
- ETF/investments: Outside super growing, may be drawing down
- Mortgage: Minimal or paid off
- Salary sacrifice: Maximising ($30,000/year concessional cap)
- Goal: Retire in 3–10 years, bridge the gap to preservation age

**Financial Questions They're Asking**
- "When exactly can I retire and how much do I need?"
- "What is the super preservation age bridge — how do I fund years 55–60?"
- "Should I salary sacrifice the maximum for remaining years?"
- "Will the 4% rule hold for my portfolio?"
- "Should I draw down non-super investments before preservation age?"

**Estimated Share of Target Audience:** ~10%
**Likely Primary Entry Point:** FIRE (Super Bridge tab), then Tax Savings

---

## 7. User Journey Analysis — Tool Relevance by Persona

The table below maps each tool to each persona. `●` = primary (core need), `○` = secondary (useful), blank = not relevant.

| Tool | P1 Young Renter | P2 First Home Buyer | P3 Mortgage Holder | P4 FIRE Couple | P5 Family | P6 Property Investor | P7 Pre-Retiree |
|---|---|---|---|---|---|---|---|
| **Portfolio** | ○ | ○ | ● | ● | ● | ● | ● |
| **Tax Savings** | ○ | ○ | ● | ● | ● | ● | ● |
| **Savings Rate** | ● | ● | ○ | ● | ● | — | ● |
| **FIRE** | ○ | — | ○ | ● | ● | — | ● |
| **Investment Comparison** | ● | ○ | ● | ● | ● | ● | ○ |
| **House Affordability** | ○ | ● | — | — | ○ | ○ | — |
| **Property Research** | — | ● | — | — | — | ● | — |
| **Offset vs Debt Recycling** | — | — | ● | ● | ● | ● | ○ |
| **Direct vs Debt Recycling** | — | — | ● | ● | ○ | ● | — |

**Tools with the broadest relevance (5+ personas):**
1. Tax Savings — 6/7 personas (only P1 is a weak fit at low income)
2. Portfolio — 6/7 personas (universal starting point)
3. Investment Comparison — 6/7 personas
4. Savings Rate — 5/7 personas
5. FIRE — 5/7 personas

**Most specialist tools (2–3 personas):**
- House Affordability & Property Research (property-focus personas)
- Offset vs Debt Recycling & Direct vs Debt Recycling (mortgage holders)

---

## 8. Recommended Navigation Order & Rationale

### 8.1 The Recommended Order

| Position | Tool | Primary Rationale |
|---|---|---|
| **1** | **Portfolio** | Onboarding: establishes financial baseline; all other tools draw from it |
| **2** | **Tax Savings** | First action step: reduce leakage before allocating any capital. Relevant to 6/7 personas. |
| **3** | **Savings Rate** | Set the savings target and understand its FIRE implications before deciding where to invest |
| **4** | **FIRE** | The "why" behind the savings target; most motivating view for the core audience |
| **5** | **Investment Comparison** | After knowing how much to save: choose the right vehicle (ETF, super, savings) |
| **6** | **House Affordability** | Natural property decision branch; only relevant once investment strategy is understood |
| **7** | **Property Research** | Follows House Affordability — evaluate a specific property after checking affordability |
| **8** | **Offset vs Debt Recycling** | Advanced strategy for mortgage holders — builds on Tax Savings and Investment Comparison |
| **9** | **Direct vs Debt Recycling** | Expert-level comparison; requires understanding Offset vs Debt Recycling first |

### 8.2 Logic of the Ordering

The order follows a **natural decision hierarchy** from universal to specialist:

```
UNDERSTAND POSITION
  └─ Portfolio: "Where do I stand right now?"

REDUCE LEAKAGE
  └─ Tax Savings: "How do I keep more of what I earn?"

SET GOALS
  ├─ Savings Rate: "Am I saving enough? How long to independence?"
  └─ FIRE: "When can I stop working? What's the number?"

ALLOCATE CAPITAL
  └─ Investment Comparison: "ETF, super, or savings — what's most efficient?"

PROPERTY DECISIONS
  ├─ House Affordability: "What can I afford to buy?"
  └─ Property Research: "Is this specific property a good buy?"

ADVANCED MORTGAGE STRATEGY
  ├─ Offset vs Debt Recycling: "How should I structure my mortgage?"
  └─ Direct vs Debt Recycling: "Invest directly vs debt recycle — which wins?"
```

### 8.3 Where the Order Diverges from the User's Initial Proposal

The user's initial proposal placed **Investment Comparison at position 3** (before Savings Rate and FIRE). The recommended order moves it to position 5 for the following reason:

> "How much do I need to save?" and "Why does it matter?" (Savings Rate, FIRE) are more foundational questions than "Which vehicle do I use?" (Investment Comparison). A user who doesn't know their FIRE number or savings target has no basis for comparing scenarios. Seeing the savings rate needed for FIRE is frequently the catalyst that motivates proper asset allocation decisions.

That said, Investment Comparison works well at position 3 for users who are not FIRE-oriented and simply want to compare savings account vs ETF vs super. If the user prefers position 3, it remains a reasonable choice.

### 8.4 Cross-Links Inside Views (Signposted Journeys)

| From | To | Reason |
|---|---|---|
| **Portfolio** | Tax Savings | "Next step" CTA at bottom of Portfolio |
| **FIRE** | Savings Rate | "Adjust your savings rate to reach this target" |
| **FIRE** | Investment Comparison | "See how your super vs ETF allocation affects the number" |
| **Offset vs Debt Recycling** | Direct vs Debt Recycling | "Compare debt recycling vs direct investing" |
| **House Affordability** | Property Research | "Found a property? Check it against 130 criteria" |

---

## 9. Cross-Links Between Tools

The following data flows from the Portfolio view into each calculator (when the user has completed Portfolio):

| Portfolio Field | Pre-populates in |
|---|---|
| Gross salary | Tax Savings, Savings Rate, House Affordability |
| Marginal tax rate | Tax Savings, Offset vs Debt Recycling, Direct vs Debt Recycling, FIRE, Investment Comparison |
| Annual savings contribution | Savings Rate, Investment Comparison |
| Mortgage outstanding / interest rate / years remaining | Offset vs Debt Recycling, Direct vs Debt Recycling |
| ETF portfolio value + monthly contribution | Investment Comparison, Direct vs Debt Recycling |
| Super balance | FIRE (Super Bridge), Investment Comparison |
| Annual living expenses (sum of itemised) | FIRE, Savings Rate |
| Property value | House Affordability |

---

## 10. Data Sources & Methodology

| Source | Data Used | Reference Period |
|---|---|---|
| **ATO, Taxation Statistics 2022–23** | Income distribution, average/median income, super balances by income, negative gearing, salary data, tax brackets | 2022–23 income year; published June 2025 |
| **APRA, Quarterly Superannuation Performance Statistics Highlights** | Total super assets, contributions, returns | December 2025; published February 2026 |
| **ABS, 2021 Census** | Housing tenure (ownership vs renting), mortgage and rent costs, housing stress percentages | 2021 Census night |
| **BetaShares, Australian ETF Review** | ETF industry AUM, monthly flows, growth rate, number of investors | September 2025 |
| **CoreLogic / Cotality, Home Value Index (2024)** | Indicative median house prices by city | Mid-2024 (widely reported) |
| **ASX Investor Study 2023** | Share of adult Australians who invest, ETF adoption by age | 2023 (widely reported highlights) |
| **ABS Housing Finance (ABS 5601.0)** | Average new loan size for owner-occupiers | 2024 (widely reported) |

### Methodology Notes

1. All ATO figures are from individual income tax return data. They cover the full taxpaying population and are therefore highly reliable as population-level benchmarks.
2. Property price medians are indicative figures from widely reported CoreLogic/Domain data as at mid-2024 and will change each quarter. They are included for context only and are not hard-coded into any calculator.
3. The "estimated share of target audience" figures in persona definitions are indicative ranges derived from the ATO income distribution and ABS census data. They are not survey-based.
4. Where ABS pages returned JavaScript-rendered content inaccessible to automated fetching, widely reported figures from ABS statistical releases have been used and cited to the original ABS report.
5. ASFA super balance by age group (commonly cited figures of ~$150k–$350k for ages 55–64) could not be directly verified via data fetch in this session. The ATO super balance by income bracket data in Section 3 is used as a reliable proxy.

---

*Document prepared: March 2026 | For internal product design use | Not financial advice*
