import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { gu } from '../i18n/gu';
import { AppLayout } from './AppLayout';
import { RouteError } from './RouteError';

function Broken(): never {
  throw new Error('test crash');
}

describe('RouteError', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a Gujarati message and keeps the bottom navigation when a page crashes', () => {
    // React Router and React log the thrown error; that is expected here.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const router = createMemoryRouter(
      [
        {
          element: <AppLayout />,
          children: [
            {
              errorElement: <RouteError />,
              children: [{ index: true, element: <Broken /> }],
            },
          ],
        },
      ],
      { initialEntries: ['/'] },
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      gu.states.errorTitle,
    );
    expect(screen.getByText(gu.states.errorMessage)).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: gu.nav.ariaLabel }),
    ).toBeInTheDocument();
  });
});
