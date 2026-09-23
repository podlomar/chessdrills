import type { ComponentChildren } from 'preact';
import styles from '@/ui/Button.module.css';

interface ButtonProps {
  children: ComponentChildren;
  disabled?: boolean;
  onClick: () => void;
}

export function Button({ children, disabled = false, onClick }: ButtonProps) {
  return (
    <button type="button" class={styles.button} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
