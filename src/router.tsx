import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppLayout } from './components/AppLayout';
import { RouteError } from './components/RouteError';
import { DashboardPage } from './pages/DashboardPage';
import { HelpPage } from './pages/HelpPage';
import { LearnPage } from './pages/LearnPage';
import { LessonPage } from './pages/LessonPage';
import { MistakesPage } from './pages/MistakesPage';
import { MorePage } from './pages/MorePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PracticePage } from './pages/PracticePage';
import { ProgressPage } from './pages/ProgressPage';
import { ReviewPage } from './pages/ReviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { TestPage } from './pages/TestPage';
import { TopicPage } from './pages/TopicPage';
import { VideosPage } from './pages/VideosPage';
import { WelcomePage } from './pages/WelcomePage';
import { WordsPage } from './pages/WordsPage';

/** All routes from pending.md 7.8. */
export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      {
        // Keeps the bottom navigation visible when a page crashes.
        errorElement: <RouteError />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'welcome', element: <WelcomePage /> },
          { path: 'learn', element: <LearnPage /> },
          { path: 'topic/:topicId', element: <TopicPage /> },
          { path: 'lesson/:lessonId', element: <LessonPage /> },
          { path: 'review', element: <ReviewPage /> },
          { path: 'practice', element: <PracticePage /> },
          { path: 'test/:testId', element: <TestPage /> },
          { path: 'progress', element: <ProgressPage /> },
          { path: 'more', element: <MorePage /> },
          { path: 'videos', element: <VideosPage /> },
          { path: 'words', element: <WordsPage /> },
          { path: 'mistakes', element: <MistakesPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'help', element: <HelpPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
