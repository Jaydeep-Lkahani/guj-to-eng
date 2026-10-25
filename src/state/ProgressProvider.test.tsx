import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmptyProgress, serializeProgress } from '../lib/progress';
import { resetClock, setClock } from '../lib/dates';
import {
  BROKEN_KEY_PREFIX,
  PROGRESS_KEY,
  type StorageLike,
} from '../services/storage';
import { useProgress } from './progressContext';
import { ProgressProvider, SAVE_DELAY_MS } from './ProgressProvider';

class MemoryStorage implements StorageLike {
  readonly data = new Map<string, string>();
  writes = 0;
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.writes += 1;
    this.data.set(key, value);
  }
}

function Probe() {
  const { progress, dispatch, broken, saveProblem, startFresh } = useProgress();
  return (
    <div>
      <p data-testid="step">{progress.lessons.a?.step ?? 'none'}</p>
      <p data-testid="broken">{broken ? 'yes' : 'no'}</p>
      <p data-testid="problem">{saveProblem ? 'yes' : 'no'}</p>
      <button
        onClick={() => dispatch({ type: 'setStep', lessonId: 'a', step: 4 })}
      >
        go
      </button>
      <button onClick={startFresh}>fresh</button>
    </div>
  );
}

const NOW = new Date('2026-10-25T08:30:00.000Z');

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  setClock(() => NOW);
});

afterEach(() => {
  vi.useRealTimers();
  resetClock();
});

function renderWith(storage: StorageLike) {
  return render(
    <ProgressProvider storage={storage}>
      <Probe />
    </ProgressProvider>,
  );
}

describe('ProgressProvider saving', () => {
  it('saves nothing before the first change', () => {
    const storage = new MemoryStorage();
    renderWith(storage);
    vi.advanceTimersByTime(5000);
    expect(storage.writes).toBe(0);
  });

  it('saves 500 ms after a change, once', async () => {
    const storage = new MemoryStorage();
    renderWith(storage);
    await userEvent.click(screen.getByText('go'));
    expect(storage.writes).toBe(0);
    act(() => {
      vi.advanceTimersByTime(SAVE_DELAY_MS + 10);
    });
    expect(storage.writes).toBe(1);
    expect(storage.data.get(PROGRESS_KEY)).toContain('"step":4');
  });

  it('saves at once when the page is hidden', async () => {
    const storage = new MemoryStorage();
    renderWith(storage);
    await userEvent.click(screen.getByText('go'));
    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });
    expect(storage.writes).toBe(1);
  });

  it('saves at once when the tab becomes hidden', async () => {
    const storage = new MemoryStorage();
    renderWith(storage);
    await userEvent.click(screen.getByText('go'));
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(storage.writes).toBe(1);
    vi.restoreAllMocks();
  });

  it('saves when the provider goes away', async () => {
    const storage = new MemoryStorage();
    const { unmount } = renderWith(storage);
    await userEvent.click(screen.getByText('go'));
    unmount();
    expect(storage.writes).toBe(1);
  });

  it('loads saved progress', () => {
    const storage = new MemoryStorage();
    const saved = createEmptyProgress('2026-10-01T00:00:00.000Z');
    saved.lessons.a = {
      status: 'in_progress',
      step: 6,
      bestQuiz: 0,
      quizAttempts: 0,
    };
    storage.setItem(PROGRESS_KEY, serializeProgress(saved));
    renderWith(storage);
    expect(screen.getByTestId('step')).toHaveTextContent('6');
  });

  it('reports a save problem when the browser refuses', async () => {
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    };
    renderWith(storage);
    await userEvent.click(screen.getByText('go'));
    act(() => {
      vi.advanceTimersByTime(SAVE_DELAY_MS + 10);
    });
    expect(screen.getByTestId('problem')).toHaveTextContent('yes');
  });

  it('reports a save problem at once when there is no storage', () => {
    const storage: StorageLike = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined,
    };
    renderWith(storage);
    expect(screen.getByTestId('problem')).toHaveTextContent('yes');
  });
});

describe('ProgressProvider with unreadable progress', () => {
  const BAD = '{"schemaVersion":1,"lessons":';

  it('keeps the text, copies it, and saves nothing even after changes', async () => {
    const storage = new MemoryStorage();
    storage.setItem(PROGRESS_KEY, BAD);
    storage.writes = 0;
    renderWith(storage);
    expect(screen.getByTestId('broken')).toHaveTextContent('yes');
    const copy = [...storage.data.keys()].find((k) =>
      k.startsWith(BROKEN_KEY_PREFIX),
    );
    expect(copy).toBeDefined();
    expect(storage.data.get(copy as string)).toBe(BAD);

    await userEvent.click(screen.getByText('go'));
    act(() => {
      vi.advanceTimersByTime(5000);
      window.dispatchEvent(new Event('pagehide'));
    });
    expect(storage.data.get(PROGRESS_KEY)).toBe(BAD);
  });

  it('starts fresh only when asked, and still keeps the broken copy', async () => {
    const storage = new MemoryStorage();
    storage.setItem(PROGRESS_KEY, BAD);
    renderWith(storage);
    await userEvent.click(screen.getByText('fresh'));
    expect(screen.getByTestId('broken')).toHaveTextContent('no');
    act(() => {
      vi.advanceTimersByTime(SAVE_DELAY_MS + 10);
    });
    expect(storage.data.get(PROGRESS_KEY)).toContain('"schemaVersion":1');
    expect(storage.data.get(PROGRESS_KEY)).not.toBe(BAD);
    const copy = [...storage.data.keys()].find((k) =>
      k.startsWith(BROKEN_KEY_PREFIX),
    );
    expect(storage.data.get(copy as string)).toBe(BAD);
  });

  it('startFresh does nothing when the progress was fine', async () => {
    const storage = new MemoryStorage();
    const saved = createEmptyProgress('2026-10-01T00:00:00.000Z');
    saved.lessons.a = {
      status: 'in_progress',
      step: 6,
      bestQuiz: 0,
      quizAttempts: 0,
    };
    storage.setItem(PROGRESS_KEY, serializeProgress(saved));
    renderWith(storage);
    await userEvent.click(screen.getByText('fresh'));
    expect(screen.getByTestId('step')).toHaveTextContent('6');
  });
});
