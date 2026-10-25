import { useState, type FormEvent } from 'react';
import { gu, symbols } from '../../i18n/gu';
import {
  gradeExercise,
  isAnswerReady,
  type Answer,
  type Grade,
} from '../../lib/grading';
import type { Exercise } from '../../schema/content';
import { AudioButton } from '../AudioButton';
import { En } from '../En';
import { GuText } from '../GuText';
import { MixedText } from '../MixedText';
import { useTtsStatus } from '../useTtsStatus';
import {
  ChoiceInput,
  FillInput,
  MatchInput,
  OrderInput,
  TextBox,
  TrueFalseInput,
} from './inputs';

export type ExerciseMode = 'practice' | 'quiz';

type Props = {
  exercise: Exercise;
  /** Practice lets her try again after a wrong answer. A quiz question is answered once. */
  mode: ExerciseMode;
  /** Called once for every check. */
  onChecked?: (exercise: Exercise, grade: Grade) => void;
  onNext: () => void;
};

const BUTTON =
  'inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl px-6 font-bold';

function correctAnswerText(exercise: Exercise, grade: Grade): string {
  if (exercise.type === 'trueFalse') {
    return grade.correctText === 'true'
      ? gu.exercise.trueLabel
      : gu.exercise.falseLabel;
  }
  return grade.correctText;
}

function Feedback({ exercise, grade }: { exercise: Exercise; grade: Grade }) {
  const wrongInQuiz = !grade.correct;
  return (
    <div
      role="status"
      className={`rounded-xl border-2 p-3 ${wrongInQuiz ? 'border-error bg-red-50' : 'border-success bg-green-50'}`}
    >
      <p className={`font-bold ${wrongInQuiz ? 'text-error' : 'text-success'}`}>
        <span aria-hidden>{wrongInQuiz ? symbols.wrong : symbols.right} </span>
        {wrongInQuiz ? (
          <>
            {gu.exercise.wrongPrefix}{' '}
            <MixedText text={correctAnswerText(exercise, grade)} />
          </>
        ) : (
          gu.glossary.correct
        )}
      </p>
      {grade.capitalTip && <p className="mt-1">{gu.exercise.capitalTip}</p>}
      <p className="mt-1">
        <GuText text={exercise.explainGu} />
      </p>
    </div>
  );
}

/** Text spoken by the exercise, shown as a fallback when the phone has no English voice. */
function ListenPrompt({ text }: { text: string }) {
  const status = useTtsStatus();
  return (
    <div className="flex items-center gap-3">
      <AudioButton text={text} />
      {status === 'none' && (
        <p>
          {gu.exercise.audioFallback} <En>{text}</En>
        </p>
      )}
    </div>
  );
}

/**
 * One exercise of any of the 8 types: question, answer, check, feedback (pending.md 7.6, 7.9).
 * Give it a `key` of the exercise id so that it starts fresh for each exercise.
 */
export function ExerciseView({ exercise, mode, onChecked, onNext }: Props) {
  const [answer, setAnswer] = useState<Answer | undefined>(undefined);
  const [grade, setGrade] = useState<Grade | undefined>(undefined);
  const [attempt, setAttempt] = useState(0);
  const checked = grade !== undefined;

  const check = (given: Answer) => {
    const result = gradeExercise(exercise, given, {
      retries: mode === 'practice',
    });
    setAnswer(given);
    setGrade(result);
    onChecked?.(exercise, result);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!checked && answer && isAnswerReady(exercise, answer)) check(answer);
  };
  const retry = () => {
    setAnswer(undefined);
    setGrade(undefined);
    setAttempt(attempt + 1);
  };

  const onChange = (next: Answer | undefined) => setAnswer(next);
  const common = { disabled: checked, onChange };

  let body;
  switch (exercise.type) {
    case 'mcq':
      body = (
        <>
          {exercise.promptEn && (
            <p>
              <En>{exercise.promptEn}</En>
            </p>
          )}
          {exercise.audio && <ListenPrompt text={exercise.audio} />}
          <ChoiceInput {...common} options={exercise.options} />
        </>
      );
      break;
    case 'listenChoose':
      body = (
        <>
          <ListenPrompt text={exercise.audio} />
          <ChoiceInput {...common} options={exercise.options} />
        </>
      );
      break;
    case 'trueFalse':
      body = (
        <>
          <p>
            <En>{exercise.statementEn}</En>
          </p>
          <TrueFalseInput {...common} />
        </>
      );
      break;
    case 'fill':
      body = <FillInput {...common} sentence={exercise.sentence} />;
      break;
    case 'listenType':
      body = (
        <>
          <ListenPrompt text={exercise.audio} />
          <TextBox {...common} />
        </>
      );
      break;
    case 'translate':
      body = (
        <>
          <p>
            <GuText text={exercise.gu} />
          </p>
          <TextBox {...common} />
        </>
      );
      break;
    case 'order':
      body = <OrderInput {...common} tiles={exercise.tiles} />;
      break;
    case 'match':
      body = (
        <MatchInput
          pairs={exercise.pairs}
          disabled={checked}
          onComplete={check}
        />
      );
      break;
  }

  const canCheck = !checked && isAnswerReady(exercise, answer);
  const showCheck = exercise.type !== 'match' && !checked;

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="font-bold">
        <GuText text={exercise.promptGu} />
      </p>
      <div key={attempt} className="flex flex-col gap-3">
        {body}
      </div>
      {showCheck && (
        <button
          type="submit"
          disabled={!canCheck}
          className={`${BUTTON} bg-primary text-white disabled:opacity-50`}
        >
          {gu.glossary.check}
        </button>
      )}
      {grade && <Feedback exercise={exercise} grade={grade} />}
      {grade && (
        <div className="flex flex-wrap gap-2">
          {mode === 'practice' && !grade.correct && (
            <button
              type="button"
              className={`${BUTTON} bg-primary text-white`}
              onClick={retry}
            >
              {gu.glossary.tryAgain}
            </button>
          )}
          <button
            type="button"
            className={`${BUTTON} ${mode === 'practice' && !grade.correct ? 'bg-surface text-primary border border-black/15' : 'bg-primary text-white'}`}
            onClick={onNext}
          >
            {gu.glossary.next}
          </button>
        </div>
      )}
    </form>
  );
}
