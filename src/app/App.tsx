import { useState } from 'preact/hooks';
import styles from '@/app/App.module.css';
import { Board } from '@/board/Board.tsx';
import { positionFromFen } from '@/chess/position.ts';
import { useTheme } from '@/theme/useTheme.ts';
import { ThemeSwitcher } from '@/ui/ThemeSwitcher.tsx';

const startPosition = positionFromFen();

export function App() {
  const [preference, setPreference] = useTheme();
  const [position, setPosition] = useState(startPosition);

  return (
    <div class={styles.shell}>
      <header class={styles.header}>
        <span class={styles.wordmark}>chessdrills</span>
        <ThemeSwitcher preference={preference} onChange={setPreference} />
      </header>
      <main class={styles.main}>
        <Board
          position={position}
          orientation="white"
          movable="both"
          onMove={(intent) => setPosition(position.play(intent)?.position ?? position)}
        />
      </main>
    </div>
  );
}
