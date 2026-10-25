import type { Content } from './content';
import type { Progress } from '../schema/progress';

export type LockReason = 'previousLesson' | 'previousPhaseTest';

export type Lock = { unlocked: true } | { unlocked: false; reason: LockReason };

const OPEN: Lock = { unlocked: true };

function isCompleted(progress: Progress, lessonId: string): boolean {
  return progress.lessons[lessonId]?.status === 'completed';
}

/** A phase is open when it is the first one, or the final test of the phase before it is passed. */
export function isPhaseUnlocked(
  content: Content,
  progress: Progress,
  phaseId: string,
): boolean {
  if (progress.settings.unlockAll) return true;
  const index = content.phases.findIndex((p) => p.id === phaseId);
  if (index < 0) return false;
  if (index === 0) return true;
  const before = content.phases[index - 1];
  return (
    before !== undefined &&
    progress.tests[before.finalTestId]?.passedAt !== undefined
  );
}

/**
 * Lessons open one after another in the phase's recommended order (pending.md 7.6): a lesson is open
 * when the one before it is completed. The first lesson of an open phase is open.
 * Returns undefined when no phase has this lesson.
 */
export function lessonLock(
  content: Content,
  progress: Progress,
  lessonId: string,
): Lock | undefined {
  const phase = content.phases.find((p) =>
    p.recommendedOrder.includes(lessonId),
  );
  if (!phase) return undefined;
  if (progress.settings.unlockAll) return OPEN;
  if (!isPhaseUnlocked(content, progress, phase.id)) {
    return { unlocked: false, reason: 'previousPhaseTest' };
  }
  const index = phase.recommendedOrder.indexOf(lessonId);
  const before = phase.recommendedOrder[index - 1];
  if (before === undefined || isCompleted(progress, before)) return OPEN;
  return { unlocked: false, reason: 'previousLesson' };
}

/** The final test opens when every lesson of its phase is completed (and the phase is open). */
export function isTestUnlocked(
  content: Content,
  progress: Progress,
  phaseId: string,
): boolean {
  if (progress.settings.unlockAll) return true;
  const phase = content.phases.find((p) => p.id === phaseId);
  if (!phase || !isPhaseUnlocked(content, progress, phaseId)) return false;
  return phase.recommendedOrder.every((id) => isCompleted(progress, id));
}
