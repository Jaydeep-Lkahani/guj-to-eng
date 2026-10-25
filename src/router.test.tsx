import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { gu } from './i18n/gu';
import { routes } from './router';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

const ROUTE_TITLES: readonly (readonly [string, string])[] = [
  ['/', gu.pages.dashboard],
  ['/welcome', gu.pages.welcome],
  ['/learn', gu.pages.learn],
  ['/topic/p1-t01', gu.pages.topic],
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

describe('routes', () => {
  it.each(ROUTE_TITLES)('%s shows its Gujarati title', (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(document.title).toBe(`${title} · ${gu.appName}`);
  });

  it('keeps the bottom navigation on every page', () => {
    for (const [path] of ROUTE_TITLES) {
      const { unmount } = render(
        <RouterProvider
          router={createMemoryRouter(routes, { initialEntries: [path] })}
        />,
      );
      expect(
        screen.getByRole('navigation', { name: gu.nav.ariaLabel }),
      ).toBeInTheDocument();
      unmount();
    }
  });

  it('the not-found page has a home button that goes home', async () => {
    const router = renderAt('/no-such-page');
    await userEvent.click(
      within(screen.getByRole('main')).getByRole('link', {
        name: gu.notFound.homeButton,
      }),
    );
    expect(router.state.location.pathname).toBe('/');
  });

  it('the More page links to videos, my words, mistakes, settings and help', () => {
    renderAt('/more');
    const main = screen.getByRole('main');
    const links = Array.from(main.querySelectorAll('a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/videos',
      '/words',
      '/mistakes',
      '/settings',
      '/help',
    ]);
    expect(links.map((a) => a.textContent)).toEqual([
      gu.glossary.video,
      gu.glossary.myWords,
      gu.glossary.mistakes,
      gu.glossary.settings,
      gu.glossary.help,
    ]);
  });
});
