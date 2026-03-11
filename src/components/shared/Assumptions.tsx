import { useState } from 'react';

interface AssumptionsProps {
  items: string[];
  title?: string;
}

export function Assumptions({ items, title = 'Assumptions & Limitations' }: AssumptionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className="text-slate-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white dark:bg-slate-900">
          <ul className="space-y-1.5">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="text-slate-300 dark:text-slate-600 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
