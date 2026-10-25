import { useState } from 'react';
import { gu } from '../../i18n/gu';
import type { Grade } from '../../lib/grading';
import type { Exercise } from '../../schema/content';
import { ExerciseView } from '../exercise/ExerciseView';

/** Step 5: the practice exercises, one after another. A wrong answer is saved and can be tried again. */
export function PracticeStep({
  exercises,
  onChecked,
  onDone,
}: {
  exercises: readonly Exercise[];
  onChecked: (exercise: Exercise, grade: Grade) => void;
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const exercise = exercises[index];
  if (!exercise) return null;
  return (
    <div>
      <p className="text-muted mb-3">
        {gu.lesson.practice.counter(index + 1, exercises.length)}
      </p>
      <ExerciseView
        key={exercise.id}
        exercise={exercise}
        mode="practice"
        onChecked={onChecked}
        onNext={() =>
          index + 1 < exercises.length ? setIndex(index + 1) : onDone()
        }
      />
    </div>
  );
}
