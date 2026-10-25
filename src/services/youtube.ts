/**
 * YouTube IFrame Player API (pending.md 7.7). The script is loaded once, and only when a video
 * is shown. Players use the privacy-enhanced host youtube-nocookie.com.
 */

export const YOUTUBE_API_URL = 'https://www.youtube.com/iframe_api';
export const YOUTUBE_HOST = 'https://www.youtube-nocookie.com';
export const API_TIMEOUT_MS = 10_000;

export type YtPlayer = {
  getCurrentTime(): number;
  getDuration(): number;
  setPlaybackRate(rate: number): void;
  destroy(): void;
};

export type YtPlayerOptions = {
  videoId: string;
  host: string;
  playerVars: { playsinline: 1; rel: 0; start?: number; end?: number };
  events: {
    onStateChange?: (event: { data: number }) => void;
  };
};

export type YtApi = {
  Player: new (element: HTMLElement, options: YtPlayerOptions) => YtPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
};

declare global {
  interface Window {
    YT?: Partial<YtApi>;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function readyApi(): YtApi | undefined {
  const yt = window.YT;
  return yt?.Player && yt.PlayerState ? (yt as YtApi) : undefined;
}

let loading: Promise<YtApi> | undefined;

/** Rejects when the learner is offline, the script fails, or nothing arrives within 10 seconds. */
export function loadYouTubeApi(timeoutMs = API_TIMEOUT_MS): Promise<YtApi> {
  const ready = readyApi();
  if (ready) return Promise.resolve(ready);
  if (!navigator.onLine) return Promise.reject(new Error('offline'));
  if (loading) return loading;

  const attempt = new Promise<YtApi>((resolve, reject) => {
    const script = document.createElement('script');
    const fail = (reason: string) => {
      clearTimeout(timer);
      script.remove();
      window.onYouTubeIframeAPIReady = undefined;
      reject(new Error(reason));
    };
    const timer = setTimeout(() => fail('timeout'), timeoutMs);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      const api = readyApi();
      if (api) resolve(api);
      else fail('no-api');
    };
    script.src = YOUTUBE_API_URL;
    script.async = true;
    script.onerror = () => fail('script-error');
    document.head.append(script);
  });
  loading = attempt;
  const forget = () => {
    if (loading === attempt) loading = undefined;
  };
  attempt.then(forget, forget);
  return attempt;
}
