import styles from '@/app/App.module.css';
import { type Route, routeHref } from '@/app/route.ts';
import { useRoute } from '@/app/useRoute.ts';
import { compileLibrary } from '@/openings/library/index.ts';
import type { Opening } from '@/openings/tree.ts';
import { FreePlay } from '@/screens/FreePlay.tsx';
import { Trainer } from '@/screens/Trainer.tsx';
import { useTheme } from '@/theme/useTheme.ts';
import { ThemeSwitcher } from '@/ui/ThemeSwitcher.tsx';

const library = compileLibrary();

const renderScreen = (route: Route, openings: readonly Opening[]) => {
  switch (route.name) {
    case 'play':
      return <FreePlay />;
    case 'library':
    case 'train': {
      const opening =
        route.name === 'train'
          ? openings.find((entry) => entry.id === route.openingId)
          : openings[0];
      return opening ? (
        <Trainer key={opening.id} opening={opening} />
      ) : (
        <p role="alert">There is no opening with this id.</p>
      );
    }
  }
};

export function App() {
  const [preference, setPreference] = useTheme();
  const route = useRoute();

  return (
    <div class={styles.shell}>
      <header class={styles.header}>
        <a class={styles.wordmark} href={routeHref({ name: 'library' })}>
          chessdrills
        </a>
        <ThemeSwitcher preference={preference} onChange={setPreference} />
      </header>
      <main class={styles.main}>
        {library.match(
          (openings) => renderScreen(route, openings),
          (error) => (
            <p role="alert">{error.message}</p>
          ),
        )}
      </main>
    </div>
  );
}
