import type { ThemePreference } from '@/theme/preference.ts';
import styles from '@/ui/ThemeSwitcher.module.css';

interface ThemeSwitcherProps {
  preference: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}

const options: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeSwitcher({ preference, onChange }: ThemeSwitcherProps) {
  return (
    <fieldset class={styles.switcher} aria-label="Theme">
      {options.map(({ value, label }) => (
        <label key={value} class={styles.option}>
          <input
            class={styles.input}
            type="radio"
            name="theme"
            value={value}
            checked={value === preference}
            onChange={() => onChange(value)}
          />
          {label}
        </label>
      ))}
    </fieldset>
  );
}
