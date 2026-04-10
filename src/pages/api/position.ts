import type { APIRoute } from 'astro';
import { twoKingsAndPawn } from '../../chessboard/generate.js';
import { twoKingsAndQueen } from '../../generators/twoKingsAndQueen.js';

export const GET: APIRoute = ({ url }) => {
  const type = url.searchParams.get('type');

  let fen: string;
  if (type === 'twoKingsAndPawn') {
    fen = twoKingsAndPawn();
  } else if (type === 'twoKingsAndQueen') {
    fen = twoKingsAndQueen();
  } else {
    return new Response('Unknown position type', { status: 400 });
  }

  return new Response(JSON.stringify({ fen }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
