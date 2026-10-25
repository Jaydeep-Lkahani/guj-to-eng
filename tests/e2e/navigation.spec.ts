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
  type Box = { left: number; right: number; top: number; bottom: number };
  const measure = (links: Element[]): Box[] =>
    links.map((link) => {
      const r = link.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    });
  const gap = (a: Box, b: Box) =>
    Math.max(
      a.left - b.right,
      b.left - a.right,
      a.top - b.bottom,
      b.top - a.bottom,
    );
  const expectSpaced = (boxes: Box[]) => {
    for (const [i, a] of boxes.entries()) {
      for (const b of boxes.slice(i + 1)) {
        expect(gap(a, b)).toBeGreaterThanOrEqual(8 - 0.01);
      }
    }
  };

  for (const path of [
    '/',
    '/more',
    '/no-such-page',
    '/learn',
    '/topic/p1-t01',
  ]) {
    await page.goto(path);
    const nav = page.getByRole('navigation', { name: gu.nav.ariaLabel });
    const navBoxes = await nav.getByRole('link').evaluateAll(measure);
    const pageBoxes = await page
      .getByRole('main')
      .getByRole('link')
      .evaluateAll(measure);
    expect(navBoxes.length).toBeGreaterThan(0);
    for (const b of [...navBoxes, ...pageBoxes]) {
      expect(b.right - b.left).toBeGreaterThanOrEqual(48);
      expect(b.bottom - b.top).toBeGreaterThanOrEqual(48);
    }
    // The navigation is fixed, so page links scroll behind it. They must not
    // touch it when the page is scrolled to the end.
    expectSpaced(navBoxes);
    expectSpaced(pageBoxes);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const last = (
      await page.getByRole('main').getByRole('link').evaluateAll(measure)
    ).at(-1);
    const navAfter = await nav.getByRole('link').evaluateAll(measure);
    if (last) {
      for (const b of navAfter)
        expect(gap(last, b)).toBeGreaterThanOrEqual(8 - 0.01);
    }
  }
});
