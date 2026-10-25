import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '../router';
import { ProgressProvider } from '../state/ProgressProvider';
import { MemoryStorage } from './memoryStorage';

/** Renders the whole site at a path, with its own empty (or given) saved progress. */
export function renderAt(path: string, storage = new MemoryStorage()) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const result = render(
    <ProgressProvider storage={storage}>
      <RouterProvider router={router} />
    </ProgressProvider>,
  );
  return { router, storage, ...result };
}
