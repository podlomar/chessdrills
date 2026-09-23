export type ThemePreference = 'system' | 'light' | 'dark';

export const STORAGE_KEY = 'chessdrills:theme';

export const parsePreference = (value: string | null): ThemePreference =>
  value === 'light' || value === 'dark' ? value : 'system';

// Storage can be missing or throw (private mode, blocked site data); the theme is never worth an error.
export const readPreference = (storage: Storage | undefined): ThemePreference => {
  try {
    return parsePreference(storage?.getItem(STORAGE_KEY) ?? null);
  } catch {
    return 'system';
  }
};

export const writePreference = (
  storage: Storage | undefined,
  preference: ThemePreference,
): void => {
  try {
    if (preference === 'system') {
      storage?.removeItem(STORAGE_KEY);
    } else {
      storage?.setItem(STORAGE_KEY, preference);
    }
  } catch {}
};

export const applyPreference = (root: HTMLElement, preference: ThemePreference): void => {
  if (preference === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = preference;
  }
};
