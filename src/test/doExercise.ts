import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { gu } from '../i18n/gu';
import type { Exercise } from '../schema/content';

/** Answers one exercise on screen, right or wrong, and presses "check" (no check button for a match). */
export async function answer(
  user: UserEvent,
  exercise: Exercise,
  right: boolean,
): Promise<void> {
  const check = () =>
    user.click(screen.getByRole('button', { name: gu.glossary.check }));

  switch (exercise.type) {
    case 'mcq':
    case 'listenChoose': {
      const index = right
        ? exercise.answer
        : (exercise.answer + 1) % exercise.options.length;
      await user.click(
        screen.getByRole('radio', { name: exercise.options[index] }),
      );
      return check();
    }
    case 'trueFalse':
      await user.click(
        screen.getByRole('radio', {
          name:
            exercise.answer === right
              ? gu.exercise.trueLabel
              : gu.exercise.falseLabel,
        }),
      );
      return check();
    case 'fill':
    case 'listenType':
    case 'translate':
      await user.type(
        screen.getByRole('textbox'),
        right ? (exercise.answers[0] ?? '') : 'zzz',
      );
      return check();
    case 'order': {
      const words = (exercise.answers[0] ?? '').split(' ');
      for (const word of right ? words : [...words].reverse()) {
        await user.click(
          within(
            screen.getByRole('group', { name: gu.exercise.tilesPool }),
          ).getByRole('button', { name: word }),
        );
      }
      return check();
    }
    case 'match': {
      const lefts = screen.getByRole('list', { name: gu.exercise.matchLeft });
      const rights = screen.getByRole('list', { name: gu.exercise.matchRight });
      const press = (list: HTMLElement, name: string) =>
        user.click(
          within(list).getByRole('button', {
            name: (accessible) => accessible.startsWith(name),
          }),
        );
      if (!right) {
        const [first, second] = exercise.pairs;
        if (first && second) {
          await press(lefts, first.left);
          await press(rights, second.right);
        }
      }
      for (const pair of exercise.pairs) {
        await press(lefts, pair.left);
        await press(rights, pair.right);
      }
    }
  }
}

export function pressNext(user: UserEvent) {
  return user.click(screen.getByRole('button', { name: gu.glossary.next }));
}
