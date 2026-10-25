import { gu } from '../../src/i18n/gu.ts';
import { LESSON, PHASES } from './content.ts';
import { expect, test } from './fixtures.ts';

test('/learn shows 3 phases and all 26 topics from the content', async ({
  page,
}) => {
  await page.goto('/learn');
  const main = page.getByRole('main');

  await expect(main.getByRole('heading', { level: 2 })).toHaveText(
    PHASES.map((p) => p.titleGu),
  );
  const links = main.getByRole('link');
  await expect(links).toHaveCount(26);

  const topics = PHASES.flatMap((p) => p.topics);
  expect(topics).toHaveLength(26);
  for (const topic of topics) {
    await expect(main.locator(`a[href="/topic/${topic.id}"]`)).toContainText(
      topic.titleGu,
    );
  }
});

test('a topic opens from /learn, shows its lesson, and the lesson link works', async ({
  page,
}) => {
  await page.goto('/learn');
  const first = PHASES[0]!.topics[0]!;
  await page.locator(`a[href="/topic/${first.id}"]`).click();

  await expect(page).toHaveURL(`/topic/${first.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    first.titleGu,
  );
  const main = page.getByRole('main');
  await expect(main.getByText(gu.topic.noVideo)).toBeVisible();

  await main.locator('a[href="/lesson/p1-t01-l01"]').click();
  await expect(page).toHaveURL('/lesson/p1-t01-l01');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    LESSON.titleGu,
  );
});

test('a topic without lessons says they are coming soon', async ({ page }) => {
  await page.goto('/topic/p1-t02');
  await expect(
    page.getByRole('main').getByText(gu.topic.noLessons),
  ).toBeVisible();
});

test('an unknown topic shows a Gujarati not-found message', async ({
  page,
}) => {
  await page.goto('/topic/p9-t99');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    gu.topic.notFoundTitle,
  );
});
