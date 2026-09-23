import { Result } from 'neverthrow';
import { compileOpening } from '@/openings/compile.ts';
import type { OpeningError } from '@/openings/errors.ts';
import { caroKann } from '@/openings/library/caro-kann.ts';
import { openSicilian } from '@/openings/library/open-sicilian.ts';
import type { OpeningSpec } from '@/openings/spec.ts';
import type { Opening } from '@/openings/tree.ts';

export const openingSpecs: readonly OpeningSpec[] = [openSicilian, caroKann];

export const compileLibrary = (): Result<readonly Opening[], OpeningError> =>
  Result.combine(openingSpecs.map(compileOpening));
