import { gu } from '../../src/i18n/gu.ts';
import { expect, test } from './fixtures.ts';

test('the bottom navigation moves between the 5 main pages', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: gu.nav.ariaLabel });

  const steps = [
    [gu.nav.learn, '/learn', gu.pages.learn],
    [gu.nav.review, '/review', gu.pages.review],
    [gu.nav.progress, '/progress', gu.pages.progress],
    [gu.nav.more, '/more', gu.pages.more],
    [gu.nav.home, '/', gu.pages.dashboard],
  ] as const;

  for (const [label, path, title] of steps) {
    await nav.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(nav.getByRole('link', { name: label })).toHaveAttribute(
      'aria-current',
      'page',
    );
  }
});

test('the More page opens videos, my words, mistakes, settings and help', async ({
  page,
}) => {
  const items = [
    [gu.glossary.video, '/videos', gu.pages.videos],
    [gu.glossary.myWords, '/words', gu.pages.words],
    [gu.glossary.mistakes, '/mistakes', gu.pages.mistakes],
    [gu.glossary.settings, '/settings', gu.pages.settings],
    [gu.glossary.help, '/help', gu.pages.help],
  ] as const;

  for (const [label, path, title] of items) {
    await page.goto('/more');
    await page.getByRole('main').getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    // These pages belong to the "More" tab.
    await expect(
      page
        .getByRole('navigation', { name: gu.nav.ariaLabel })
        .getByRole('link', { name: gu.nav.more }),
    ).toHaveAttribute('aria-current', 'page');
  }
});

test('the not-found page has a home button', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    gu.pages.notFound,
  );
  await page
    .getByRole('main')
    .getByRole('link', { name: gu.notFound.homeButton })
    .click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    gu.pages.dashboard,
  );
});

test('tap targets are at least 48 x 48 px and 8 px apart', async ({ page }) => {
  for (const path of ['/', '/more', '/no-such-page']) {
    await page.goto(path);
    const boxes = await page.getByRole('link').evaluateAll((links) =>
      links.map((link) => {
        const r = link.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      }),
    );
    expect(boxes.length).toBeGreaterThan(0);
    for (const b of boxes) {
      expect(b.right - b.left).toBeGreaterThanOrEqual(48);
      expect(b.bottom - b.top).toBeGreaterThanOrEqual(48);
    }
    for (const [i, a] of boxes.entries()) {
      for (const b of boxes.slice(i + 1)) {
        const gapX = Math.max(a.left - b.right, b.left - a.right);
        const gapY = Math.max(a.top - b.bottom, b.top - a.bottom);
        expect(Math.max(gapX, gapY)).toBeGreaterThanOrEqual(8 - 0.01);
      }
    }
  }
});
