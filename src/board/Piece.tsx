import styles from '@/board/Piece.module.css';
import bb from '@/board/pieces/bb.svg';
import bw from '@/board/pieces/bw.svg';
import kb from '@/board/pieces/kb.svg';
import kw from '@/board/pieces/kw.svg';
import nb from '@/board/pieces/nb.svg';
import nw from '@/board/pieces/nw.svg';
import pb from '@/board/pieces/pb.svg';
import pw from '@/board/pieces/pw.svg';
import qb from '@/board/pieces/qb.svg';
import qw from '@/board/pieces/qw.svg';
import rb from '@/board/pieces/rb.svg';
import rw from '@/board/pieces/rw.svg';
import type { Piece as ChessPiece, Color, PieceKind } from '@/chess/types.ts';

const images: Record<Color, Record<PieceKind, string>> = {
  white: { king: kw, queen: qw, rook: rw, bishop: bw, knight: nw, pawn: pw },
  black: { king: kb, queen: qb, rook: rb, bishop: bb, knight: nb, pawn: pb },
};

interface PieceProps {
  piece: ChessPiece;
}

export function Piece({ piece }: PieceProps) {
  return (
    <img class={styles.piece} src={images[piece.color][piece.kind]} alt="" draggable={false} />
  );
}
