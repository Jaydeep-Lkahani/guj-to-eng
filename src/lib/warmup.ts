import type { Exercise, Word } from '../schema/content';
import type { Progress } from '../schema/progress';
import { findLesson, findWord, phaseOfLesson, type Content } from './content';

export type WarmupItem =
  { kind: 'card'; word: Word } | { kind: 'question'; exercise: Exercise };

export const WARMUP_SIZE = 3;

/**
 * Step 1 (pending.md 7.6), made automatically: up to 3 flashcards that are due, otherwise up to
 * 3 quiz questions of the lesson before this one when that is completed. Empty means skip the step.
 */
export function buildWarmup(
  content: Content,
  progress: Progress,
  lessonId: string,
  today: string,
): WarmupItem[] {
  const due = Object.entries(progress.srs)
    .filter(([, entry]) => entry.due <= today)
    .sort(([, a], [, b]) => a.due.localeCompare(b.due))
    .flatMap(([wordId]) => {
      const word = findWord(content, wordId);
      return word ? [word] : [];
    })
    .slice(0, WARMUP_SIZE);
  if (due.length > 0) return due.map((word) => ({ kind: 'card', word }));

  const phase = phaseOfLesson(content, lessonId);
  const previousId =
    phase?.recommendedOrder[phase.recommendedOrder.indexOf(lessonId) - 1];
  if (previousId === undefined) return [];
  if (progress.lessons[previousId]?.status !== 'completed') return [];
  const previous = findLesson(content, previousId);
  return (previous?.quiz ?? [])
    .slice(0, WARMUP_SIZE)
    .map((exercise) => ({ kind: 'question', exercise }));
}
