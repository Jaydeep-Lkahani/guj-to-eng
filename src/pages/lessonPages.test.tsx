import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { gu } from '../i18n/gu';
import { buildContent, type Content } from '../lib/content';
import { createEmptyProgress } from '../lib/progress';
import type { Progress } from '../schema/progress';
import { makeBundle, toFiles } from '../test/contentFixture';
import { MemoryStorage } from '../test/memoryStorage';
import { renderAt } from '../test/renderRoutes';

const mocks = vi.hoisted(() => ({ content: undefined as Content | undefined }));

vi.mock('../services/content', () => ({
  getContent: () => {
    if (!mocks.content) throw new Error('test content not set');
    return mocks.content;
  },
}));

// A video player needs YouTube; these tests only check that the right videos are offered.
vi.mock('../components/VideoPlayer', () => ({
  VideoPlayer: ({ video }: { video: { id: string } }) => (
    <div data-testid="video-player">{video.id}</div>
  ),
}));

// Fixture order: p1-t01-l01, p1-t02-l01, p1-t01-l02. Phase 2 has no lessons.
function twoPhases(approved = true) {
  const bundle = makeBundle();
  if (!approved) bundle.videos.videos[0]!.status = 'candidate';
  const first = bundle.phases.phases[0]!;
  bundle.phases.phases.push({
    ...first,
    id: 'p2',
    order: 2,
    finalTestId: 'p2-final',
    topics: [],
    recommendedOrder: [],
  });
  return buildContent(toFiles(bundle));
}

function progressWith(edit: (p: Progress) => void) {
  const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
  edit(progress);
  return new MemoryStorage().seed(progress);
}

const completed = (p: Progress, ...ids: string[]) => {
  for (const id of ids) {
    p.lessons[id] = {
      status: 'completed',
      step: 9,
      bestQuiz: 5,
      quizAttempts: 1,
    };
  }
};

beforeEach(() => {
  mocks.content = twoPhases();
});

describe('Topic page: lessons open one after another', () => {
  it('links the first lesson and greys out the others with the reason', () => {
    renderAt('/topic/p1-t01');
    const main = screen.getByRole('main');
    const links = within(main).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/lesson/p1-t01-l01',
    ]);
    expect(
      within(main).getByText(gu.topic.lockReason.previousLesson),
    ).toBeInTheDocument();
    expect(within(main).getByText(gu.glossary.locked)).toBeInTheDocument();
  });

  it('opens the next lesson of the recommended order when a lesson is completed', () => {
    renderAt(
      '/topic/p1-t02',
      progressWith((p) => completed(p, 'p1-t01-l01')),
    );
    const main = screen.getByRole('main');
    expect(within(main).getByRole('link')).toHaveAttribute(
      'href',
      '/lesson/p1-t02-l01',
    );
  });

  it('shows completed and in-progress lessons', () => {
    renderAt(
      '/topic/p1-t01',
      progressWith((p) => {
        completed(p, 'p1-t01-l01');
        p.lessons['p1-t01-l02'] = {
          status: 'in_progress',
          step: 4,
          bestQuiz: 0,
          quizAttempts: 0,
        };
        completed(p, 'p1-t02-l01');
      }),
    );
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent(`${gu.glossary.completed}`);
    expect(main).toHaveTextContent(gu.topic.statusInProgress);
  });

  it('unlockAll opens everything', () => {
    renderAt(
      '/topic/p1-t01',
      progressWith((p) => (p.settings.unlockAll = true)),
    );
    expect(within(screen.getByRole('main')).getAllByRole('link')).toHaveLength(
      2,
    );
  });

  it('shows the approved topic videos at the top, and no placeholder', () => {
    renderAt('/topic/p1-t01');
    expect(screen.getByTestId('video-player')).toHaveTextContent(
      'v-TEST_VIDEO1',
    );
    expect(screen.queryByText(gu.topic.noVideo)).toBeNull();
  });

  it('shows the placeholder when the video is only a candidate', () => {
    mocks.content = twoPhases(false);
    renderAt('/topic/p1-t01');
    expect(screen.queryByTestId('video-player')).toBeNull();
    expect(screen.getByText(gu.topic.noVideo)).toBeInTheDocument();
  });
});

describe('Lesson page: locks', () => {
  it('shows a Gujarati locked message instead of a locked lesson', () => {
    renderAt('/lesson/p1-t02-l01');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      gu.lesson.lockedTitle,
    );
    expect(
      screen.getByText(gu.lesson.lockReason.previousLesson),
    ).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(
      screen.getByRole('link', { name: gu.lesson.backToTopic }),
    ).toHaveAttribute('href', '/topic/p1-t02');
  });

  it('opens a lesson once the one before it is completed', () => {
    renderAt(
      '/lesson/p1-t02-l01',
      progressWith((p) => completed(p, 'p1-t01-l01')),
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'પાઠનું શીર્ષક',
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('opens any lesson with unlockAll', () => {
    renderAt(
      '/lesson/p1-t01-l02',
      progressWith((p) => (p.settings.unlockAll = true)),
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('says so for a lesson that does not exist', () => {
    renderAt('/lesson/p9-t99-l01');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      gu.lesson.notFoundTitle,
    );
    expect(
      within(screen.getByRole('main')).getByRole('link', {
        name: gu.glossary.learn,
      }),
    ).toHaveAttribute('href', '/learn');
  });

  it('a lesson of a phase whose earlier test is not passed is locked for that reason', () => {
    const bundle = makeBundle();
    const first = bundle.phases.phases[0]!;
    bundle.phases.phases.push({
      ...first,
      id: 'p2',
      order: 2,
      finalTestId: 'p2-final',
      topics: [],
      recommendedOrder: ['p1-t01-l01'],
    });
    first.recommendedOrder = ['p1-t02-l01'];
    mocks.content = buildContent(toFiles(bundle));
    renderAt('/lesson/p1-t01-l01');
    expect(
      screen.getByText(gu.lesson.lockReason.previousPhaseTest),
    ).toBeInTheDocument();
  });
});

describe('Lesson player: steps depend on the lesson', () => {
  it('step 2 shows the approved topic video in the first lesson of a topic', () => {
    renderAt('/lesson/p1-t01-l01');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      gu.lesson.stepNames[2],
    );
    expect(screen.getByTestId('video-player')).toHaveTextContent(
      'v-TEST_VIDEO1',
    );
    expect(screen.getByText(gu.lesson.video.hint)).toBeInTheDocument();
  });

  it('a later lesson without its own video skips step 2 and links to the topic videos', () => {
    renderAt(
      '/lesson/p1-t01-l02',
      progressWith((p) => (p.settings.unlockAll = true)),
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      gu.lesson.stepNames[3],
    );
    expect(
      screen.getByRole('link', { name: gu.lesson.watchTopicVideosAgain }),
    ).toHaveAttribute('href', '/topic/p1-t01');
  });

  it('the link to the topic videos is not shown when the topic has no approved video', () => {
    mocks.content = twoPhases(false);
    renderAt(
      '/lesson/p1-t01-l02',
      progressWith((p) => (p.settings.unlockAll = true)),
    );
    expect(
      screen.queryByRole('link', { name: gu.lesson.watchTopicVideosAgain }),
    ).toBeNull();
  });

  it('step 1 reviews the quiz of the lesson before when it is completed', () => {
    renderAt(
      '/lesson/p1-t02-l01',
      progressWith((p) => completed(p, 'p1-t01-l01')),
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      gu.lesson.stepNames[1],
    );
    expect(screen.getByText(gu.lesson.warmup.intro)).toBeInTheDocument();
    // The first quiz question of the lesson before, answered without a score.
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('step 1 shows a due flashcard, with the meaning only after a tap', async () => {
    const user = userEvent.setup();
    renderAt(
      '/lesson/p1-t02-l01',
      progressWith((p) => {
        completed(p, 'p1-t01-l01');
        p.srs['w-apple'] = { box: 1, due: '2000-01-01', right: 0, wrong: 0 };
      }),
    );
    expect(screen.getByText(gu.lesson.warmup.cardQuestion)).toBeInTheDocument();
    expect(screen.queryByText('સફરજન', { exact: false })).toBeNull();
    await user.click(
      screen.getByRole('button', { name: gu.lesson.warmup.showAnswer }),
    );
    expect(screen.getByText('સફરજન', { exact: false })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      gu.lesson.stepNames[2],
    );
  });
});

describe('Learn page: progress and locks', () => {
  it('shows completed lessons per topic', () => {
    renderAt(
      '/learn',
      progressWith((p) => completed(p, 'p1-t01-l01')),
    );
    const first = within(screen.getByRole('main')).getAllByRole('link')[0]!;
    expect(first).toHaveTextContent(gu.learn.completedCount(1, 2));
  });

  it('says which phase is locked, and keeps the topic links', () => {
    renderAt('/learn');
    const main = screen.getByRole('main');
    expect(within(main).getAllByText(gu.learn.phaseLocked)).toHaveLength(1);
    expect(within(main).getAllByRole('link')).toHaveLength(2);
  });

  it('shows no lock note with unlockAll', () => {
    renderAt(
      '/learn',
      progressWith((p) => (p.settings.unlockAll = true)),
    );
    expect(screen.queryByText(gu.learn.phaseLocked)).toBeNull();
  });
});
