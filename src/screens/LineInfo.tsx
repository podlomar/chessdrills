import type { Annotation, ResourceLink } from '@/openings/spec.ts';
import styles from '@/screens/LineInfo.module.css';

interface LineInfoProps {
  names: readonly string[];
  notes: readonly Annotation[];
}

const linkKinds: Record<ResourceLink['kind'], string> = {
  video: 'Video',
  article: 'Article',
  study: 'Study',
};

const hasDetails = (note: Annotation): boolean =>
  note.comment !== undefined || (note.links?.length ?? 0) > 0;

export function LineInfo({ names, notes }: LineInfoProps) {
  const detailed = notes.filter(hasDetails);

  return (
    <>
      {names.length > 0 && (
        <nav aria-label="Line">
          <ol class={styles.breadcrumb}>
            {names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ol>
        </nav>
      )}
      {detailed.length > 0 && (
        <ul class={styles.notes}>
          {detailed.map((note, index) => (
            <li key={note.name ?? index} class={styles.note}>
              {note.name && <strong class={styles.noteName}>{note.name}</strong>}
              {note.comment && <p>{note.comment}</p>}
              {note.links && note.links.length > 0 && (
                <ul class={styles.links}>
                  {note.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        {linkKinds[link.kind]}: {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
