import type { ComponentChildren } from 'preact';
import styles from '@/ui/BoardLayout.module.css';

interface BoardLayoutProps {
  label: string;
  board: ComponentChildren;
  children: ComponentChildren;
}

export function BoardLayout({ label, board, children }: BoardLayoutProps) {
  return (
    <section class={styles.layout} aria-label={label}>
      {board}
      <div class={styles.aside}>{children}</div>
    </section>
  );
}
