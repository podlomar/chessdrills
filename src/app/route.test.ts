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
    expect(parseRoute('#/train/open-sicilian/e4%20c5%20Nf3')).toEqual({
      name: 'train',
      openingId: 'open-sicilian',
      lineId: 'e4 c5 Nf3',
    });
  });

  it.each<Route>([
    { name: 'library' },
    { name: 'play' },
    { name: 'train', openingId: 'caro-kann' },
    { name: 'train', openingId: 'odd id/with slash' },
    { name: 'train', openingId: 'caro-kann', lineId: 'e4 c6 d4 d5 exd5 cxd5 c4 Nf6' },
    { name: 'train', openingId: 'wayward', lineId: 'e4 e5 Qh5 Nc6 Bc4 g6 Qf3 Nf6 Qb3' },
  ])('round-trips %j through its href', (route) => {
    expect(parseRoute(routeHref(route))).toEqual(route);
  });
});
