import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { gu, symbols } from '../i18n/gu';
import { nowIso, today } from '../lib/dates';
import { isWatched, resumeSeconds } from '../lib/videoWatch';
import type { Video } from '../schema/content';
import {
  loadYouTubeApi,
  YOUTUBE_HOST,
  type YtPlayer,
} from '../services/youtube';
import { useProgress } from '../state/progressContext';
import { En } from './En';

/** The position is saved this often while the video plays (pending.md 7.7). */
export const SAVE_POSITION_MS = 5000;

type State = 'loading' | 'ready' | 'offline';

const SPEEDS = [
  { rate: 0.75, label: symbols.speedSlow },
  { rate: 1, label: symbols.speedNormal },
] as const;

/**
 * An approved YouTube video (pending.md 7.7): resumes where she stopped, saves the position every
 * 5 seconds, marks it watched at the end or at 90 %, and has 0.75x and 1x speed buttons.
 * Offline, or when YouTube does not load in 10 seconds, it shows one Gujarati message.
 */
export function VideoPlayer({ video }: { video: Video }) {
  const { progress, dispatch } = useProgress();
  const saved = progress.videos[video.id];
  const watched = saved?.watched === true;

  // The newest saved entry, for the player callbacks that outlive a render.
  const latest = useRef(saved);
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<YtPlayer | undefined>(undefined);
  const [state, setState] = useState<State>('loading');
  const [attempt, setAttempt] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    latest.current = saved;
  }, [saved]);

  const retry = () => {
    setState('loading');
    setAttempt((n) => n + 1);
  };

  useEffect(() => {
    let cancelled = false;
    let created: YtPlayer | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;
    const host = container.current;

    const save = (ended: boolean) => {
      if (!created) return;
      const duration = created.getDuration() || video.durationSeconds || 0;
      const position = created.getCurrentTime();
      // Never played and nothing saved: leave her progress alone.
      if (!ended && position <= 0 && !latest.current) return;
      dispatch({
        type: 'setVideoProgress',
        videoId: video.id,
        lastPosition: position,
        duration,
        watched:
          ended ||
          isWatched(position, duration, video.startSeconds, video.endSeconds),
        today: today(),
        at: nowIso(),
      });
    };

    loadYouTubeApi().then(
      (api) => {
        if (cancelled || !host) return;
        const mount = document.createElement('div');
        host.replaceChildren(mount);
        const start = resumeSeconds(video, latest.current);
        created = new api.Player(mount, {
          videoId: video.youtubeId,
          host: YOUTUBE_HOST,
          playerVars: {
            playsinline: 1,
            rel: 0,
            start,
            ...(video.endSeconds === undefined
              ? {}
              : { end: video.endSeconds }),
          },
          events: {
            onStateChange: ({ data }) => {
              clearInterval(interval);
              if (data === api.PlayerState.PLAYING) {
                interval = setInterval(() => save(false), SAVE_POSITION_MS);
              } else if (data === api.PlayerState.PAUSED) {
                save(false);
              } else if (data === api.PlayerState.ENDED) {
                save(true);
              }
            },
          },
        });
        player.current = created;
        setState('ready');
      },
      () => {
        if (!cancelled) setState('offline');
      },
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (created) {
        save(false);
        created.destroy();
      }
      player.current = undefined;
      host?.replaceChildren();
    };
    // `dispatch` is stable; `video` never changes for one player.
  }, [video, attempt, dispatch]);

  // Back online: try again without her having to press anything.
  useEffect(() => {
    if (state !== 'offline') return;
    const again = () => {
      setState('loading');
      setAttempt((n) => n + 1);
    };
    window.addEventListener('online', again);
    return () => window.removeEventListener('online', again);
  }, [state]);

  const chooseRate = (next: number) => {
    setRate(next);
    player.current?.setPlaybackRate(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {state === 'offline' ? (
        <div
          role="alert"
          className="bg-surface rounded-xl border-2 border-black/15 p-4"
        >
          <p className="font-bold">{gu.video.offline}</p>
          <p className="mb-3">{gu.video.offlineNote}</p>
          <button
            type="button"
            className="bg-primary inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl px-6 font-bold text-white"
            onClick={retry}
          >
            {gu.video.tryAgain}
          </button>
        </div>
      ) : (
        <>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/5 [&_iframe]:size-full">
            <div ref={container} className="size-full" />
          </div>
          {state === 'loading' && (
            <p className="text-muted">{gu.video.loading}</p>
          )}
          {state === 'ready' && (
            <div
              role="group"
              aria-label={gu.video.speedGroup}
              className="flex gap-2"
            >
              {SPEEDS.map((speed) => (
                <button
                  key={speed.rate}
                  type="button"
                  aria-pressed={rate === speed.rate}
                  className={`min-h-12 min-w-12 rounded-xl border-2 px-4 ${rate === speed.rate ? 'border-primary bg-orange-50 font-bold' : 'bg-surface border-black/15'}`}
                  onClick={() => chooseRate(speed.rate)}
                >
                  <En>{speed.label}</En>
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {watched && (
        <p className="text-success flex items-center gap-1 font-bold">
          <Check aria-hidden size={20} />
          {gu.video.watched}
        </p>
      )}
    </div>
  );
}
