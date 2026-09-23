export type Color = 'white' | 'black';

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Square = `${File}${Rank}`;

export type PieceKind = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PromotionKind = Exclude<PieceKind, 'pawn' | 'king'>;

export interface Piece {
  color: Color;
  kind: PieceKind;
}

export interface MoveIntent {
  from: Square;
  to: Square;
  promotion?: PromotionKind;
}

export interface Move extends MoveIntent {
  san: string;
  piece: Piece;
  captured?: PieceKind;
  givesCheck: boolean;
}

export type Fen = string;
