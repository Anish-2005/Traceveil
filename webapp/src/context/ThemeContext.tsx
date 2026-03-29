'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type Theme = 'dark' | 'light';
type ThemeTransitionOrigin = { x: number; y: number };

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (origin?: ThemeTransitionOrigin) => void;
}

const THEME_STORAGE_KEY = 'traceveil.theme';
const THEME_TRANSITION_DURATION_MS = 560;

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // Ignore storage read failures.
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
}

function shouldReduceMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const cleanupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const next = resolveInitialTheme();
    setThemeState(next);
    applyTheme(next);
  }, []);

  const clearThemeTransition = useCallback(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove(
      'theme-transitioning',
      'theme-vt-running',
      'theme-transition-to-light',
      'theme-transition-to-dark'
    );
    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearThemeTransition();
    };
  }, [clearThemeTransition]);

  const runThemeTransition = useCallback((nextTheme: Theme, origin?: ThemeTransitionOrigin) => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    type ViewTransitionDocument = Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> };
    };

    const root = document.documentElement;
    const transitionDocument = document as ViewTransitionDocument;
    const centerX = Math.round(window.innerWidth / 2);
    const centerY = Math.round(window.innerHeight / 2);
    const x = Math.round(origin?.x ?? centerX);
    const y = Math.round(origin?.y ?? centerY);

    root.style.setProperty('--theme-transition-origin-x', `${x}px`);
    root.style.setProperty('--theme-transition-origin-y', `${y}px`);
    root.style.setProperty('--theme-transition-duration', `${THEME_TRANSITION_DURATION_MS}ms`);

    if (shouldReduceMotion()) {
      applyTheme(nextTheme);
      return;
    }

    if (typeof transitionDocument.startViewTransition === 'function') {
      clearThemeTransition();
      root.classList.add('theme-vt-running', nextTheme === 'light' ? 'theme-transition-to-light' : 'theme-transition-to-dark');
      const transition = transitionDocument.startViewTransition(() => {
        applyTheme(nextTheme);
      });
      void transition.finished.finally(() => {
        clearThemeTransition();
      });
      return;
    }

    clearThemeTransition();
    root.classList.add('theme-transitioning', nextTheme === 'light' ? 'theme-transition-to-light' : 'theme-transition-to-dark');
    requestAnimationFrame(() => {
      applyTheme(nextTheme);
    });

    cleanupTimerRef.current = window.setTimeout(() => {
      clearThemeTransition();
    }, THEME_TRANSITION_DURATION_MS + 40);
  }, [clearThemeTransition]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    runThemeTransition(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage write failures.
    }
  }, [runThemeTransition]);

  const toggleTheme = useCallback((origin?: ThemeTransitionOrigin) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    runThemeTransition(nextTheme, origin);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage write failures.
    }
  }, [runThemeTransition, theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
