import { JSX } from "react";
import { twoKingsAndPawn } from "../../chessboard/generate.js";
import './styles.css';

export const HomePage = (): JSX.Element => {
  // const fullFen = twoKingsAndPawn();
  // starting position
  const fullFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const placement = fullFen.split(' ')[0];

  const chessComUrl = `https://www.chess.com/practice/custom?fen=${encodeURIComponent(fullFen)}`;

  return (
    <div className="container">
      <h1>Welcome to IonBeam</h1>
      <img src={`/board?fen=${placement}`} className="board" />
      <a href={chessComUrl} target="_blank" rel="noopener noreferrer">Chess.com</a>
    </div>
  );
};
