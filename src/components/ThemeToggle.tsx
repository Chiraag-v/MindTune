'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'promptperfect:theme';

function getSystemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Read localStorage only on the client after hydration
  useEffect(() => {
    const saved = (window.localStorage.getItem(STORAGE_KEY) as Theme | null) ?? null;
    const resolved = saved === 'light' || saved === 'dark' ? saved : getSystemTheme();
    setTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
      aria-label="Toggle theme"
    >
      {/* Render placeholder during SSR to avoid hydration mismatch */}
      {mounted
        ? theme === 'dark'
          ? <Sun className="h-4 w-4" />
          : <Moon className="h-4 w-4" />
        : <Moon className="h-4 w-4" />
      }
      <span className="hidden sm:inline">
        {mounted ? (theme === 'dark' ? 'Light' : 'Dark') : 'Dark'}
      </span>
    </button>
  );
}
