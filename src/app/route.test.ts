import { describe, expect, it } from 'vitest';
import { parseRoute, type Route, routeHref } from '@/app/route.ts';

describe('parseRoute', () => {
  it.each(['', '#', '#/', '#/nowhere', '#/train', '#/train/'])(
    'reads %j as the library',
    (hash) => {
      expect(parseRoute(hash)).toEqual({ name: 'library' });
    },
  );

  it('reads free play and training routes', () => {
    expect(parseRoute('#/play')).toEqual({ name: 'play' });
    expect(parseRoute('#/train/open-sicilian')).toEqual({
      name: 'train',
      openingId: 'open-sicilian',
    });
  });

  it.each<Route>([
    { name: 'library' },
    { name: 'play' },
    { name: 'train', openingId: 'caro-kann' },
    { name: 'train', openingId: 'odd id/with slash' },
  ])('round-trips %j through its href', (route) => {
    expect(parseRoute(routeHref(route))).toEqual(route);
  });
});
