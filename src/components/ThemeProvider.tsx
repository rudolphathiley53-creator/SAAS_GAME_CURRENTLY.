'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { ThemeContext, type Theme } from '@/components/ThemeContext';

const STORAGE_KEY = 'gocoins-theme';
const CHANGE_EVENT = 'gocoins-theme-change';

function getThemeSnapshot(): Theme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dark'
      ? 'dark'
      : 'light';
  } catch (error) {
    console.warn('Unable to read the saved theme preference.', error);
    return 'light';
  }
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function persistTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Unable to save the theme preference.', error);
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    persistTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
