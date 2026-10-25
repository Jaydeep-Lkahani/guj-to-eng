import type { Exercise } from '../schema/content';
import { normalizeAnswer } from './normalize';

/** What the learner gave as an answer. The kind must fit the exercise type. */
export type Answer =
  | { kind: 'index'; value: number } // mcq, listenChoose
  | { kind: 'bool'; value: boolean } // trueFalse
  | { kind: 'text'; value: string } // fill, listenType, translate
  | { kind: 'tiles'; value: string[] } // order
  | { kind: 'match'; wrongPairs: string[] }; // match: every pair is joined; wrongPairs = wrong taps as "left → right"

export type Grade = {
  correct: boolean;
  /** Right answer, but a sentence was started with a small letter (pending.md 7.6). */
  capitalTip: boolean;
  /** The right answer as text, for the feedback message. */
  correctText: string;
  /** What she answered, as text, for the mistakes notebook. */
  answerText: string;
  /** Goes into the mistakes notebook. A match can be correct and still have wrong taps. */
  mistake: boolean;
};

export type GradeOptions = {
  /** Practice lets her try again, so wrong taps in a match do not count against her. */
  retries: boolean;
};

function collapse(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

function startsWithSmallLetter(text: string): boolean {
  const first = text.trim().charAt(0);
  return (
    first !== '' &&
    first === first.toLowerCase() &&
    first !== first.toUpperCase()
  );
}

function startsWithCapital(text: string): boolean {
  const first = text.trim().charAt(0);
  return (
    first !== '' &&
    first === first.toUpperCase() &&
    first !== first.toLowerCase()
  );
}

/**
 * Compares typed text or joined word tiles with every accepted answer (pending.md 7.6).
 * The code never guesses synonyms: content lists every accepted answer.
 */
export function gradeText(
  given: string,
  answers: readonly string[],
): { correct: boolean; capitalTip: boolean } {
  const normalized = normalizeAnswer(given);
  const matches = answers.filter((a) => normalizeAnswer(a) === normalized);
  if (matches.length === 0 || normalized === '') {
    return { correct: false, capitalTip: false };
  }
  const exact = matches.some((a) => collapse(a) === collapse(given));
  const sentence = matches.some((a) => /\s/.test(a.trim()));
  const capitalTip =
    !exact &&
    sentence &&
    startsWithSmallLetter(given) &&
    matches.some((a) => startsWithCapital(a));
  return { correct: true, capitalTip };
}

function mismatch(exercise: Exercise, answer: Answer): never {
  throw new Error(
    `Answer kind "${answer.kind}" does not fit exercise type "${exercise.type}"`,
  );
}

export function gradeExercise(
  exercise: Exercise,
  answer: Answer,
  options: GradeOptions = { retries: true },
): Grade {
  switch (exercise.type) {
    case 'mcq':
    case 'listenChoose': {
      if (answer.kind !== 'index') return mismatch(exercise, answer);
      return {
        correct: answer.value === exercise.answer,
        capitalTip: false,
        correctText: exercise.options[exercise.answer] ?? '',
        answerText: exercise.options[answer.value] ?? '',
        mistake: answer.value !== exercise.answer,
      };
    }
    case 'trueFalse': {
      if (answer.kind !== 'bool') return mismatch(exercise, answer);
      return {
        correct: answer.value === exercise.answer,
        capitalTip: false,
        correctText: String(exercise.answer),
        answerText: String(answer.value),
        mistake: answer.value !== exercise.answer,
      };
    }
    case 'fill':
    case 'listenType':
    case 'translate': {
      if (answer.kind !== 'text') return mismatch(exercise, answer);
      const graded = gradeText(answer.value, exercise.answers);
      return {
        ...graded,
        correctText: exercise.answers[0] ?? '',
        answerText: collapse(answer.value),
        mistake: !graded.correct,
      };
    }
    case 'order': {
      if (answer.kind !== 'tiles') return mismatch(exercise, answer);
      const joined = answer.value.join(' ');
      const graded = gradeText(joined, exercise.answers);
      return {
        ...graded,
        correctText: exercise.answers[0] ?? '',
        answerText: joined,
        mistake: !graded.correct,
      };
    }
    case 'match': {
      if (answer.kind !== 'match') return mismatch(exercise, answer);
      return {
        correct: options.retries || answer.wrongPairs.length === 0,
        capitalTip: false,
        correctText: exercise.pairs
          .map((p) => `${p.left} – ${p.right}`)
          .join(', '),
        answerText: answer.wrongPairs.join(', '),
        mistake: answer.wrongPairs.length > 0,
      };
    }
  }
}

/** A tap in a match exercise is right only when the two items belong together. */
export function isMatchPair(
  pairs: readonly { left: string; right: string }[],
  left: string,
  right: string,
): boolean {
  return pairs.some((p) => p.left === left && p.right === right);
}

/** True when the answer has enough in it to be checked (the check button is disabled before). */
export function isAnswerReady(
  exercise: Exercise,
  answer: Answer | undefined,
): boolean {
  if (!answer) return false;
  switch (exercise.type) {
    case 'mcq':
    case 'listenChoose':
      return answer.kind === 'index' && answer.value >= 0;
    case 'trueFalse':
      return answer.kind === 'bool';
    case 'fill':
    case 'listenType':
    case 'translate':
      return answer.kind === 'text' && answer.value.trim() !== '';
    case 'order':
      return (
        answer.kind === 'tiles' && answer.value.length === exercise.tiles.length
      );
    case 'match':
      return answer.kind === 'match';
  }
}
