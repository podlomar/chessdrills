import { useEffect, useRef } from 'preact/hooks';
import { Piece } from '@/board/Piece.tsx';
import styles from '@/board/PromotionPicker.module.css';
import type { Color, PromotionKind } from '@/chess/types.ts';

interface PromotionPickerProps {
  color: Color;
  onPick: (kind: PromotionKind) => void;
  onCancel: () => void;
}

const kinds: readonly PromotionKind[] = ['queen', 'knight', 'rook', 'bishop'];

export function PromotionPicker({ color, onPick, onCancel }: PromotionPickerProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape already cancels through the native cancel event.
    <dialog
      ref={dialog}
      class={styles.picker}
      aria-label="Promote to"
      onCancel={onCancel}
      // A click on the backdrop lands on the dialog itself.
      onClick={(event) => event.target === dialog.current && onCancel()}
    >
      {kinds.map((kind) => (
        <button
          key={kind}
          type="button"
          class={styles.choice}
          aria-label={kind}
          onClick={() => onPick(kind)}
        >
          <Piece piece={{ color, kind }} />
        </button>
      ))}
    </dialog>
  );
}
