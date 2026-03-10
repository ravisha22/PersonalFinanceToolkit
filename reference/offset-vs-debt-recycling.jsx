import { useState, useMemo } from "react";

// ─── Financial Engine ────────────────────────────────────────────────────────

function monthlyRepayment(principal, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function runOffset(loan, rate, years, offsetAmt) {
  const r = rate / 100 / 12;
  const n = years * 12;
  const payment = monthlyRepayment(loan, rate, years);
  let balance = loan;
  let totalInterest = 0;
  let months = 0;
  const yearly = [];
  for (let m = 1; m <= n && balance > 0; m++) {
    const effectiveBal = Math.max(0, balance - offsetAmt);
    const interest = effectiveBal * r;
    const principalPaid = Math.min(balance, payment - interest);
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    months = m;
    if (m % 12 === 0 || balance <= 0) {
      yearly.push({
        year: Math.ceil(m / 12),
        balance: Math.round(balance),
        totalInterest: Math.round(totalInterest),
        netWealth: Math.round(offsetAmt - balance),
      });
    }
    if (balance <= 0) break;
  }
  let baseBal = loan, baseInterest = 0;
  for (let m = 1; m <= n && baseBal > 0; m++) {
    const int = baseBal * r;
    baseBal = Math.max(0, baseBal - (payment - int));
    baseInterest += int;
  }
  return {
    totalInterest: Math.round(totalInterest),
    interestSaved: Math.round(baseInterest - totalInterest),
    monthsToPayoff: months,
    yearsToPayoff: (months / 12).toFixed(1),
    offsetValue: offsetAmt,
    yearly,
  };
}

function runDebtRecycling(loan, rate, years, investAmt, etfReturn, divYield, margTax, cgtDiscount) {
  const r = rate / 100 / 12;
  const n = years * 12;
  const payment = monthlyRepayment(loan, rate, years);
  const growthOnly = (etfReturn - divYield) / 100 / 12;
  const monthlyDiv = divYield / 100 / 12;

  let homeLoanBal = loan - investAmt;
  let investLoanBal = investAmt;
  let portfolioValue = investAmt;
  let totalHomeLoanInterest = 0;
  let totalInvestLoanInterest = 0;
  let totalTaxDeductions = 0;
  let totalCostBase = investAmt;
  const yearly = [];

  for (let m = 1; m <= n; m++) {
    const homeInt = homeLoanBal > 0 ? homeLoanBal * r : 0;
    const investInt = investLoanBal > 0 ? investLoanBal * r : 0;
    const taxDeduction = investInt * margTax;
    const growth = portfolioValue * growthOnly;
    const dividends = portfolioValue * monthlyDiv;
    portfolioValue += growth + dividends;
    if (homeLoanBal > 0) {
      const pp = Math.min(homeLoanBal, payment - homeInt);
      homeLoanBal = Math.max(0, homeLoanBal - pp);
    }
    totalHomeLoanInterest += homeInt;
    totalInvestLoanInterest += investInt;
    totalTaxDeductions += taxDeduction;
    if (m % 12 === 0) {
      const unrealisedGain = portfolioValue - totalCostBase;
      const cgtIfSold = unrealisedGain > 0 ? unrealisedGain * (1 - cgtDiscount / 100) * margTax : 0;
      yearly.push({
        year: m / 12,
        homeLoanBal: Math.round(homeLoanBal),
        investLoanBal: Math.round(investLoanBal),
        portfolioValue: Math.round(portfolioValue),
        totalInterestPaid: Math.round(totalHomeLoanInterest + totalInvestLoanInterest),
        taxDeductions: Math.round(totalTaxDeductions),
        netWealth: Math.round(portfolioValue - homeLoanBal - investLoanBal),
        netWealthAfterCGT: Math.round(portfolioValue - cgtIfSold - homeLoanBal - investLoanBal),
      });
    }
  }
  const unrealisedGain = portfolioValue - totalCostBase;
  const cgtIfSold = unrealisedGain > 0 ? unrealisedGain * (1 - cgtDiscount / 100) * margTax : 0;
  return {
    totalInterest: Math.round(totalHomeLoanInterest + totalInvestLoanInterest),
    taxDeductions: Math.round(totalTaxDeductions),
    netInterestCost: Math.round(totalHomeLoanInterest + totalInvestLoanInterest - totalTaxDeductions),
    portfolioValue: Math.round(portfolioValue),
    cgtIfSold: Math.round(cgtIfSold),
    netWealthPostCGT: Math.round(portfolioValue - cgtIfSold - investLoanBal),
    yearly,
  };
}

// ─── Formatters ──────────────────────────────────────────────────────────────

const fmt = (v) => {
  if (v == null) return "—";
  const abs = Math.abs(v);
  const s = v < 0 ? "-" : "";
  if (abs >= 1e6) return s + "$" + (abs / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return s + "$" + (abs / 1e3).toFixed(0) + "k";
  return "$" + v.toLocaleString();
};
const fmtFull = (v) => (v == null ? "—" : "$" + Math.round(v).toLocaleString());

// ─── Theme System ────────────────────────────────────────────────────────────

const themes = {
  dark: {
    bg: "#0b1120", bgCard: "#111827", bgInput: "#0f172a",
    border: "#1e293b", text: "#c8d3e6", textMuted: "#64748b", textStrong: "#e2e8f0",
    accent: "#3b82f6", accentGreen: "#22c55e", accentRed: "#ef4444",
    accentPurple: "#a78bfa", accentCyan: "#38bdf8",
    barGreenFrom: "#22c55e33", barGreenTo: "#22c55e",
    barBlueFrom: "#3b82f633", barBlueTo: "#3b82f6",
    rowHover: "#0f172a", rowSelected: "#1e293b",
    shadow: "0 1px 3px rgba(0,0,0,.4)",
  },
  light: {
    bg: "#f8fafc", bgCard: "#ffffff", bgInput: "#f1f5f9",
    border: "#e2e8f0", text: "#334155", textMuted: "#94a3b8", textStrong: "#0f172a",
    accent: "#2563eb", accentGreen: "#16a34a", accentRed: "#dc2626",
    accentPurple: "#7c3aed", accentCyan: "#0284c7",
    barGreenFrom: "#16a34a22", barGreenTo: "#16a34a",
    barBlueFrom: "#2563eb22", barBlueTo: "#2563eb",
    rowHover: "#f1f5f9", rowSelected: "#e0e7ff",
    shadow: "0 1px 3px rgba(0,0,0,.08)",
  },
};

// ─── Subcomponents ───────────────────────────────────────────────────────────

function Slider({ label, value, onChange, min, max, step, suffix, t }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: t.accent }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: t.textStrong, minWidth: 52, textAlign: "right" }}>
          {typeof value === "number" ? value.toFixed(step < 1 ? 1 : 0) : value}{suffix}
        </span>
      </div>
    </div>
  );
}

function NumInput({ label, value, onChange, min, max, step, prefix, suffix, t }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, background: t.bgInput, borderRadius: 4, border: `1px solid ${t.border}`, padding: "4px 8px" }}>
        {prefix && <span style={{ fontSize: 12, color: t.textMuted }}>{prefix}</span>}
        <input type="number" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, fontWeight: 600, color: t.textStrong, fontFamily: "inherit", width: "100%" }} />
        {suffix && <span style={{ fontSize: 12, color: t.textMuted }}>{suffix}</span>}
      </div>
    </div>
  );
}

function Stat({ label, value, color, t }) {
  return (
    <div style={{ background: t.bgInput, borderRadius: 6, padding: "12px 14px", borderLeft: `3px solid ${color}` }}>
      <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color, letterSpacing: "-0.3px" }}>{value}</div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState("dark");
  const t = themes[mode];

  const [loan, setLoan] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(0);
  const [etfReturn, setEtfReturn] = useState(0);
  const [divYield, setDivYield] = useState(0);
  const [margTax, setMargTax] = useState(0);
  const [cgtDiscount, setCgtDiscount] = useState(50); // ATO rule: 50% for assets held >12 months
  const [amountsStr, setAmountsStr] = useState("");

  const amounts = useMemo(() =>
    amountsStr.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0),
    [amountsStr]
  );

  const [selectedAmount, setSelectedAmount] = useState(0);
  const [viewYear, setViewYear] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const results = useMemo(() => {
    return amounts.map((amt) => {
      if (amt >= loan) return null;
      const offset = runOffset(loan, rate, years, amt);
      const dr = runDebtRecycling(loan, rate, years, amt, etfReturn, divYield, margTax / 100, cgtDiscount);
      return { amount: amt, offset, dr, wealthDiff: dr.netWealthPostCGT - amt };
    }).filter(Boolean);
  }, [loan, rate, years, etfReturn, divYield, margTax, cgtDiscount, amounts]);

  const sel = results.find((r) => r.amount === selectedAmount) || results[0];

  const yearlyComp = useMemo(() => {
    if (!sel) return [];
    return sel.offset.yearly.map((oy, i) => {
      const dy = sel.dr.yearly[i];
      if (!dy) return null;
      return { year: oy.year, oNW: oy.netWealth, dNW: dy.netWealthAfterCGT, oB: oy.balance, dH: dy.homeLoanBal, dP: dy.portfolioValue, dT: dy.taxDeductions };
    }).filter(Boolean);
  }, [sel]);

  const yearBtns = useMemo(() => {
    const b = [];
    if (years <= 10) for (let y = 1; y <= years; y++) b.push(y);
    else if (years <= 20) { for (let y = 1; y <= years; y += (y < 5 ? 2 : 3)) b.push(y); if (!b.includes(years)) b.push(years); }
    else { for (let y = 5; y <= years; y += 5) b.push(y); if (!b.includes(years)) b.push(years); }
    return [...new Set(b)].sort((a, b) => a - b);
  }, [years]);

  const barInt = years <= 10 ? 1 : years <= 20 ? 3 : 5;
  const mPmt = useMemo(() => monthlyRepayment(loan, rate, years), [loan, rate, years]);

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'SF Mono', monospace", background: t.bg, color: t.text, minHeight: "100vh", padding: "20px 24px", transition: "background .25s, color .25s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:${t.bgCard}}
        ::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px}
        input[type=number]::-webkit-inner-spin-button{opacity:.5}
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, borderBottom: `1px solid ${t.border}`, paddingBottom: 14 }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 21, fontWeight: 800, color: t.textStrong, letterSpacing: "-.5px", marginBottom: 4 }}>
            Offset vs Debt Recycling Calculator
          </h1>
          <p style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>
            Loan: <span style={{ color: t.textStrong }}>{fmtFull(loan)}</span> · Term: <span style={{ color: t.textStrong }}>{years}yr P&I</span> · Repayment: <span style={{ color: t.textStrong }}>{fmtFull(mPmt)}/mo</span> · DR invest loan = IO
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setSettingsOpen(!settingsOpen)} style={{
            padding: "6px 14px", fontSize: 11, fontWeight: 600,
            background: settingsOpen ? t.accent : t.bgCard, color: settingsOpen ? "#fff" : t.textMuted,
            border: `1px solid ${settingsOpen ? t.accent : t.border}`, borderRadius: 6,
            cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
          }}>{settingsOpen ? "Close Settings" : "Settings"}</button>
          <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{
            padding: "6px 14px", fontSize: 11, fontWeight: 600,
            background: t.bgCard, color: t.textMuted,
            border: `1px solid ${t.border}`, borderRadius: 6,
            cursor: "pointer", fontFamily: "inherit",
          }}>{mode === "dark" ? "\u2600 Light" : "\u25CF Dark"}</button>
        </div>
      </div>

      {/* Settings Panel */}
      {settingsOpen && (
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, padding: 20, marginBottom: 22, boxShadow: t.shadow }}>
          <div style={{ fontSize: 10, color: t.accent, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 16 }}>All Parameters</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
            <NumInput label="Loan Amount" value={loan} onChange={setLoan} min={50000} max={5000000} step={5000} prefix="$" t={t} />
            <Slider label="Interest Rate" value={rate} onChange={setRate} min={2} max={12} step={0.1} suffix="%" t={t} />
            <NumInput label="Loan Term (years)" value={years} onChange={v => setYears(Math.max(1, Math.min(40, Math.round(v))))} min={1} max={40} step={1} suffix=" yrs" t={t} />
            <Slider label="ETF Total Return (pa)" value={etfReturn} onChange={setEtfReturn} min={2} max={16} step={0.5} suffix="%" t={t} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
            <Slider label="Dividend Yield (pa)" value={divYield} onChange={setDivYield} min={0} max={8} step={0.5} suffix="%" t={t} />
            <Slider label="Marginal Tax Rate" value={margTax} onChange={setMargTax} min={0} max={49} step={1} suffix="%" t={t} />
            <Slider label="CGT Discount" value={cgtDiscount} onChange={setCgtDiscount} min={0} max={50} step={5} suffix="%" t={t} />
            <div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Comparison Amounts</div>
              <input value={amountsStr} onChange={(e) => setAmountsStr(e.target.value)}
                style={{ width: "100%", background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 4, padding: "6px 8px", fontSize: 11, color: t.textStrong, fontFamily: "inherit", outline: "none" }}
                placeholder="50000,100000,150000..." />
              <div style={{ fontSize: 9, color: t.textMuted, marginTop: 3 }}>Comma-separated values</div>
            </div>
          </div>
          <div style={{ padding: "10px 14px", background: t.bgInput, borderRadius: 6, fontSize: 10, color: t.textMuted, lineHeight: 1.7, border: `1px solid ${t.border}` }}>
            <strong style={{ color: t.textStrong }}>Model: </strong>
            Home loan {rate}% P&I / {years}yr. DR invest loan IO same rate. ETF {etfReturn}% pa ({divYield}% div + {(etfReturn - divYield).toFixed(1)}% growth).
            Tax {margTax}%. CGT {cgtDiscount}% discount.
            After-tax DR loan cost = <strong style={{ color: t.accent }}>{(rate * (1 - margTax / 100)).toFixed(2)}%</strong>.
          </div>
        </div>
      )}

      {/* Quick Controls */}
      {!settingsOpen && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 22, background: t.bgCard, borderRadius: 8, padding: 14, border: `1px solid ${t.border}` }}>
          <Slider label="Mortgage Rate" value={rate} onChange={setRate} min={2} max={12} step={0.1} suffix="%" t={t} />
          <Slider label="ETF Return (pa)" value={etfReturn} onChange={setEtfReturn} min={2} max={16} step={0.5} suffix="%" t={t} />
          <Slider label="Marginal Tax" value={margTax} onChange={setMargTax} min={0} max={49} step={1} suffix="%" t={t} />
        </div>
      )}

      {/* Summary Table */}
      <div style={{ overflowX: "auto", marginBottom: 22, border: `1px solid ${t.border}`, borderRadius: 8, boxShadow: t.shadow }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
          <thead>
            <tr style={{ background: t.bgCard }}>
              {["Amount", "Offset Interest Saved", "Offset Payoff", `DR Portfolio (${years}yr)`, "DR Tax Deductions", "DR Net Wealth", "Offset Net Wealth", "DR Advantage"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "right", color: t.textMuted, fontWeight: 500, fontSize: 9.5, textTransform: "uppercase", letterSpacing: .7, borderBottom: `1px solid ${t.border}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map(r => {
              const isSel = r.amount === (sel?.amount);
              const adv = r.wealthDiff;
              return (
                <tr key={r.amount} onClick={() => setSelectedAmount(r.amount)} style={{
                  cursor: "pointer", background: isSel ? t.rowSelected : "transparent",
                  borderLeft: isSel ? `3px solid ${t.accent}` : "3px solid transparent", transition: "all .12s",
                }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = t.rowHover; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 600, color: t.textStrong }}>{fmtFull(r.amount)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", color: t.accentGreen }}>{fmtFull(r.offset.interestSaved)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", color: t.text }}>{r.offset.yearsToPayoff} yrs</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", color: t.accent, fontWeight: 600 }}>{fmtFull(r.dr.portfolioValue)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", color: t.accentPurple }}>{fmtFull(r.dr.taxDeductions)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", color: t.accentCyan, fontWeight: 600 }}>{fmtFull(r.dr.netWealthPostCGT)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", color: t.text }}>{fmtFull(r.amount)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, color: adv > 0 ? t.accentGreen : t.accentRed }}>{adv > 0 ? "+" : ""}{fmtFull(adv)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Cards */}
      {sel && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, padding: 18, boxShadow: t.shadow }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: t.accentGreen, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.accentGreen }} />OFFSET — {fmtFull(sel.amount)}
            </h3>
            {[
              ["Total Interest Paid", fmtFull(sel.offset.totalInterest)],
              ["Interest Saved vs No Offset", fmtFull(sel.offset.interestSaved)],
              ["Loan Payoff Time", `${sel.offset.yearsToPayoff} years`],
              ["Cash in Offset (retained)", fmtFull(sel.amount)],
              [`Net Wealth at ${years}yr`, fmtFull(sel.amount)],
              ["Tax Benefit", "$0 (no deduction)"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${t.border}22`, fontSize: 11.5 }}>
                <span style={{ color: t.textMuted }}>{k}</span><span style={{ color: t.textStrong, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, padding: 18, boxShadow: t.shadow }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: t.accent, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent }} />DEBT RECYCLING — {fmtFull(sel.amount)}
            </h3>
            {[
              ["Total Interest (home + invest)", fmtFull(sel.dr.totalInterest)],
              ["Tax Deductions (invest interest)", fmtFull(sel.dr.taxDeductions)],
              ["Net Interest Cost", fmtFull(sel.dr.netInterestCost)],
              [`Portfolio Value at ${years}yr`, fmtFull(sel.dr.portfolioValue)],
              [`CGT if Sold (${cgtDiscount}% discount)`, fmtFull(sel.dr.cgtIfSold)],
              ["Net Wealth Post-CGT", fmtFull(sel.dr.netWealthPostCGT)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${t.border}22`, fontSize: 11.5 }}>
                <span style={{ color: t.textMuted }}>{k}</span><span style={{ color: t.textStrong, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Year-by-Year */}
      {sel && yearlyComp.length > 0 && (
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, padding: 18, marginBottom: 22, boxShadow: t.shadow }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: t.textStrong }}>Year-by-Year — {fmtFull(sel.amount)}</h3>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, color: t.textMuted }}>Snapshot:</span>
              {yearBtns.map(y => (
                <button key={y} onClick={() => setViewYear(y)} style={{
                  padding: "3px 9px", fontSize: 10, fontWeight: viewYear === y ? 700 : 400,
                  background: viewYear === y ? t.accent : t.bgInput, color: viewYear === y ? "#fff" : t.textMuted,
                  border: `1px solid ${viewYear === y ? t.accent : t.border}`, borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
                }}>{y}</button>
              ))}
            </div>
          </div>
          {(() => {
            const snap = yearlyComp.find(y => y.year === viewYear) || yearlyComp[yearlyComp.length - 1];
            if (!snap) return null;
            const diff = snap.dNW - snap.oNW;
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                  <Stat label="Offset Net Wealth" value={fmtFull(snap.oNW)} color={t.accentGreen} t={t} />
                  <Stat label="DR Net Wealth (post-CGT)" value={fmtFull(snap.dNW)} color={t.accent} t={t} />
                  <Stat label="DR Portfolio Value" value={fmtFull(snap.dP)} color={t.accentPurple} t={t} />
                  <Stat label="DR Advantage" value={(diff > 0 ? "+" : "") + fmtFull(diff)} color={diff > 0 ? t.accentGreen : t.accentRed} t={t} />
                </div>
                <div>
                  {yearlyComp.filter((_, i) => (i + 1) % barInt === 0 || i === 0).map(row => {
                    const mx = Math.max(...yearlyComp.map(r => Math.max(Math.abs(r.oNW), Math.abs(r.dNW), 1)));
                    const oP = Math.max(2, (Math.max(0, row.oNW) / mx) * 100);
                    const dP = Math.max(2, (Math.max(0, row.dNW) / mx) * 100);
                    return (
                      <div key={row.year} style={{ display: "flex", alignItems: "center", marginBottom: 5, gap: 8 }}>
                        <span style={{ fontSize: 10, color: t.textMuted, minWidth: 32, textAlign: "right" }}>Yr {row.year}</span>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                          <div style={{ height: 9, borderRadius: 2, width: `${oP}%`, background: `linear-gradient(90deg,${t.barGreenFrom},${t.barGreenTo})`, transition: "width .3s" }} />
                          <div style={{ height: 9, borderRadius: 2, width: `${dP}%`, background: `linear-gradient(90deg,${t.barBlueFrom},${t.barBlueTo})`, transition: "width .3s" }} />
                        </div>
                        <div style={{ fontSize: 10, color: t.text, minWidth: 110, textAlign: "right" }}>
                          <span style={{ color: t.accentGreen }}>{fmt(row.oNW)}</span>{" / "}<span style={{ color: t.accent }}>{fmt(row.dNW)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 10 }}>
                    <span><span style={{ color: t.accentGreen }}>{"\u25A0"}</span> Offset</span>
                    <span><span style={{ color: t.accent }}>{"\u25A0"}</span> Debt Recycling</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Footer */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, padding: 18, fontSize: 10, color: t.textMuted, lineHeight: 1.7 }}>
        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 8 }}>Assumptions & Limitations</h3>
        <div style={{ columns: 2, columnGap: 24 }}>
          <p style={{ marginBottom: 5 }}><strong style={{ color: t.text }}>Home Loan:</strong> P&I repayments, monthly compounding. Fixed rate for term.</p>
          <p style={{ marginBottom: 5 }}><strong style={{ color: t.text }}>Investment Loan (DR):</strong> Interest-only at same rate. Interest tax-deductible (income-producing ETF).</p>
          <p style={{ marginBottom: 5 }}><strong style={{ color: t.text }}>ETF Returns:</strong> Smooth annual return. Dividends reinvested. No franking credits.</p>
          <p style={{ marginBottom: 5 }}><strong style={{ color: t.text }}>Tax:</strong> Flat marginal rate. CGT discount applied to gains held 12+ months.</p>
          <p style={{ marginBottom: 5 }}><strong style={{ color: t.text }}>Offset:</strong> Net wealth = cash retained. No growth on offset funds.</p>
          <p style={{ marginBottom: 5 }}><strong style={{ color: t.text }}>Not modelled:</strong> Franking credits, ongoing contributions, inflation, transaction costs, rate changes, sequence risk.</p>
        </div>
        <div style={{ marginTop: 10, padding: "8px 12px", background: t.bgInput, borderRadius: 4, border: `1px solid ${t.border}`, fontSize: 10, lineHeight: 1.6 }}>
          <strong style={{ color: t.accentRed }}>Disclaimer:</strong> Educational comparison only — not financial advice. Debt recycling carries market risk. Consult a licensed financial adviser before acting.
        </div>
      </div>
    </div>
  );
}
