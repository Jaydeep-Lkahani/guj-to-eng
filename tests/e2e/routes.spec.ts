import { gu } from '../../src/i18n/gu.ts';
import { PHASES } from './content.ts';
import { expect, test } from './fixtures.ts';

const ROUTES: readonly (readonly [string, string])[] = [
  ['/', gu.pages.dashboard],
  ['/welcome', gu.pages.welcome],
  ['/learn', gu.pages.learn],
  ['/topic/p1-t01', PHASES[0]!.topics[0]!.titleGu],
  ['/lesson/p1-t01-l01', gu.pages.lesson],
  ['/review', gu.pages.review],
  ['/practice', gu.pages.practice],
  ['/test/p1-final', gu.pages.test],
  ['/progress', gu.pages.progress],
  ['/more', gu.pages.more],
  ['/videos', gu.pages.videos],
  ['/words', gu.pages.words],
  ['/mistakes', gu.pages.mistakes],
  ['/settings', gu.pages.settings],
  ['/help', gu.pages.help],
  ['/no-such-page', gu.pages.notFound],
];

for (const [path, title] of ROUTES) {
  test(`${path} shows its Gujarati title at 360 x 800`, async ({ page }) => {
    await page.goto(path);

    await expect(page.locator('html')).toHaveAttribute('lang', 'gu');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} · ${gu.appName}`);

    // The bottom navigation is always visible.
    const nav = page.getByRole('navigation', { name: gu.nav.ariaLabel });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link')).toHaveCount(5);

    // No sideways scrolling on a phone.
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    // No English UI text: any Latin letters must sit inside an English-marked element.
    const stray = await page.evaluate(() => {
      const clone = document.body.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[lang="en"]').forEach((el) => el.remove());
      return clone.innerText || clone.textContent || '';
    });
    expect(stray).not.toMatch(/[A-Za-z]/);
  });
}

test('the Gujarati and English fonts are served from this site', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const families = await page.evaluate(() =>
    Array.from(document.fonts)
      .filter((font) => font.status === 'loaded')
      .map((font) => font.family),
  );
  expect(families.join(' ')).toContain('Noto Sans Gujarati');
});
