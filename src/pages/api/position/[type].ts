import type { APIRoute } from 'astro';
import '../../../generators/index.js';
import { lookup } from '../../../generators/registry.js';

export const GET: APIRoute = ({ params }) => {
  const gen = params.type ? lookup(params.type) : null;

  if (!gen) {
    return new Response('Unknown position type', { status: 400 });
  }

  return new Response(JSON.stringify(gen.generate(new URLSearchParams())), {
    headers: { 'Content-Type': 'application/json' },
  });
};
