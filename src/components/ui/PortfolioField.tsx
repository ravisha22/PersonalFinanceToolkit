import { NavLink } from 'react-router-dom';

/**
 * Read-only display for a field whose value is sourced from the Portfolio view.
 * Replaces NumberInput/SliderControl when portfolio has a non-zero value for the field.
 */
export function PortfolioField({ label, value, prefix, suffix, decimals = 0 }: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const formatted = value.toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500 font-medium flex items-center gap-1.5">
        {label}
        <NavLink
          to="/portfolio"
          className="text-[9px] font-normal normal-case tracking-normal text-blue-400 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ↗ Portfolio
        </NavLink>
      </label>
      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 cursor-not-allowed">
        {prefix && (
          <span className="text-sm text-slate-400 dark:text-slate-500 font-mono select-none">{prefix}</span>
        )}
        <span className="flex-1 text-sm font-semibold font-mono text-slate-600 dark:text-slate-300">
          {formatted}
        </span>
        {suffix && (
          <span className="text-sm text-slate-400 dark:text-slate-500 font-mono select-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}
