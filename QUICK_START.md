# AusFinTools — Quick Start Guide

## How to Build This Project Using Claude Code

This repo contains everything a Claude Code agent needs to build the full AusFinTools suite from scratch. No manual coding required.

---

## Prerequisites

- Node.js 20+ installed
- GitHub account
- Claude Code agent access (via GitHub Copilot or Claude Code CLI)

---

## Step 1: Create the GitHub Repo

1. Go to [github.com/new](https://github.com/new)
2. Name: `ausfintools`
3. Description: `Free, open-source Australian personal finance calculator suite`
4. Public, do NOT initialize with README
5. Create repository

---

## Step 2: Upload the Seed Files

Upload these files to the repo root via GitHub's "uploading an existing file" link:

```
CLAUDE.md                              # Agent instructions (CRITICAL — agent reads this first)
docs/CALCULATOR_SPECS.md               # Detailed specs for each calculator
docs/AGENT_KICKOFF.md                  # Prompts to give the agent
reference/offset-vs-debt-recycling.jsx # Working reference implementation
```

Commit message: `docs: add agent instructions and calculator specs`

---

## Step 3: Clone Locally

```bash
git clone https://github.com/YOUR_USERNAME/ausfintools.git
cd ausfintools
```

---

## Step 4: Run Claude Code Agent

Open the repo in VS Code with GitHub Copilot (Claude) or use Claude Code CLI.

### Option A: Single Prompt (if your agent handles long tasks well)

Paste the full prompt from `docs/AGENT_KICKOFF.md` → "Prompt" section.

### Option B: Step-by-Step (recommended)

Paste prompts 1 through 7 from `docs/AGENT_KICKOFF.md` → "Alternative: Step-by-Step Prompts" section, one at a time.

Wait for each step to complete before moving to the next.

---

## Step 5: Verify

After the agent finishes:

```bash
npm run dev          # Should open at localhost:5173
npm run build        # Should produce clean dist/
npx vitest           # Should pass all tests
```

---

## Step 6: Deploy

### Vercel (recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: Vite
4. Deploy — done

### GitHub Pages (alternative)
The agent will have created `.github/workflows/deploy.yml`. Just push to `main` and enable GitHub Pages in repo settings (Source: GitHub Actions).

---

## Repo Structure After Build

```
ausfintools/
├── CLAUDE.md                          # Agent instructions
├── README.md                          # Project docs
├── LICENSE                            # MIT
├── CONTRIBUTING.md                    # Contribution guide
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── index.html
├── reference/                         # Original implementations
│   └── offset-vs-debt-recycling.jsx
├── docs/                              # Specs and guides
│   ├── CALCULATOR_SPECS.md
│   └── AGENT_KICKOFF.md
├── .github/workflows/
│   └── deploy.yml
├── public/
│   └── favicon.svg
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── components/                    # Shared UI library
    ├── calculators/                   # 8 calculator modules
    ├── data/                          # Australian financial data
    ├── hooks/                         # Theme, URL params
    └── utils/                         # Formatters, shared math
```

---

## What the Files Do

| File | Purpose |
|---|---|
| `CLAUDE.md` | Primary instruction file — Claude Code reads this first. Contains tech stack, project structure, coding standards, Australian data reference, and build order. |
| `docs/CALCULATOR_SPECS.md` | Detailed spec for each of the 8 calculators — inputs, outputs, engine function signatures, test cases. The agent's blueprint. |
| `docs/AGENT_KICKOFF.md` | Ready-to-paste prompts for the agent. Full prompt for capable agents, step-by-step for incremental builds. Includes verification checklist. |
| `reference/offset-vs-debt-recycling.jsx` | Working React implementation of the offset vs DR calculator. Agent uses this as reference when porting into the new structure. |

---

## Updating Tax Data

Australian tax brackets change annually (typically 1 July). To update:

1. Edit `src/data/tax-brackets.ts` with new brackets
2. Edit `src/data/super-rules.ts` if SG rate or caps change
3. Edit `src/data/stamp-duty-tables.ts` if state thresholds change
4. Update the displayed tax year string (e.g., "2025-26")
5. Commit: `fix(data): update to 2025-26 ATO rates`

---

## License

MIT — free to use, modify, and distribute.
