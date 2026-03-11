import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type Theme = 'dark' | 'light';

/**
 * Theme hook: reads/writes dark|light via URL param `?theme=`.
 * Falls back to system preference. Applies `dark` class to <html>.
 */
export function useTheme(): [Theme, () => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialTheme = (): Theme => {
    const param = searchParams.get('theme');
    if (param === 'dark' || param === 'light') return param;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    const p = new URLSearchParams(searchParams);
    p.set('theme', theme);
    setSearchParams(p, { replace: true });
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return [theme, toggle];
}
