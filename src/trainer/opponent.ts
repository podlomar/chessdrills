import type { MoveNode } from '@/openings/tree.ts';
import { pickWeighted, type Random } from '@/trainer/pick.ts';
import { currentNode } from '@/trainer/selectors.ts';
import type { Session } from '@/trainer/session.ts';

// `replay` is a previous line to follow while it still matches, so the same line can be drilled again.
export const chooseOpponentMove = (
  session: Session,
  random: Random,
  replay: readonly MoveNode[] = [],
): MoveNode | undefined => {
  if (session.phase.kind !== 'opponentToMove') {
    return undefined;
  }
  const node = currentNode(session);
  const planned = replay[session.path.length];
  return planned?.parentId === node.id ? planned : pickWeighted(node.children, random);
};
