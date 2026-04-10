import { useState } from 'react';
import styles from './TrainingBoard.module.css';

export type PositionType = 'twoKingsAndPawn' | 'twoKingsAndQueen';

interface Props {
  type: PositionType;
  title: string;
  initialFen: string;
}

export const TrainingBoard = ({ type, title, initialFen }: Props) => {
  const [fen, setFen] = useState(initialFen);
  const [loading, setLoading] = useState(false);

  const regenerate = async () => {
    setLoading(true);
    const res = await fetch(`/api/position?type=${type}`);
    const data = await res.json();
    setFen(data.fen);
    setLoading(false);
  };

  const placement = fen.split(' ')[0];
  const chessComUrl = `https://www.chess.com/practice/custom?fen=${encodeURIComponent(fen)}`;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <img
        src={`/board?fen=${placement}`}
        className={styles.board}
        alt={`${title} chess position`}
      />
      <div className={styles.actions}>
        <button className={styles.button} onClick={regenerate} disabled={loading}>
          {loading ? 'Loading…' : 'Regenerate'}
        </button>
        <a href={chessComUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
          Practice on Chess.com
        </a>
      </div>
    </div>
  );
};
