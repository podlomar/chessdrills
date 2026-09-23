import { routeHref } from '@/app/route.ts';
import type { Color } from '@/chess/types.ts';
import { countLines } from '@/openings/stats.ts';
import type { Opening } from '@/openings/tree.ts';
import styles from '@/screens/Library.module.css';

interface LibraryProps {
  openings: readonly Opening[];
}

const sideLabel: Record<Color, string> = { white: 'You play White', black: 'You play Black' };

const linesLabel = (count: number): string => (count === 1 ? '1 line' : `${count} lines`);

export function Library({ openings }: LibraryProps) {
  return (
    <section class={styles.library} aria-labelledby="library-title">
      <h1 id="library-title" class={styles.title}>
        Openings
      </h1>
      <ul class={styles.list}>
        {openings.map((opening) => (
          <li key={opening.id} class={styles.card}>
            <h2 class={styles.name}>
              <a class={styles.link} href={routeHref({ name: 'train', openingId: opening.id })}>
                {opening.name}
              </a>
            </h2>
            <p class={styles.meta}>
              {sideLabel[opening.side]} · {linesLabel(countLines(opening))}
            </p>
            {opening.description && <p class={styles.description}>{opening.description}</p>}
          </li>
        ))}
      </ul>
      <p class={styles.meta}>
        Or <a href={routeHref({ name: 'play' })}>play freely</a> from the starting position.
      </p>
    </section>
  );
}
