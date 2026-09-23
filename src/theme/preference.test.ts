import { describe, expect, it } from 'vitest';
import {
  parsePreference,
  readPreference,
  STORAGE_KEY,
  writePreference,
} from '@/theme/preference.ts';

const memoryStorage = (entries: Record<string, string> = {}): Storage => {
  const items = new Map(Object.entries(entries));
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key);
    },
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
};

const failingStorage = (): Storage => {
  const fail = () => {
    throw new DOMException('Storage disabled', 'SecurityError');
  };
  return { ...memoryStorage(), getItem: fail, setItem: fail, removeItem: fail };
};

describe('parsePreference', () => {
  it.each(['light', 'dark', 'system'] as const)('accepts %s', (value) => {
    expect(parsePreference(value)).toBe(value);
  });

  it.each([null, '', 'Dark', 'blue'])('falls back to system for %j', (value) => {
    expect(parsePreference(value)).toBe('system');
  });
});

describe('readPreference', () => {
  it('reads the stored preference', () => {
    expect(readPreference(memoryStorage({ [STORAGE_KEY]: 'dark' }))).toBe('dark');
  });

  it('falls back to system when nothing or garbage is stored', () => {
    expect(readPreference(memoryStorage())).toBe('system');
    expect(readPreference(memoryStorage({ [STORAGE_KEY]: 'sepia' }))).toBe('system');
  });

  it('falls back to system without storage', () => {
    expect(readPreference(undefined)).toBe('system');
  });

  it('falls back to system when storage throws', () => {
    expect(readPreference(failingStorage())).toBe('system');
  });
});

describe('writePreference', () => {
  it('stores an explicit preference', () => {
    const storage = memoryStorage();
    writePreference(storage, 'light');
    expect(storage.getItem(STORAGE_KEY)).toBe('light');
  });

  it('removes the key for system', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: 'dark' });
    writePreference(storage, 'system');
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('round-trips through readPreference', () => {
    const storage = memoryStorage();
    writePreference(storage, 'dark');
    expect(readPreference(storage)).toBe('dark');
  });

  it('ignores missing or throwing storage', () => {
    expect(() => writePreference(undefined, 'dark')).not.toThrow();
    expect(() => writePreference(failingStorage(), 'dark')).not.toThrow();
  });
});
