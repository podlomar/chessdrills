const pieces = ['p', 'r', 'n', 'b', 'q', 'k', 'P', 'R', 'N', 'B', 'Q', 'K'] as const;
type Piece = typeof pieces[number];

export function isPiece(char: string): char is Piece {
  return pieces.includes(char as Piece);
}

export type ChessBoard = (Piece | null)[];

export const fenToChessBoard = (fen: string): ChessBoard => {
  const board: ChessBoard = [];
  const rows = fen.split(' ')[0].split('/');

  for (const row of rows) {
    for (const char of row) {
      if (isPiece(char)) {
        board.push(char);
      } else {
        const emptySquares = parseInt(char, 10);
        for (let i = 0; i < emptySquares; i++) {
          board.push(null);
        }
      }
    }
  }

  return board;
};

export const chessBoardToFen = (board: ChessBoard): string => {
  let fen = '';
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row * 8 + col];
      if (piece) {
        if (emptyCount > 0) {
          fen += emptyCount.toString();
          emptyCount = 0;
        }
        fen += piece;
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount.toString();
    }
    if (row < 7) {
      fen += '/';
    }
  }
  return fen;
};
