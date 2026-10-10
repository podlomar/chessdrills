export type Route =
  | { name: 'library' }
  | { name: 'play' }
  | { name: 'train'; openingId: string; lineId?: string };

export const parseRoute = (hash: string): Route => {
  const [screen, openingId, lineId] = hash.replace(/^#\/?/, '').split('/');
  if (screen === 'play') {
    return { name: 'play' };
  }
  if (screen === 'train' && openingId) {
    return lineId
      ? {
          name: 'train',
          openingId: decodeURIComponent(openingId),
          lineId: decodeURIComponent(lineId),
        }
      : { name: 'train', openingId: decodeURIComponent(openingId) };
  }
  return { name: 'library' };
};

export const routeHref = (route: Route): string => {
  switch (route.name) {
    case 'library':
      return '#/';
    case 'play':
      return '#/play';
    case 'train':
      return route.lineId === undefined
        ? `#/train/${encodeURIComponent(route.openingId)}`
        : `#/train/${encodeURIComponent(route.openingId)}/${encodeURIComponent(route.lineId)}`;
  }
};
