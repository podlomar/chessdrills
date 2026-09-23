import { describe, expect, it } from 'vitest';
import { type Position, positionFromFen } from '@/chess/position.ts';
import type { Square } from '@/chess/types.ts';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const PROMOTION_FEN = '1r5k/P7/8/8/8/8/8/K7 w - - 0 1';

const playSans = (position: Position, sans: string): Position | undefined =>
  sans
    .split(' ')
    .reduce<Position | undefined>((current, san) => current?.playSan(san)?.position, position);

const destinations = (position: Position, square: Square): Square[] =>
  position
    .legalMovesFrom(square)
    .map((move) => move.to)
    .sort();

describe('positionFromFen', () => {
  it('defaults to the starting position', () => {
    const position = positionFromFen();
    expect(position.fen).toBe(START_FEN);
    expect(position.turn).toBe('white');
    expect(position.inCheck).toBe(false);
    expect(position.isGameOver).toBe(false);
  });

  it('loads a custom FEN', () => {
    const position = positionFromFen(PROMOTION_FEN);
    expect(position.turn).toBe('white');
    expect(position.pieceAt('a7')).toEqual({ color: 'white', kind: 'pawn' });
  });
});

describe('pieceAt', () => {
  it('describes pieces in our vocabulary', () => {
    const position = positionFromFen();
    expect(position.pieceAt('e1')).toEqual({ color: 'white', kind: 'king' });
    expect(position.pieceAt('g8')).toEqual({ color: 'black', kind: 'knight' });
    expect(position.pieceAt('e4')).toBeUndefined();
  });
});

describe('legalMovesFrom', () => {
  it('lists the destinations of a piece', () => {
    const position = positionFromFen();
    expect(destinations(position, 'e2')).toEqual(['e3', 'e4']);
    expect(destinations(position, 'g1')).toEqual(['f3', 'h3']);
  });

  it('is empty for blocked pieces, empty squares and the side not to move', () => {
    const position = positionFromFen();
    expect(position.legalMovesFrom('a1')).toEqual([]);
    expect(position.legalMovesFrom('e4')).toEqual([]);
    expect(position.legalMovesFrom('e7')).toEqual([]);
  });

  it('lists every promotion choice', () => {
    const promotions = positionFromFen(PROMOTION_FEN)
      .legalMovesFrom('a7')
      .filter((move) => move.to === 'a8')
      .map((move) => move.promotion);
    expect(promotions.sort()).toEqual(['bishop', 'knight', 'queen', 'rook']);
  });
});

describe('play', () => {
  it('returns the move and a new position without changing the old one', () => {
    const before = positionFromFen();
    const result = before.play({ from: 'e2', to: 'e4' });

    expect(result?.move).toEqual({
      from: 'e2',
      to: 'e4',
      san: 'e4',
      piece: { color: 'white', kind: 'pawn' },
      givesCheck: false,
    });
    expect(result?.position.turn).toBe('black');
    expect(result?.position.pieceAt('e4')).toEqual({ color: 'white', kind: 'pawn' });
    expect(before.fen).toBe(START_FEN);
    expect(before.pieceAt('e4')).toBeUndefined();
  });

  it('rejects illegal moves', () => {
    const position = positionFromFen();
    expect(position.play({ from: 'e2', to: 'e5' })).toBeUndefined();
    expect(position.play({ from: 'e7', to: 'e5' })).toBeUndefined();
    expect(position.play({ from: 'e4', to: 'e5' })).toBeUndefined();
  });

  it('reports captures, including en passant', () => {
    const position = playSans(positionFromFen(), 'e4 a6 e5 d5');
    const result = position?.play({ from: 'e5', to: 'd6' });
    expect(result?.move).toMatchObject({ san: 'exd6', captured: 'pawn' });
    expect(result?.position.pieceAt('d5')).toBeUndefined();
  });

  it('promotes to the chosen piece', () => {
    const result = positionFromFen(PROMOTION_FEN).play({
      from: 'a7',
      to: 'b8',
      promotion: 'knight',
    });
    expect(result?.move).toMatchObject({ san: 'axb8=N', promotion: 'knight', captured: 'rook' });
    expect(result?.position.pieceAt('b8')).toEqual({ color: 'white', kind: 'knight' });
  });

  it('rejects a promotion without a chosen piece', () => {
    expect(positionFromFen(PROMOTION_FEN).play({ from: 'a7', to: 'a8' })).toBeUndefined();
  });
});

describe('check and game over', () => {
  it('flags a checking move and the checked position', () => {
    const result = playSans(positionFromFen(), 'e4 f5')?.play({ from: 'd1', to: 'h5' });
    expect(result?.move).toMatchObject({ san: 'Qh5+', givesCheck: true });
    expect(result?.position.inCheck).toBe(true);
    expect(result?.position.isGameOver).toBe(false);
  });

  it('ends the game on checkmate', () => {
    const mated = playSans(positionFromFen(), 'f3 e5 g4 Qh4#');
    expect(mated?.inCheck).toBe(true);
    expect(mated?.isGameOver).toBe(true);
    expect(mated?.turn).toBe('white');
  });

  it('ends the game on stalemate', () => {
    const stalemate = positionFromFen('k7/8/1Q6/8/8/8/8/7K w - - 0 1').playSan('Qc7');
    expect(stalemate?.move.givesCheck).toBe(false);
    expect(stalemate?.position.isGameOver).toBe(true);
    expect(stalemate?.position.inCheck).toBe(false);
  });
});

describe('playSan', () => {
  it('plays a sequence of SAN moves', () => {
    const position = playSans(positionFromFen(), 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6');
    expect(position?.fen).toBe('rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6');
  });

  it('plays castling', () => {
    const result = playSans(positionFromFen(), 'e4 e5 Nf3 Nc6 Bc4 Bc5')?.playSan('O-O');
    expect(result?.move).toMatchObject({ from: 'e1', to: 'g1', san: 'O-O' });
    expect(result?.position.pieceAt('f1')).toEqual({ color: 'white', kind: 'rook' });
  });

  it('rejects illegal and malformed SAN', () => {
    const position = positionFromFen();
    expect(position.playSan('Nf6')).toBeUndefined();
    expect(position.playSan('e5')).toBeUndefined();
    expect(position.playSan('hello')).toBeUndefined();
    expect(position.playSan('')).toBeUndefined();
  });
});
