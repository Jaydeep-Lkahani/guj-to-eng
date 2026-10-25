import { useState } from 'react';
import { gu } from '../../i18n/gu';
import type { Grade } from '../../lib/grading';
import { PASS_SCORE } from '../../lib/lessonSteps';
import { reshuffleOptions } from '../../lib/shuffle';
import type { Exercise } from '../../schema/content';
import { ExerciseView } from '../exercise/ExerciseView';
import { StepNav } from './StepNav';

type Props = {
  exercises: readonly Exercise[];
  /** Called for every checked answer, so that mistakes are saved. */
  onChecked: (exercise: Exercise, grade: Grade) => void;
  /** Called once when the 5 questions are answered. */
  onFinished: (score: number) => void;
  /** After a passed quiz: go on to the "use it today" step. */
  onContinue: () => void;
  /** After a failed quiz: read the lesson again. */
  onReread: () => void;
};

/**
 * Step 8: 5 questions, each answered once. "Quiz again" asks the same questions with the options
 * in a new order. Passing needs 3 right answers.
 */
export function QuizStep({
  exercises,
  onChecked,
  onFinished,
  onContinue,
  onReread,
}: Props) {
  const [questions, setQuestions] = useState<readonly Exercise[]>(exercises);
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const finished = index >= questions.length;
  const score = results.filter(Boolean).length;
  const question = questions[index];

  const next = () => {
    if (index + 1 === questions.length)
      onFinished(results.filter(Boolean).length);
    setIndex(index + 1);
  };
  const again = () => {
    setQuestions(exercises.map((e) => reshuffleOptions(e)));
    setAttempt(attempt + 1);
    setResults([]);
    setIndex(0);
  };

  if (finished) {
    const passed = score >= PASS_SCORE;
    return (
      <div role="status" className="flex flex-col gap-3">
        <p className="text-2xl font-bold">
          {gu.lesson.quiz.score(score, questions.length)}
        </p>
        <p className={passed ? 'text-success font-bold' : 'font-bold'}>
          {passed ? gu.lesson.quiz.passed : gu.lesson.quiz.failed}
        </p>
        {passed ? (
          <StepNav onNext={onContinue} nextLabel={gu.glossary.continue} />
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="bg-primary inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl px-6 font-bold text-white"
              onClick={again}
            >
              {gu.lesson.quiz.again}
            </button>
            <button
              type="button"
              className="bg-surface text-primary inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-black/15 px-6 font-bold"
              onClick={onReread}
            >
              {gu.lesson.quiz.reread}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {index === 0 && <p className="mb-3">{gu.lesson.quiz.intro}</p>}
      <p className="text-muted mb-3">
        {gu.lesson.quiz.counter(index + 1, questions.length)}
      </p>
      {question && (
        <ExerciseView
          key={`${attempt}-${question.id}`}
          exercise={question}
          mode="quiz"
          onChecked={(exercise, grade) => {
            setResults((before) => [...before, grade.correct]);
            onChecked(exercise, grade);
          }}
          onNext={next}
        />
      )}
    </div>
  );
}
