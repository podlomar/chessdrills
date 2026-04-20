import { Board, Piece } from 'immutable-chess';
import { isLegal } from 'immutable-chess/rules';
import { register } from '../generators/registry.js';

const randomIndex = (): number => Math.floor(Math.random() * 64);

export const twoKingsAndPawn = (): string => {
  while (true) {
    const wk = randomIndex();
    const bk = randomIndex();
    const wp = randomIndex();

    if (wk === bk || wk === wp || bk === wp) continue;

    const board = Board.empty()
      .place(wk, Piece.WhiteKing)
      .place(bk, Piece.BlackKing)
      .place(wp, Piece.WhitePawn);

    if (!isLegal(board).legal) continue;

    return board.toFen() + ' w - - 0 1';
  }
};

register('twoKingsAndPawn', { generate: () => twoKingsAndPawn() });
