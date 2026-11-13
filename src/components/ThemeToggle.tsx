'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'light' ? 'sombre' : 'clair';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Activer le thème ${nextTheme}`}
      aria-pressed={theme === 'dark'}
      title={`Activer le thème ${nextTheme}`}
      className="theme-toggle grid h-10 w-10 shrink-0 place-items-center rounded-full backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:-translate-y-0.5"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
