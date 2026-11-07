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
      title={`Activer le thème ${nextTheme}`}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rose-200 bg-white/55 text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-soft"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
