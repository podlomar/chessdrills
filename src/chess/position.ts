import { Chess, validateFen } from 'chess.js';
import { toColor, toMove, toPiece, toPromotionSymbol } from '@/chess/mapping.ts';
import type { Color, Fen, Move, MoveIntent, Piece, Square } from '@/chess/types.ts';

export interface Position {
  readonly fen: Fen;
  readonly turn: Color;
  readonly moveNumber: number;
  readonly inCheck: boolean;
  readonly isGameOver: boolean;
  pieceAt(square: Square): Piece | undefined;
  legalMovesFrom(square: Square): readonly Move[];
  play(intent: MoveIntent): PlayResult | undefined;
  playSan(san: string): PlayResult | undefined;
}

export interface PlayResult {
  position: Position;
  move: Move;
}

type ChessJsMoveInput = Parameters<Chess['move']>[0];

// chess.js is mutable, so every read happens on a board no one else can move.
class ChessJsPosition implements Position {
  public readonly fen: Fen;
  public readonly turn: Color;
  public readonly moveNumber: number;
  public readonly inCheck: boolean;
  public readonly isGameOver: boolean;
  private readonly chess: Chess;

  public constructor(chess: Chess) {
    this.chess = chess;
    this.fen = chess.fen();
    this.turn = toColor(chess.turn());
    this.moveNumber = chess.moveNumber();
    this.inCheck = chess.inCheck();
    this.isGameOver = chess.isGameOver();
  }

  public pieceAt(square: Square): Piece | undefined {
    const piece = this.chess.get(square);
    return piece && toPiece(piece);
  }

  public legalMovesFrom(square: Square): readonly Move[] {
    return this.chess.moves({ square, verbose: true }).map(toMove);
  }

  public play(intent: MoveIntent): PlayResult | undefined {
    return this.playInput({
      from: intent.from,
      to: intent.to,
      promotion: intent.promotion && toPromotionSymbol(intent.promotion),
    });
  }

  public playSan(san: string): PlayResult | undefined {
    return this.playInput(san);
  }

  private playInput(input: ChessJsMoveInput): PlayResult | undefined {
    const next = new Chess(this.fen);
    // chess.js reports an illegal move only by throwing.
    try {
      const move = next.move(input);
      return { position: new ChessJsPosition(next), move: toMove(move) };
    } catch {
      return undefined;
    }
  }
}

export const isValidFen = (fen: Fen): boolean => validateFen(fen).ok;

export const positionFromFen = (fen?: Fen): Position => new ChessJsPosition(new Chess(fen));
