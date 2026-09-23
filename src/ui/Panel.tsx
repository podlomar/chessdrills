import type { ComponentChildren } from 'preact';
import styles from '@/ui/Panel.module.css';

interface PanelProps {
  tone: 'danger' | 'success';
  children: ComponentChildren;
}

export function Panel({ tone, children }: PanelProps) {
  return <div class={`${styles.panel} ${styles[tone]}`}>{children}</div>;
}
