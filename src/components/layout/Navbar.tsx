import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const NAV_ITEMS = [
  { path: '/portfolio',            label: 'Portfolio' },
  { path: '/tax-savings',          label: 'Tax Savings' },
  { path: '/savings-rate',         label: 'Savings Rate' },
  { path: '/fire',                 label: 'FIRE' },
  { path: '/investment-compare',   label: 'Investment Comparison' },
  { path: '/house-affordability',  label: 'House Affordability' },
  { path: '/property-research',    label: 'Property Research' },
];

const DR_ITEMS = [
  { path: '/offset-vs-debt-recycling', label: 'Offset vs Debt Recycling' },
  { path: '/direct-vs-debt-recycling', label: 'Direct vs Debt Recycling' },
];

export function Navbar() {
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drOpen, setDrOpen] = useState(false);
  const location = useLocation();
  const drActive = DR_ITEMS.some(item => location.pathname.startsWith(item.path));

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 text-lg shrink-0">
            <span className="font-mono">$</span>
            <span>AU Personal Finance</span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Debt Recycling dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDrOpen(true)}
              onMouseLeave={() => setDrOpen(false)}
            >
              <button
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                  drActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
              >
                Debt Recycling
                <span className="text-[10px] opacity-60">▾</span>
              </button>
              {drOpen && (
                <div className="absolute top-full right-0 mt-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-50 min-w-[220px]">
                  {DR_ITEMS.map(item => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setDrOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀' : '◑'}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`block h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu — flat list, no dropdown needed */}
        {menuOpen && (
          <div className="md:hidden py-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-0.5">
            {[...NAV_ITEMS, ...DR_ITEMS].map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
