import styles from '@/app/App.module.css';
import { compileOpening } from '@/openings/compile.ts';
import { openSicilian } from '@/openings/library/open-sicilian.ts';
import { Trainer } from '@/screens/Trainer.tsx';
import { useTheme } from '@/theme/useTheme.ts';
import { ThemeSwitcher } from '@/ui/ThemeSwitcher.tsx';

const trainedOpening = compileOpening(openSicilian);

export function App() {
  const [preference, setPreference] = useTheme();

  return (
    <div class={styles.shell}>
      <header class={styles.header}>
        <span class={styles.wordmark}>chessdrills</span>
        <ThemeSwitcher preference={preference} onChange={setPreference} />
      </header>
      <main class={styles.main}>
        {trainedOpening.match(
          (opening) => (
            <Trainer opening={opening} />
          ),
          (error) => (
            <p role="alert">{error.message}</p>
          ),
        )}
      </main>
    </div>
  );
}
