import { useState } from 'react';

export interface ConceptDef {
  term: string;
  definition: string;
  link?: string;
  linkLabel?: string;
}

interface AboutCalcProps {
  concepts: ConceptDef[];
  defaultOpen?: boolean;
  title?: string;
}

/**
 * Collapsible info panel shown at the top of each tool.
 * Explains key terms in plain English, each with a link to a reputable free source.
 */
export function AboutCalc({ concepts, defaultOpen = false, title = 'About this calculator' }: AboutCalcProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className="text-slate-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 py-4 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          {concepts.map(c => (
            <div key={c.term} className="py-3 first:pt-0 last:pb-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                {c.term}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
                {c.definition}
              </p>
              {c.link && (
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-0.5"
              >
                Learn more — {c.linkLabel} ↗
              </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
