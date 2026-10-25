import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gu } from '../i18n/gu';
import { resetClock, setClock } from '../lib/dates';
import { createEmptyProgress } from '../lib/progress';
import type { Video } from '../schema/content';
import { YOUTUBE_HOST, type YtPlayerOptions } from '../services/youtube';
import { ProgressProvider, SAVE_DELAY_MS } from '../state/ProgressProvider';
import { makeBundle } from '../test/contentFixture';
import { MemoryStorage } from '../test/memoryStorage';
import { SAVE_POSITION_MS, VideoPlayer } from './VideoPlayer';

const STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2 };

class FakePlayer {
  static instances: FakePlayer[] = [];
  time = 0;
  duration = 600;
  rate = 1;
  destroyed = false;
  options: YtPlayerOptions;
  element: HTMLElement;
  constructor(element: HTMLElement, options: YtPlayerOptions) {
    this.element = element;
    this.options = options;
    FakePlayer.instances.push(this);
  }
  getCurrentTime() {
    return this.time;
  }
  getDuration() {
    return this.duration;
  }
  setPlaybackRate(rate: number) {
    this.rate = rate;
  }
  destroy() {
    this.destroyed = true;
  }
  emit(state: number) {
    this.options.events.onStateChange?.({ data: state });
  }
}

function video(extra: Partial<Video> = {}): Video {
  return { ...makeBundle().videos.videos[0]!, ...extra };
}

function setOnline(online: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(online);
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  setClock(() => new Date(2026, 9, 25, 9, 0));
  FakePlayer.instances = [];
  window.YT = { Player: FakePlayer, PlayerState: STATE };
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  resetClock();
  delete window.YT;
  delete window.onYouTubeIframeAPIReady;
  document.head.querySelectorAll('script').forEach((s) => s.remove());
});

async function show(v: Video, storage = new MemoryStorage()) {
  const view = render(
    <ProgressProvider storage={storage}>
      <VideoPlayer video={v} />
    </ProgressProvider>,
  );
  await act(async () => {
    await Promise.resolve();
  });
  const player = () => FakePlayer.instances.at(-1)!;
  return {
    ...view,
    storage,
    player,
    user: userEvent.setup({ advanceTimers: vi.advanceTimersByTime }),
  };
}

const flush = () =>
  act(() => {
    vi.advanceTimersByTime(SAVE_DELAY_MS + 10);
  });

describe('VideoPlayer', () => {
  it('creates the player on the privacy-enhanced host with the video ID', async () => {
    const { player } = await show(video());
    expect(FakePlayer.instances).toHaveLength(1);
    expect(player().options.videoId).toBe('TEST_VIDEO1');
    expect(player().options.host).toBe(YOUTUBE_HOST);
    expect(YOUTUBE_HOST).toBe('https://www.youtube-nocookie.com');
    expect(player().options.playerVars).toEqual({
      playsinline: 1,
      rel: 0,
      start: 0,
    });
  });

  it('passes the start and end of a cut video', async () => {
    const { player } = await show(video({ startSeconds: 60, endSeconds: 360 }));
    expect(player().options.playerVars).toMatchObject({ start: 60, end: 360 });
  });

  it('resumes where she stopped', async () => {
    const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
    progress.videos['v-TEST_VIDEO1'] = {
      lastPosition: 123.9,
      duration: 600,
      watched: false,
    };
    const { player } = await show(video(), new MemoryStorage().seed(progress));
    expect(player().options.playerVars.start).toBe(123);
  });

  it('starts again from the beginning when the video was already watched', async () => {
    const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
    progress.videos['v-TEST_VIDEO1'] = {
      lastPosition: 590,
      duration: 600,
      watched: true,
    };
    const { player } = await show(video(), new MemoryStorage().seed(progress));
    expect(player().options.playerVars.start).toBe(0);
    expect(screen.getByText(gu.video.watched)).toBeInTheDocument();
  });

  it('saves the position every 5 seconds while playing', async () => {
    const { player, storage } = await show(video());
    player().time = 30;
    act(() => player().emit(STATE.PLAYING));
    act(() => {
      vi.advanceTimersByTime(SAVE_POSITION_MS);
    });
    flush();
    expect(storage.saved().videos['v-TEST_VIDEO1']).toMatchObject({
      lastPosition: 30,
      duration: 600,
      watched: false,
    });
    player().time = 40;
    act(() => {
      vi.advanceTimersByTime(SAVE_POSITION_MS);
    });
    flush();
    expect(storage.saved().videos['v-TEST_VIDEO1']?.lastPosition).toBe(40);
  });

  it('stops saving every 5 seconds when paused, and saves once at the pause', async () => {
    const { player, storage } = await show(video());
    act(() => player().emit(STATE.PLAYING));
    player().time = 12;
    act(() => player().emit(STATE.PAUSED));
    flush();
    expect(storage.saved().videos['v-TEST_VIDEO1']?.lastPosition).toBe(12);
    const writes = storage.writes;
    player().time = 99;
    act(() => {
      vi.advanceTimersByTime(20_000);
    });
    flush();
    expect(storage.writes).toBe(writes);
  });

  it('marks it watched when the video ends, and adds its minutes once', async () => {
    const { player, storage } = await show(video());
    player().time = 600;
    act(() => player().emit(STATE.ENDED));
    flush();
    const saved = storage.saved();
    expect(saved.videos['v-TEST_VIDEO1']).toMatchObject({ watched: true });
    expect(saved.days['2026-10-25']?.minutes).toBe(10);
    expect(screen.getByText(gu.video.watched)).toBeInTheDocument();
  });

  it('marks it watched at 90 % of the playable length', async () => {
    const { player, storage } = await show(video());
    act(() => player().emit(STATE.PLAYING));
    player().time = 539;
    act(() => {
      vi.advanceTimersByTime(SAVE_POSITION_MS);
    });
    expect(screen.queryByText(gu.video.watched)).toBeNull();
    player().time = 540;
    act(() => {
      vi.advanceTimersByTime(SAVE_POSITION_MS);
    });
    flush();
    expect(storage.saved().videos['v-TEST_VIDEO1']?.watched).toBe(true);
  });

  it('has 0.75x and 1x speed buttons that set the playback rate', async () => {
    const { player, user } = await show(video());
    const group = screen.getByRole('group', { name: gu.video.speedGroup });
    const buttons = group.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('0.75x');
    expect(buttons[1]).toHaveTextContent('1x');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    await user.click(buttons[0]!);
    expect(player().rate).toBe(0.75);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    await user.click(buttons[1]!);
    expect(player().rate).toBe(1);
  });

  it('saves the position and destroys the player when it goes away', async () => {
    const { player, storage, rerender } = await show(video());
    const first = player();
    first.time = 77;
    // The page goes away (she opens another page); the provider stays.
    rerender(
      <ProgressProvider storage={storage}>
        <p />
      </ProgressProvider>,
    );
    flush();
    expect(first.destroyed).toBe(true);
    expect(storage.saved().videos['v-TEST_VIDEO1']?.lastPosition).toBe(77);
  });

  it('leaves her progress alone when nothing was played', async () => {
    const { storage, rerender } = await show(video());
    rerender(
      <ProgressProvider storage={storage}>
        <p />
      </ProgressProvider>,
    );
    flush();
    expect(storage.writes).toBe(0);
  });
});

describe('VideoPlayer without internet', () => {
  beforeEach(() => {
    delete window.YT;
  });

  it('shows the Gujarati offline message at once, and loads nothing', async () => {
    setOnline(false);
    await show(video());
    expect(screen.getByRole('alert')).toHaveTextContent(gu.video.offline);
    expect(document.head.querySelector('script')).toBeNull();
    expect(
      screen.queryByRole('group', { name: gu.video.speedGroup }),
    ).toBeNull();
  });

  it('shows the message when YouTube does not load within 10 seconds', async () => {
    await show(video());
    expect(screen.getByText(gu.video.loading)).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(10_001);
      await Promise.resolve();
    });
    expect(screen.getByRole('alert')).toHaveTextContent(gu.video.offline);
  });

  it('tries again when the button is pressed', async () => {
    setOnline(false);
    const { user } = await show(video());
    vi.restoreAllMocks();
    window.YT = { Player: FakePlayer, PlayerState: STATE };
    await user.click(screen.getByRole('button', { name: gu.video.tryAgain }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(FakePlayer.instances).toHaveLength(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('tries again by itself when the internet comes back', async () => {
    setOnline(false);
    await show(video());
    vi.restoreAllMocks();
    window.YT = { Player: FakePlayer, PlayerState: STATE };
    await act(async () => {
      window.dispatchEvent(new Event('online'));
      await Promise.resolve();
    });
    expect(FakePlayer.instances).toHaveLength(1);
  });
});
