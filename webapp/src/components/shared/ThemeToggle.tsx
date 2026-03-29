'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`theme-toggle-surface group inline-flex items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all ${
        compact ? 'h-8 w-8' : 'h-9 w-9'
      }`}
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
        <Sun
          className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLight ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLight ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'
          }`}
        />
      </span>
    </button>
  );
}
