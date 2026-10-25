import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { gu } from '../i18n/gu';
import { BottomNav } from './BottomNav';

function renderNav(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNav />
    </MemoryRouter>,
  );
  return screen.getByRole('navigation', { name: gu.nav.ariaLabel });
}

describe('BottomNav', () => {
  it('shows the 5 Gujarati labels in order', () => {
    const nav = renderNav('/');
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent);
    expect(labels).toEqual(['હોમ', 'શીખો', 'પુનરાવર્તન', 'પ્રગતિ', 'વધુ']);
  });

  it('links to the 5 main routes', () => {
    const nav = renderNav('/');
    const hrefs = within(nav)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/', '/learn', '/review', '/progress', '/more']);
  });

  it('marks only the current section', () => {
    const nav = renderNav('/lesson/p1-t01-l01');
    const current = within(nav)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    expect(current.map((link) => link.textContent)).toEqual(['શીખો']);
  });

  it('hides the decorative icons from screen readers', () => {
    const nav = renderNav('/');
    for (const svg of nav.querySelectorAll('svg')) {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
