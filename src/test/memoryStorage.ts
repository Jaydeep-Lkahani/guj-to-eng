import { PROGRESS_KEY, type StorageLike } from '../services/storage';
import type { Progress } from '../schema/progress';
import { serializeProgress } from '../lib/progress';

/** A localStorage stand-in for tests. */
export class MemoryStorage implements StorageLike {
  readonly data = new Map<string, string>();
  writes = 0;

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.writes += 1;
    this.data.set(key, value);
  }

  /** Puts saved progress in, as if she had used the site before. */
  seed(progress: Progress): this {
    this.data.set(PROGRESS_KEY, serializeProgress(progress));
    return this;
  }

  saved(): Progress {
    return JSON.parse(this.data.get(PROGRESS_KEY) ?? 'null') as Progress;
  }
}
