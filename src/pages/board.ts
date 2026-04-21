import type { APIRoute } from 'astro';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SVGBoard } from '../chessboard/SVGBoard/index.js';
import { Board } from 'immutable-chess';

export const GET: APIRoute = ({ url }) => {
  const fen = url.searchParams.get('fen') ?? 'rn1qkbnr/pppb1ppp/4p3/3p4/3P4/4P3/PPPB1PPP/RN1QKBNR';
  const orientation = url.searchParams.get('orientation') === 'black' ? 'black' : 'white';
  const board = Board.fromFen(fen);
  const svg = renderToStaticMarkup(createElement(SVGBoard, { board, orientation }));

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
};
