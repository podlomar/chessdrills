import type { Color as ChessJsColor, Piece as ChessJsPiece, PieceSymbol } from 'chess.js';
import type { Color, Piece, PieceKind, PromotionKind } from '@/chess/types.ts';

const pieceKinds: Record<PieceSymbol, PieceKind> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king',
};

const promotionKinds: Partial<Record<PieceSymbol, PromotionKind>> = {
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
};

const promotionSymbols: Record<PromotionKind, PieceSymbol> = {
  knight: 'n',
  bishop: 'b',
  rook: 'r',
  queen: 'q',
};

export const toColor = (color: ChessJsColor): Color => (color === 'w' ? 'white' : 'black');

export const toPieceKind = (symbol: PieceSymbol): PieceKind => pieceKinds[symbol];

export const toPromotionKind = (symbol: PieceSymbol): PromotionKind | undefined =>
  promotionKinds[symbol];

export const toPromotionSymbol = (kind: PromotionKind): PieceSymbol => promotionSymbols[kind];

export const toPiece = (piece: ChessJsPiece): Piece => ({
  color: toColor(piece.color),
  kind: toPieceKind(piece.type),
});
