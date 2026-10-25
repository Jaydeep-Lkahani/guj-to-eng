import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { gu } from '../i18n/gu';
import { routes } from '../router';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

describe('Learn page (real content)', () => {
  it('shows 3 phases and all 26 topics, each linking to its topic page', () => {
    renderAt('/learn');
    const main = screen.getByRole('main');
    expect(within(main).getAllByRole('heading', { level: 2 })).toHaveLength(3);
    const links = within(main).getAllByRole('link');
    expect(links).toHaveLength(26);
    expect(
      links.every((a) =>
        /^\/topic\/p[123]-t\d{2}$/.test(a.getAttribute('href') ?? ''),
      ),
    ).toBe(true);
  });

  it('shows the Gujarati title of each phase', () => {
    renderAt('/learn');
    const titles = within(screen.getByRole('main'))
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      'તબક્કો 1 — મૂળભૂત',
      'તબક્કો 2 — મધ્યમ',
      'તબક્કો 3 — ઉચ્ચ સ્તર',
    ]);
  });

  it('shows the lesson count for a topic with lessons and "coming soon" for the others', () => {
    renderAt('/learn');
    const main = screen.getByRole('main');
    const first = within(main).getAllByRole('link')[0]!;
    expect(first).toHaveTextContent(gu.learn.lessonCount(1));
    const second = within(main).getAllByRole('link')[1]!;
    expect(second).toHaveTextContent(gu.learn.lessonsComingSoon);
  });

  it('opens a topic when its link is clicked', async () => {
    const router = renderAt('/learn');
    await userEvent.click(
      within(screen.getByRole('main')).getAllByRole('link')[0]!,
    );
    expect(router.state.location.pathname).toBe('/topic/p1-t01');
  });
});

describe('Topic page (real content)', () => {
  it('shows the title, the intro with English in <En>, the video placeholder and the lesson', () => {
    renderAt('/topic/p1-t01');
    const main = screen.getByRole('main');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'અંગ્રેજી મૂળાક્ષરો',
    );
    expect(main).toHaveTextContent('આ વિષયમાં તમે અંગ્રેજીના A થી Z સુધીના');
    expect(main.querySelectorAll('[lang="en"]').length).toBeGreaterThanOrEqual(
      2,
    );
    expect(within(main).getByText(gu.topic.noVideo)).toBeInTheDocument();
    const lessonLink = within(main).getByRole('link');
    expect(lessonLink).toHaveAttribute('href', '/lesson/p1-t01-l01');
    expect(lessonLink).toHaveTextContent('પહેલા 5 અક્ષરો (એ થી ઈ)');
    expect(lessonLink).toHaveTextContent(gu.topic.minutes(20));
  });

  it('shows a Gujarati note when the topic has no lessons yet', () => {
    renderAt('/topic/p1-t02');
    const main = screen.getByRole('main');
    expect(within(main).getByText(gu.topic.noLessons)).toBeInTheDocument();
    expect(within(main).queryByRole('link')).toBeNull();
  });

  it('shows a Gujarati not-found page for an unknown topic', () => {
    renderAt('/topic/p9-t99');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      gu.topic.notFoundTitle,
    );
    expect(
      within(screen.getByRole('main')).getByRole('link', {
        name: gu.glossary.learn,
      }),
    ).toHaveAttribute('href', '/learn');
  });
});
