import { useEffect, useState } from 'preact/hooks';
import { parseRoute, type Route, routeHref } from '@/app/route.ts';

// Going to the current route fires no hashchange, so the caller gets told instead.
export const navigate = (route: Route, onSameRoute: () => void): void => {
  const href = routeHref(route);
  if (window.location.hash === href) {
    onSameRoute();
  } else {
    window.location.hash = href;
  }
};

export const useRoute = (): Route => {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));

  useEffect(() => {
    const update = (): void => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  return route;
};
