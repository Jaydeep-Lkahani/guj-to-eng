import {
  createEmptyProgress,
  MIGRATIONS,
  parseProgress,
  serializeProgress,
  type Migrations,
} from '../lib/progress';
import type { Progress } from '../schema/progress';

/** The only key the learner's progress lives under (pending.md 7.1). */
export const PROGRESS_KEY = 'gujeng.progress';
export const BROKEN_KEY_PREFIX = 'gujeng.progress.broken.';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export type LoadResult =
  | { kind: 'fresh'; progress: Progress }
  | { kind: 'loaded'; progress: Progress }
  /** Saved text that could not be read. It is copied to `brokenKey` and never overwritten. */
  | { kind: 'broken'; raw: string; brokenKey: string; detail: string }
  /** The browser gives no storage (for example a private window). Progress stays in memory. */
  | { kind: 'unavailable'; progress: Progress };

/** The browser's localStorage, or undefined when even reaching it throws. */
export function browserStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Loads the saved progress (pending.md 7.5). When the text cannot be parsed it is NOT overwritten:
 * a copy goes to `gujeng.progress.broken.<timestamp>` and the caller must ask the learner first.
 */
export function loadProgress(
  storage: StorageLike | undefined,
  now: Date,
  migrations: Migrations = MIGRATIONS,
): LoadResult {
  const fresh = () => createEmptyProgress(now.toISOString());
  if (!storage) return { kind: 'unavailable', progress: fresh() };

  let raw: string | null;
  try {
    raw = storage.getItem(PROGRESS_KEY);
  } catch {
    return { kind: 'unavailable', progress: fresh() };
  }
  if (raw === null) return { kind: 'fresh', progress: fresh() };

  const parsed = parseProgress(raw, migrations);
  if (parsed.ok) return { kind: 'loaded', progress: parsed.progress };

  const brokenKey = `${BROKEN_KEY_PREFIX}${now.toISOString().replace(/[:.]/g, '-')}`;
  try {
    storage.setItem(brokenKey, raw);
  } catch {
    // The copy failed (storage full). The raw text is still held in memory for the backup download.
  }
  return {
    kind: 'broken',
    raw,
    brokenKey,
    detail: `${parsed.reason}: ${parsed.detail}`,
  };
}

/** Returns false when the browser refused to save (storage full or blocked). */
export function saveProgress(
  storage: StorageLike | undefined,
  progress: Progress,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(PROGRESS_KEY, serializeProgress(progress));
    return true;
  } catch {
    return false;
  }
}
