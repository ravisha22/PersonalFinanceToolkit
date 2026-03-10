/**
 * Display formatting utilities for AusFinTools.
 * All functions are pure — no side effects.
 */

/**
 * Format a number as compact AUD currency.
 * $1,234 → "$1k", $1,234,567 → "$1.23M"
 */
export function formatCompact(value: number | null | undefined): string {
  if (value == null) return '—';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${Math.round(abs).toLocaleString('en-AU')}`;
}

/**
 * Format a number as full AUD currency with commas.
 * 925000 → "$925,000"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—';
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(Math.round(value)).toLocaleString('en-AU')}`;
}

/**
 * Format a decimal as a percentage string.
 * 0.475 → "47.5%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a plain percentage number.
 * 47 → "47%", 5.7 → "5.7%"
 */
export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format years with one decimal.
 * 12.333 → "12.3 yrs"
 */
export function formatYears(value: number): string {
  return `${value.toFixed(1)} yrs`;
}

/**
 * Format a number with leading + sign if positive.
 * 50000 → "+$50,000", -20000 → "-$20,000"
 */
export function formatDiff(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${formatCurrency(value)}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
