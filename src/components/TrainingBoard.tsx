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

  const placement = position === 'loading' ? '' : position.fen.split(' ')[0];
  const chessComUrl = `https://www.chess.com/practice/custom?fen=${encodeURIComponent(position === 'loading' ? '' : position.fen)}`;

  if (position === 'loading') {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        <img src="/placeholder-board.svg" className={styles.board} alt="Loading chess position" />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <img
        src={`/board?fen=${placement}&orientation=${position.turnColor}`}
        className={styles.board}
        alt={`${title} chess position`}
      />
      <div className={styles.actions}>
        <button className={styles.button} onClick={regenerate} disabled={position.randomized === false}>
          Regenerate
        </button>
        <button className={styles.button} onClick={copyFen}>
          {copied ? 'Copied!' : 'Copy FEN'}
        </button>
        <a href={chessComUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
          Practice on Chess.com
        </a>
      </div>
    </div>
  );
};
