import type { Exercise } from '../schema/content';

type Random = () => number;

/** Fisher-Yates. Returns a new array. */
export function shuffle<T>(
  items: readonly T[],
  random: Random = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}

function sameOrder<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((item, i) => item === b[i]);
}

/** Shuffles, and tries again so that a list of 2+ different items never stays in its first order. */
export function shuffleDifferent<T>(
  items: readonly T[],
  random: Random = Math.random,
): T[] {
  const distinct = new Set(items).size > 1;
  let result = shuffle(items, random);
  for (
    let tries = 0;
    distinct && sameOrder(result, items) && tries < 20;
    tries++
  ) {
    result = shuffle(items, random);
  }
  return result;
}

/**
 * The same question with its options in a new order, for "quiz again" (pending.md 7.6).
 * The answer index follows the right option. Other types are returned unchanged.
 */
export function reshuffleOptions(
  exercise: Exercise,
  random: Random = Math.random,
): Exercise {
  if (exercise.type !== 'mcq' && exercise.type !== 'listenChoose')
    return exercise;
  const order = shuffleDifferent(
    exercise.options.map((_, i) => i),
    random,
  );
  return {
    ...exercise,
    options: order.map((i) => exercise.options[i] as string),
    answer: order.indexOf(exercise.answer),
  };
}
