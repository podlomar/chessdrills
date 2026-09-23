export type Route = { name: 'library' } | { name: 'play' } | { name: 'train'; openingId: string };

export const parseRoute = (hash: string): Route => {
  const [screen, openingId] = hash.replace(/^#\/?/, '').split('/');
  if (screen === 'play') {
    return { name: 'play' };
  }
  if (screen === 'train' && openingId) {
    return { name: 'train', openingId: decodeURIComponent(openingId) };
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
      return `#/train/${encodeURIComponent(route.openingId)}`;
  }
};
