import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadYouTubeApi, YOUTUBE_API_URL, type YtApi } from './youtube';

const fakeApi = {
  Player: class {},
  PlayerState: { ENDED: 0, PLAYING: 1, PAUSED: 2 },
} as unknown as YtApi;

function scripts() {
  return document.head.querySelectorAll(`script[src="${YOUTUBE_API_URL}"]`);
}

function setOnline(online: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(online);
}

beforeEach(() => {
  vi.useFakeTimers();
  setOnline(true);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  delete window.YT;
  delete window.onYouTubeIframeAPIReady;
  scripts().forEach((s) => s.remove());
});

describe('loadYouTubeApi', () => {
  it('uses the API when it is already there, without adding a script', async () => {
    window.YT = fakeApi;
    await expect(loadYouTubeApi()).resolves.toBe(fakeApi);
    expect(scripts()).toHaveLength(0);
  });

  it('loads the script once and resolves when YouTube calls back', async () => {
    const first = loadYouTubeApi();
    const second = loadYouTubeApi();
    expect(scripts()).toHaveLength(1);
    window.YT = fakeApi;
    window.onYouTubeIframeAPIReady?.();
    await expect(first).resolves.toBe(fakeApi);
    await expect(second).resolves.toBe(fakeApi);
  });

  it('rejects at once when offline, without adding a script', async () => {
    setOnline(false);
    await expect(loadYouTubeApi()).rejects.toThrow('offline');
    expect(scripts()).toHaveLength(0);
  });

  it('rejects after 10 seconds and allows another try', async () => {
    const attempt = loadYouTubeApi();
    const result = expect(attempt).rejects.toThrow('timeout');
    vi.advanceTimersByTime(10_000);
    await result;
    expect(scripts()).toHaveLength(0);

    const retry = loadYouTubeApi();
    expect(scripts()).toHaveLength(1);
    window.YT = fakeApi;
    window.onYouTubeIframeAPIReady?.();
    await expect(retry).resolves.toBe(fakeApi);
  });

  it('rejects when the script cannot be loaded', async () => {
    const attempt = loadYouTubeApi();
    const result = expect(attempt).rejects.toThrow('script-error');
    (scripts()[0] as HTMLScriptElement).onerror?.(new Event('error'));
    await result;
    expect(scripts()).toHaveLength(0);
  });

  it('rejects when the callback fires but the API is missing', async () => {
    const attempt = loadYouTubeApi();
    const result = expect(attempt).rejects.toThrow('no-api');
    window.onYouTubeIframeAPIReady?.();
    await result;
  });
});
