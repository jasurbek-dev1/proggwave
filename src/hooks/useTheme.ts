import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved) return saved;
      return 'system';
    }
    return 'system';
  });

  const getEffectiveTheme = (t: Theme): 'light' | 'dark' => {
    if (t === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return t;
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(getEffectiveTheme(theme));
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (getEffectiveTheme(prev) === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setLightTheme = useCallback(() => setThemeState('light'), []);
  const setDarkTheme = useCallback(() => setThemeState('dark'), []);

  return {
    theme,
    isDark: getEffectiveTheme(theme) === 'dark',
    toggleTheme,
    setTheme,
    setLightTheme,
    setDarkTheme,
  };
};
