import { useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

type Primitive = string | number | boolean;
type ParamDefaults = Record<string, Primitive>;

/**
 * Sync calculator state to/from URL query params.
 * Supports string, number, and boolean values.
 *
 * @param defaults - Default values; also defines the shape and type of state
 * @returns [state, setter] — setter accepts partial updates
 */
export function useUrlParams<T extends ParamDefaults>(
  defaults: T,
): [T, (updates: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultsRef = useRef(defaults);

  const parse = useCallback((): T => {
    const state = { ...defaultsRef.current } as T;
    for (const key in defaultsRef.current) {
      const raw = searchParams.get(key);
      if (raw === null) continue;
      const def = defaultsRef.current[key];
      if (typeof def === 'number') {
        const n = parseFloat(raw);
        if (!isNaN(n)) (state as Record<string, Primitive>)[key] = n;
      } else if (typeof def === 'boolean') {
        (state as Record<string, Primitive>)[key] = raw === 'true';
      } else {
        (state as Record<string, Primitive>)[key] = raw;
      }
    }
    return state;
  }, [searchParams]);

  const [state, setState] = useState<T>(parse);

  const setParams = useCallback(
    (updates: Partial<T>) => {
      setState(prev => {
        const next = { ...prev, ...updates };
        const p = new URLSearchParams(searchParams);
        for (const key in updates) {
          p.set(key, String(updates[key]));
        }
        setSearchParams(p, { replace: true });
        return next;
      });
    },
    [searchParams, setSearchParams],
  );

  return [state, setParams];
}
