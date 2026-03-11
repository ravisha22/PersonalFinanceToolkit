import { CURRENT_TAX_YEAR } from '../../data/constants';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div className="max-w-xl leading-relaxed">
            <strong className="text-slate-600 dark:text-slate-300">Not financial advice.</strong>{' '}
            AusFinTools is a free educational tool. All calculations are illustrative only and
            should not be relied upon for financial decisions. Always consult a licensed
            Australian financial adviser (AFS licence holder) before acting.
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span>Based on {CURRENT_TAX_YEAR} ATO rates</span>
            <a
              href="https://github.com/ravisha22/PersonalFinanceToolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              GitHub ↗
            </a>
            <span>MIT Licence · Privacy-first · No tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
