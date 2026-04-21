import { useCallback, useEffect, useState } from 'react';
import styles from './TrainingBoard.module.css';
import type { Position } from '../generators/generator';

interface Props {
  type: string;
  title: string;
}

type PositionState = Position | 'loading';

export const TrainingBoard = ({ type, title }: Props) => {
  const [position, setPosition] = useState<PositionState>('loading');
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(async () => {
    setPosition('loading');
    const res = await fetch(`/api/position/${type}`);
    const data = await res.json();
    setPosition(data);
  }, [type]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const copyFen = async () => {
    if (position === 'loading') return;
    await navigator.clipboard.writeText(position.fen);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = position === 'loading';
  const placement = isLoading ? '' : position.fen.split(' ')[0];
  const orientation = isLoading ? 'white' : position.turnColor;
  const boardSrc = isLoading
    ? '/placeholder-board.svg'
    : `/board?fen=${placement}&orientation=${orientation}`;
  const chessComUrl = isLoading
    ? '#'
    : `https://www.chess.com/practice/custom?fen=${encodeURIComponent(position.fen)}`;
  const canRegenerate = !isLoading && position.randomized !== false;

  return (
    <div className={styles.card}>
      <img src={boardSrc} className={styles.board} alt={isLoading ? 'Loading…' : title} />
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        {!isLoading && <p className={styles.description}>{position.description}</p>}
        <div className={styles.controls}>
          <button
            className={styles.btn}
            onClick={regenerate}
            disabled={!canRegenerate}
          >
            ↺ New
          </button>
          <button
            className={`${styles.btn}${copied ? ` ${styles.active}` : ''}`}
            onClick={copyFen}
            disabled={isLoading}
          >
            {copied ? '✓ Copied' : 'Copy FEN'}
          </button>
          <a
            href={chessComUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btn}
            onClick={isLoading ? (e) => e.preventDefault() : undefined}
          >
            Chess.com ↗
          </a>
        </div>
      </div>
    </div>
  );
};
