import type { Page } from '@playwright/test';
import { gu } from '../../src/i18n/gu.ts';
import type { Progress } from '../../src/schema/progress.ts';
import { LESSON, type Exercise } from './content.ts';
import { expect, test } from './fixtures.ts';

const LESSON_URL = `/lesson/${LESSON.id}`;

/** A phone with an English voice, so the audio buttons work and can be checked. */
async function addFakeVoice(page: Page) {
  await page.addInitScript(() => {
    const spoken: { text: string; rate: number }[] = [];
    Object.assign(window, { __spoken: spoken });
    class FakeUtterance {
      text: string;
      rate = 1;
      lang = '';
      voice: unknown = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: FakeUtterance,
      configurable: true,
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        getVoices: () => [{ lang: 'en_IN', name: 'Fake voice' }],
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        cancel: () => undefined,
        speak: (u: { text: string; rate: number }) =>
          spoken.push({ text: u.text, rate: u.rate }),
      },
    });
  });
}

async function savedProgress(page: Page): Promise<Progress> {
  const raw = await page.evaluate(() =>
    localStorage.getItem('gujeng.progress'),
  );
  return JSON.parse(raw ?? 'null') as Progress;
}

const next = (page: Page) =>
  page.getByRole('button', { name: gu.glossary.next, exact: true }).click();
const stepHeading = (page: Page) => page.getByRole('heading', { level: 2 });

async function answer(page: Page, exercise: Exercise, right = true) {
  const check = () =>
    page.getByRole('button', { name: gu.glossary.check }).click();
  switch (exercise.type) {
    case 'mcq':
    case 'listenChoose': {
      const index = right
        ? exercise.answer
        : (exercise.answer + 1) % exercise.options.length;
      await page
        .getByRole('radio', { name: exercise.options[index]!, exact: true })
        .click();
      return check();
    }
    case 'trueFalse':
      await page
        .getByRole('radio', {
          name:
            exercise.answer === right
              ? gu.exercise.trueLabel
              : gu.exercise.falseLabel,
        })
        .click();
      return check();
    case 'fill':
    case 'listenType':
    case 'translate':
      await page
        .getByRole('textbox')
        .fill(right ? exercise.answers[0]! : 'zzz');
      return check();
    case 'order': {
      const pool = page.getByRole('group', { name: gu.exercise.tilesPool });
      const words = exercise.answers[0]!.split(' ');
      for (const word of right ? words : [...words].reverse()) {
        await pool.getByRole('button', { name: word, exact: true }).click();
      }
      return check();
    }
    case 'match': {
      const lefts = page.getByRole('list', { name: gu.exercise.matchLeft });
      const rights = page.getByRole('list', { name: gu.exercise.matchRight });
      for (const pair of exercise.pairs) {
        await lefts
          .getByRole('button', { name: pair.left, exact: true })
          .click();
        await rights
          .getByRole('button', { name: pair.right, exact: true })
          .click();
      }
    }
  }
}

async function answerAll(page: Page, exercises: Exercise[], right = true) {
  for (const exercise of exercises) {
    await answer(page, exercise, right);
    await expect(page.getByRole('status')).toBeVisible();
    await next(page);
  }
}

/** From the video step to the quiz step. */
async function goToQuiz(page: Page) {
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[2]);
  await next(page);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[3]);
  await next(page);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[4]);
  await next(page);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[5]);
  await answerAll(page, LESSON.practice);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[6]);
  await next(page);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[7]);
  await next(page);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[8]);
}

async function finishLesson(page: Page) {
  await goToQuiz(page);
  await answerAll(page, LESSON.quiz);
  await expect(page.getByText(gu.lesson.quiz.passed)).toBeVisible();
  await page.getByRole('button', { name: gu.glossary.continue }).click();
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[9]);
}

const noSideScroll = async (page: Page) =>
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(0);

test('the whole lesson: every step, completion, reload and the topic page', async ({
  page,
}) => {
  await addFakeVoice(page);
  await page.goto(LESSON_URL);

  // Step 2, no approved video: the placeholder, and the lesson is not locked behind it.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    LESSON.titleGu,
  );
  await expect(page.getByText(gu.topic.noVideo)).toBeVisible();
  await expect(page.getByText(gu.lesson.stepLabel(1, 8))).toBeVisible();
  await noSideScroll(page);

  await finishLesson(page);
  await expect(page.getByText(LESSON.useToday.en)).toBeVisible();
  await expect(
    page.getByText(gu.glossary.wellDone, { exact: false }),
  ).toBeVisible();
  await noSideScroll(page);

  // Reload: still completed, and the progress is in localStorage.
  await page.reload();
  const saved = await savedProgress(page);
  expect(saved.lessons[LESSON.id]).toMatchObject({
    status: 'completed',
    bestQuiz: 5,
    quizAttempts: 1,
  });
  expect(Object.keys(saved.srs).sort()).toEqual([...LESSON.newWordIds].sort());

  await page.goto('/topic/p1-t01');
  await expect(page.getByRole('main')).toContainText(gu.glossary.completed);
  await page.goto('/learn');
  await expect(page.getByRole('main')).toContainText(
    gu.learn.completedCount(1, 1),
  );
});

test('the audio buttons speak the English text, at normal and slow speed', async ({
  page,
}) => {
  await addFakeVoice(page);
  await page.goto(LESSON_URL);
  await next(page);
  await next(page); // step 4: examples
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[4]);
  await page.getByRole('button', { name: gu.audio.listen }).first().click();
  await page
    .getByRole('button', { name: gu.audio.listenSlowly })
    .first()
    .click();
  const spoken = await page.evaluate(
    () =>
      (window as unknown as { __spoken: { text: string; rate: number }[] })
        .__spoken,
  );
  expect(spoken).toEqual([
    { text: 'Apple', rate: 0.9 },
    { text: 'Apple', rate: 0.6 },
  ]);
  await expect(page.getByRole('note')).toHaveCount(0);
});

test('without an English voice the audio buttons are hidden and one notice explains', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        getVoices: () => [{ lang: 'hi-IN', name: 'Hindi only' }],
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        cancel: () => undefined,
        speak: () => undefined,
      },
    });
  });
  await page.goto(LESSON_URL);
  await next(page);
  await expect(page.getByRole('note')).toContainText(gu.audio.noVoiceBefore);
  await expect(page.getByRole('button', { name: gu.audio.listen })).toHaveCount(
    0,
  );
});

test('leaving mid-lesson and coming back resumes at the saved step', async ({
  page,
}) => {
  await page.goto(LESSON_URL);
  await next(page);
  await next(page);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[4]);
  await page.goto('/learn');
  await page.goto(LESSON_URL);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[4]);
  await page.goto('/topic/p1-t01');
  await expect(page.getByRole('main')).toContainText(gu.topic.statusInProgress);
});

test('the lesson works with the network off', async ({ page, context }) => {
  await page.goto(LESSON_URL);
  // Online first, so that the lazily loaded font files are in the page (the offline cache comes in M8).
  await goToQuiz(page);
  await answerAll(page, LESSON.quiz, false);
  await expect(page.getByText(gu.lesson.quiz.failed)).toBeVisible();

  await context.setOffline(true);
  await page.getByRole('button', { name: gu.lesson.quiz.reread }).click();
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[3]);
  await next(page);
  await next(page);
  await answerAll(page, LESSON.practice);
  await next(page);
  await next(page);
  await expect(stepHeading(page)).toHaveText(gu.lesson.stepNames[8]);
  await answerAll(page, LESSON.quiz);
  await expect(page.getByText(gu.lesson.quiz.passed)).toBeVisible();
  await page.getByRole('button', { name: gu.glossary.continue }).click();
  await expect(
    page.getByText(gu.glossary.wellDone, { exact: false }),
  ).toBeVisible();
  await context.setOffline(false);
});

test('a failed quiz does not complete the lesson; quiz again can pass', async ({
  page,
}) => {
  await page.goto(LESSON_URL);
  await goToQuiz(page);
  await answerAll(page, LESSON.quiz, false);
  await expect(page.getByText(gu.lesson.quiz.score(0, 5))).toBeVisible();
  await expect(page.getByText(gu.lesson.quiz.failed)).toBeVisible();
  await expect(
    page.getByRole('button', { name: gu.glossary.continue }),
  ).toHaveCount(0);

  await page.getByRole('button', { name: gu.lesson.quiz.again }).click();
  await answerAll(page, LESSON.quiz);
  await expect(page.getByText(gu.lesson.quiz.passed)).toBeVisible();

  // Progress is saved 500 ms after the last change.
  await expect
    .poll(async () => (await savedProgress(page)).lessons[LESSON.id])
    .toMatchObject({ status: 'completed', quizAttempts: 2 });
  expect((await savedProgress(page)).mistakes.length).toBeGreaterThanOrEqual(5);
});

test('wrong practice answers show the right answer and can be tried again', async ({
  page,
}) => {
  await page.goto(LESSON_URL);
  await next(page);
  await next(page);
  await next(page);
  await answer(page, LESSON.practice[0]!, false);
  await expect(page.getByRole('status')).toContainText(gu.exercise.wrongPrefix);
  await page.getByRole('button', { name: gu.glossary.tryAgain }).click();
  await answer(page, LESSON.practice[0]!, true);
  await expect(page.getByRole('status')).toContainText(gu.glossary.correct);
});

test('unreadable saved progress is kept, never overwritten, and she decides', async ({
  page,
}) => {
  const bad = '{"schemaVersion":1,"lessons":';
  await page.addInitScript((text) => {
    if (!localStorage.getItem('gujeng.progress')) {
      localStorage.setItem('gujeng.progress', text);
    }
  }, bad);
  await page.goto(LESSON_URL);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    gu.progressSafety.brokenTitle,
  );
  await expect(page.getByRole('navigation')).toHaveCount(0);

  const keys = await page.evaluate(() => Object.keys(localStorage));
  const copy = keys.find((k) => k.startsWith('gujeng.progress.broken.'));
  expect(copy).toBeDefined();
  expect(await page.evaluate((k) => localStorage.getItem(k), copy!)).toBe(bad);
  expect(
    await page.evaluate(() => localStorage.getItem('gujeng.progress')),
  ).toBe(bad);

  // The download gives her the unreadable text.
  const download = page.waitForEvent('download');
  await page
    .getByRole('button', { name: gu.progressSafety.downloadBackup })
    .click();
  expect(
    await (
      await (await download).createReadStream()
    )
      .toArray()
      .then((c) => Buffer.concat(c).toString()),
  ).toBe(bad);

  await page
    .getByRole('button', { name: gu.progressSafety.startFresh })
    .click();
  await page
    .getByRole('button', { name: gu.progressSafety.confirmYes })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    LESSON.titleGu,
  );
  await page
    .getByRole('button', { name: gu.glossary.next, exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('gujeng.progress')))
    .not.toBe(bad);
  expect(await page.evaluate((k) => localStorage.getItem(k), copy!)).toBe(bad);
});

test('every lesson step has no English UI text, no sideways scroll and big tap targets', async ({
  page,
}) => {
  await addFakeVoice(page);
  await page.goto(LESSON_URL);

  const check = async () => {
    await noSideScroll(page);
    const stray = await page.evaluate(() => {
      const clone = document.body.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[lang="en"]').forEach((el) => el.remove());
      return clone.innerText || '';
    });
    expect(stray).not.toMatch(/[A-Za-z]/);
    const small = await page
      .getByRole('main')
      .locator('button, a, input, textarea')
      .evaluateAll((els) =>
        els
          .map((el) => el.getBoundingClientRect())
          .filter((r) => r.width > 0 && (r.width < 47.9 || r.height < 47.9))
          .map((r) => `${r.width}x${r.height}`),
      );
    expect(small).toEqual([]);
  };

  await check(); // step 2
  await next(page);
  await check(); // step 3
  await next(page);
  await check(); // step 4
  await next(page);
  for (const exercise of LESSON.practice) {
    await check();
    await answer(page, exercise, false);
    await check();
    await next(page);
  }
  await check(); // step 6
  await next(page);
  await check(); // step 7
  await next(page);
  for (const exercise of LESSON.quiz) {
    await check();
    await answer(page, exercise);
    await next(page);
  }
  await check(); // quiz result
});
