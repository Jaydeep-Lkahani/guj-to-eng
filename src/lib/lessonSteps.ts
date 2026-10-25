import type { LessonProgress } from '../schema/progress';

/** The 9 lesson steps (pending.md section 0). */
export const STEP = {
  warmup: 1,
  video: 2,
  explanation: 3,
  examples: 4,
  practice: 5,
  speak: 6,
  write: 7,
  quiz: 8,
  useToday: 9,
} as const;

/** A lesson is completed with at least this many right answers out of 5 in the quiz (pending.md 7.6). */
export const PASS_SCORE = 3;

export type StepNumber = (typeof STEP)[keyof typeof STEP];

/**
 * The steps she will see. Step 1 is skipped when there is nothing to review, and step 2 when the
 * lesson has no video to show and is not the first of its topic (pending.md 7.6, V.1).
 */
export function visibleSteps(options: {
  hasWarmup: boolean;
  hasVideoStep: boolean;
}): number[] {
  return Object.values(STEP).filter(
    (step) =>
      (step !== STEP.warmup || options.hasWarmup) &&
      (step !== STEP.video || options.hasVideoStep),
  );
}

/** Where to open the lesson: at the saved step, or at the beginning. */
export function startStep(
  visible: readonly number[],
  saved: LessonProgress | undefined,
): number {
  const first = visible[0] ?? STEP.explanation;
  if (!saved || saved.status === 'completed') return first;
  // Step 9 only follows a passed quiz, which completes the lesson.
  const wanted = Math.min(saved.step, STEP.quiz);
  return visible.find((step) => step >= wanted) ?? visible.at(-1) ?? first;
}

export function nextStep(
  current: number,
  visible: readonly number[],
): number | undefined {
  return visible.find((step) => step > current);
}

export function previousStep(
  current: number,
  visible: readonly number[],
): number | undefined {
  return [...visible].reverse().find((step) => step < current);
}
