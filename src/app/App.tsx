import styles from '@/app/App.module.css';

export function App() {
  return (
    <div class={styles.shell}>
      <header class={styles.header}>
        <span class={styles.wordmark}>chessdrills</span>
      </header>
      <main class={styles.main} />
    </div>
  );
}
