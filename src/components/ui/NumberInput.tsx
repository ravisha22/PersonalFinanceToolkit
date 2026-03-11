interface NumberInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export function NumberInput({
  label, value, onChange, min, max, step = 1, prefix, suffix, placeholder,
}: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500 font-medium">
        {label}
      </label>
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500">
        {prefix && (
          <span className="text-sm text-slate-500 dark:text-slate-500 font-mono select-none">{prefix}</span>
        )}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value || ''}
          placeholder={placeholder ?? '0'}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 bg-transparent border-none outline-none text-sm font-semibold font-mono text-slate-800 dark:text-slate-100 min-w-0"
        />
        {suffix && (
          <span className="text-sm text-slate-500 dark:text-slate-500 select-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}
