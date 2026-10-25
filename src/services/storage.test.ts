import { describe, expect, it } from 'vitest';
import { createEmptyProgress, serializeProgress } from '../lib/progress';
import {
  BROKEN_KEY_PREFIX,
  loadProgress,
  PROGRESS_KEY,
  saveProgress,
  type StorageLike,
} from './storage';

const NOW = new Date('2026-10-25T08:30:15.123Z');

class MemoryStorage implements StorageLike {
  readonly data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe('loadProgress', () => {
  it('starts fresh when nothing is saved, and saves nothing yet', () => {
    const storage = new MemoryStorage();
    const result = loadProgress(storage, NOW);
    expect(result.kind).toBe('fresh');
    expect(storage.data.size).toBe(0);
    if (result.kind === 'fresh') {
      expect(result.progress.createdAt).toBe(NOW.toISOString());
      expect(result.progress.learnerName).toBe('');
    }
  });

  it('loads saved progress', () => {
    const storage = new MemoryStorage();
    const saved = createEmptyProgress('2026-10-01T00:00:00.000Z');
    saved.learnerName = 'Hetal';
    storage.setItem(PROGRESS_KEY, serializeProgress(saved));
    expect(loadProgress(storage, NOW)).toEqual({
      kind: 'loaded',
      progress: saved,
    });
  });

  it('keeps unreadable text: copies it to a broken key and does not touch the main key', () => {
    const storage = new MemoryStorage();
    storage.setItem(PROGRESS_KEY, '{"schemaVersion":1,');
    const result = loadProgress(storage, NOW);
    expect(result.kind).toBe('broken');
    if (result.kind !== 'broken') return;
    expect(result.raw).toBe('{"schemaVersion":1,');
    expect(result.brokenKey).toBe(
      `${BROKEN_KEY_PREFIX}2026-10-25T08-30-15-123Z`,
    );
    expect(storage.getItem(result.brokenKey)).toBe('{"schemaVersion":1,');
    expect(storage.getItem(PROGRESS_KEY)).toBe('{"schemaVersion":1,');
  });

  it('keeps data with a wrong shape too', () => {
    const storage = new MemoryStorage();
    storage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ schemaVersion: 1, lessons: 5 }),
    );
    expect(loadProgress(storage, NOW).kind).toBe('broken');
  });

  it('keeps data saved by a newer version', () => {
    const storage = new MemoryStorage();
    storage.setItem(PROGRESS_KEY, JSON.stringify({ schemaVersion: 99 }));
    const result = loadProgress(storage, NOW);
    expect(result.kind).toBe('broken');
    if (result.kind === 'broken')
      expect(result.detail).toContain('newer-version');
  });

  it('still reports broken text when the copy cannot be saved', () => {
    const storage: StorageLike = {
      getItem: () => 'not json',
      setItem: () => {
        throw new Error('quota');
      },
    };
    const result = loadProgress(storage, NOW);
    expect(result).toMatchObject({ kind: 'broken', raw: 'not json' });
  });

  it('works in memory when there is no storage or reading throws', () => {
    expect(loadProgress(undefined, NOW).kind).toBe('unavailable');
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined,
    };
    expect(loadProgress(throwing, NOW).kind).toBe('unavailable');
  });

  it('runs migrations for older data', () => {
    const storage = new MemoryStorage();
    const saved = {
      ...createEmptyProgress('2026-10-01T00:00:00.000Z'),
      schemaVersion: 0,
    };
    storage.setItem(PROGRESS_KEY, JSON.stringify(saved));
    const result = loadProgress(storage, NOW, { 0: (d) => ({ ...d }) });
    expect(result.kind).toBe('loaded');
  });
});

describe('saveProgress', () => {
  it('writes the progress under the progress key', () => {
    const storage = new MemoryStorage();
    const progress = createEmptyProgress('2026-10-01T00:00:00.000Z');
    expect(saveProgress(storage, progress)).toBe(true);
    expect(storage.getItem(PROGRESS_KEY)).toBe(serializeProgress(progress));
  });

  it('returns false when the browser refuses or there is no storage', () => {
    const progress = createEmptyProgress('2026-10-01T00:00:00.000Z');
    const full: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(saveProgress(full, progress)).toBe(false);
    expect(saveProgress(undefined, progress)).toBe(false);
  });
});
