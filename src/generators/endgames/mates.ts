import { Board, Piece, PieceColor } from 'immutable-chess';
import { isLegal } from 'immutable-chess/rules';
import { register } from '../registry.js';
import type { Position } from '../generator.js';

const randomIndex = (): number => Math.floor(Math.random() * 64);

export const kq_vs_k = (): Position => {
  while (true) {
    const wk = randomIndex();
    const bk = randomIndex();
    const wq = randomIndex();

    if (wk === bk || wk === wq || bk === wq) continue;

    const board = Board.empty()
      .place(wk, Piece.WhiteKing)
      .place(bk, Piece.BlackKing)
      .place(wq, Piece.WhiteQueen);

    const isLegalResult = isLegal(board, { turnColor: PieceColor.White });
    if (!isLegalResult.legal) continue;

    return {
      fen: board.toFen() + ' w - - 0 1',
      turnColor: 'white',
      randomized: true,
      description: 'Use your king to push the enemy king to the edge, then deliver checkmate with the queen.',
    };
  }
};

register('kq_vs_k', { generate: () => kq_vs_k() });

export const kr_vs_k = (): Position => {
  while (true) {
    const wk = randomIndex();
    const bk = randomIndex();
    const wr = randomIndex();

    if (wk === bk || wk === wr || bk === wr) continue;

    const board = Board.empty()
      .place(wk, Piece.WhiteKing)
      .place(bk, Piece.BlackKing)
      .place(wr, Piece.WhiteRook);

    const isLegalResult = isLegal(board, { turnColor: PieceColor.White });
    if (!isLegalResult.legal) continue;

    return {
      fen: board.toFen() + ' w - - 0 1',
      turnColor: 'white',
      randomized: true,
      description: 'Use the rook to cut off ranks and files, then drive the enemy king to the edge with your king.',
    };
  }
};

register('kr_vs_k', { generate: () => kr_vs_k() });

export const kp_vs_k = (): Position => {
  return {
    fen: '8/8/4k3/8/4P3/4K3/8/8 w - - 0 1',
    turnColor: 'white',
    randomized: false,
    description: 'Advance the pawn to promotion. Watch out for the opposition — king position is everything.',
  };
};

register('kp_vs_k', { generate: () => kp_vs_k() });
