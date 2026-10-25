import { RouterProvider } from 'react-router/dom';
import { createAppRouter } from './router';
import { ProgressProvider } from './state/ProgressProvider';

const router = createAppRouter();

export function App() {
  return (
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  );
}
