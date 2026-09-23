import { useLayoutEffect, useState } from 'preact/hooks';
import {
  applyPreference,
  readPreference,
  type ThemePreference,
  writePreference,
} from '@/theme/preference.ts';

// Merely reading `window.localStorage` throws when site data is blocked.
const browserStorage = (): Storage | undefined => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

// The body's resolved background is the one place the active theme's colour exists as a value.
const syncThemeColor = (): void => {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', getComputedStyle(document.body).backgroundColor);
};

export const useTheme = (): [ThemePreference, (preference: ThemePreference) => void] => {
  const [preference, setPreference] = useState(() => readPreference(browserStorage()));

  useLayoutEffect(() => {
    applyPreference(document.documentElement, preference);
    writePreference(browserStorage(), preference);
    syncThemeColor();
    if (preference !== 'system') {
      return;
    }
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    query.addEventListener('change', syncThemeColor);
    return () => query.removeEventListener('change', syncThemeColor);
  }, [preference]);

  return [preference, setPreference];
};
