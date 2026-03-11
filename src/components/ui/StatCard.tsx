type StatColor = 'blue' | 'green' | 'red' | 'purple' | 'cyan' | 'amber';

interface StatCardProps {
  label: string;
  value: string;
  color?: StatColor;
  subtext?: string;
}

const BORDER_COLORS: Record<StatColor, string> = {
  blue:   'border-l-blue-500',
  green:  'border-l-green-500',
  red:    'border-l-red-500',
  purple: 'border-l-violet-500',
  cyan:   'border-l-cyan-500',
  amber:  'border-l-amber-500',
};

const VALUE_COLORS: Record<StatColor, string> = {
  blue:   'text-blue-600 dark:text-blue-400',
  green:  'text-green-600 dark:text-green-400',
  red:    'text-red-600 dark:text-red-400',
  purple: 'text-violet-600 dark:text-violet-400',
  cyan:   'text-cyan-600 dark:text-cyan-400',
  amber:  'text-amber-600 dark:text-amber-400',
};

export function StatCard({ label, value, color = 'blue', subtext }: StatCardProps) {
  return (
    <div className={`bg-slate-100 dark:bg-slate-800 border-l-4 ${BORDER_COLORS[color]} rounded-md px-4 py-3`}>
      <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-medium mb-1">
        {label}
      </div>
      <div className={`text-lg font-bold font-mono ${VALUE_COLORS[color]}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{subtext}</div>
      )}
    </div>
  );
}
