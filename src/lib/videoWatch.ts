import type { Video } from '../schema/content';
import type { VideoProgress } from '../schema/progress';

/** The part of the video that counts: `(end ?? duration) − (start ?? 0)` (pending.md 7.7). */
export function playableLength(
  duration: number,
  start?: number,
  end?: number,
): number {
  return (end ?? duration) - (start ?? 0);
}

/** Watched = the video ended, or she is at 90 % or more of the playable length. */
export function isWatched(
  position: number,
  duration: number,
  start?: number,
  end?: number,
): boolean {
  const length = playableLength(duration, start, end);
  if (!(length > 0)) return false;
  return position - (start ?? 0) >= 0.9 * length;
}

/** Where the player starts: resume where she stopped, unless she already watched it. */
export function resumeSeconds(
  video: Pick<Video, 'startSeconds' | 'endSeconds'>,
  saved: VideoProgress | undefined,
): number {
  const start = video.startSeconds ?? 0;
  if (!saved || saved.watched) return start;
  const inside =
    video.endSeconds === undefined || saved.lastPosition < video.endSeconds;
  return inside ? Math.max(start, Math.floor(saved.lastPosition)) : start;
}
