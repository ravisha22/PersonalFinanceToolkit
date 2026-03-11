interface SliderControlProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function SliderControl({
  label, value, onChange, min, max, step, suffix = '', prefix = '', decimals,
}: SliderControlProps) {
  const display = decimals !== undefined
    ? value.toFixed(decimals)
    : step < 1 ? value.toFixed(1) : value.toFixed(0);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium">
          {label}
        </label>
        <span className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-100">
          {prefix}{display}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-600 cursor-pointer h-1.5"
      />
      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600">
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}
