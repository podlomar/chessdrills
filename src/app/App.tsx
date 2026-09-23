import styles from '@/app/App.module.css';
import { FreePlay } from '@/screens/FreePlay.tsx';
import { useTheme } from '@/theme/useTheme.ts';
import { ThemeSwitcher } from '@/ui/ThemeSwitcher.tsx';

export function App() {
  const [preference, setPreference] = useTheme();

  return (
    <div class={styles.shell}>
      <header class={styles.header}>
        <span class={styles.wordmark}>chessdrills</span>
        <ThemeSwitcher preference={preference} onChange={setPreference} />
      </header>
      <main class={styles.main}>
        <FreePlay />
      </main>
    </div>
  );
}
