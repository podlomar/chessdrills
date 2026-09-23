import type { Color, Fen } from '@/chess/types.ts';

export interface ResourceLink {
  kind: 'video' | 'article' | 'study';
  label: string;
  url: string;
}

export interface Annotation {
  name?: string;
  comment?: string;
  links?: readonly ResourceLink[];
}

export interface LineSpec {
  moves: string;
  note?: Annotation;
  weight?: number;
  branches?: readonly LineSpec[];
}

export interface OpeningSpec {
  id: string;
  name: string;
  side: Color;
  startFen?: Fen;
  description?: string;
  lines: readonly LineSpec[];
}
