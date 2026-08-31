'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  /** False until the client has reconciled with the pre-paint script. */
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const STORAGE_KEY = 'atlasaura-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* The inline script in layout.tsx has already written the correct value to
     the html element before paint, so the DOM — not localStorage — is the
     source of truth on mount. */
  useEffect(() => {
    const fromDom = document.documentElement.getAttribute('data-theme');
    setThemeState(fromDom === 'light' ? 'light' : 'dark');
    setMounted(true);
  }, []);

  const apply = useCallback((next: Theme) => {
    const root = document.documentElement;

    // Apply switching attribute to gate the smooth synchronized CSS transitions
    root.setAttribute('data-theme-switching', '');
    root.setAttribute('data-theme', next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — the in-memory theme still applies */
    }

    if (switchTimer.current) clearTimeout(switchTimer.current);
    // Exact 450ms synchronized transition; removes attribute at 460ms
    switchTimer.current = setTimeout(() => {
      root.removeAttribute('data-theme-switching');
    }, 460);
  }, []);

  useEffect(() => () => {
    if (switchTimer.current) clearTimeout(switchTimer.current);
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      apply(next);
    },
    [apply],
  );

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      apply(next);
      return next;
    });
  }, [apply]);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
