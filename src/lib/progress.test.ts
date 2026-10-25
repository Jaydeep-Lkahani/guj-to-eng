import { describe, expect, it } from 'vitest';
import { CURRENT_SCHEMA_VERSION, ProgressSchema } from '../schema/progress';
import {
  createEmptyProgress,
  migrateProgress,
  parseProgress,
  serializeProgress,
  type Migrations,
} from './progress';

const CREATED = '2026-10-25T08:00:00.000Z';

describe('createEmptyProgress', () => {
  it('is valid, empty and on the current version', () => {
    const progress = createEmptyProgress(CREATED);
    expect(ProgressSchema.safeParse(progress).success).toBe(true);
    expect(progress.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(progress.learnerName).toBe('');
    expect(progress.lessons).toEqual({});
    expect(progress.settings).toEqual({
      transliteration: 'auto',
      voiceLang: 'en-IN',
      voiceRate: 0.9,
      dailyGoalMinutes: 30,
      unlockAll: false,
    });
  });

  it('does not share the settings object between learners', () => {
    const a = createEmptyProgress(CREATED);
    const b = createEmptyProgress(CREATED);
    a.settings.unlockAll = true;
    expect(b.settings.unlockAll).toBe(false);
  });
});

describe('parseProgress', () => {
  it('round-trips real progress', () => {
    const progress = createEmptyProgress(CREATED);
    progress.lessons['p1-t01-l01'] = {
      status: 'completed',
      step: 9,
      bestQuiz: 5,
      quizAttempts: 1,
      completedAt: CREATED,
    };
    progress.days['2026-10-25'] = {
      lessons: 1,
      reviews: 0,
      tests: 0,
      minutes: 20,
    };
    const result = parseProgress(serializeProgress(progress));
    expect(result).toEqual({ ok: true, progress });
  });

  it('reports text that is not JSON', () => {
    const result = parseProgress('{"schemaVersion": 1,');
    expect(result).toMatchObject({ ok: false, reason: 'not-json' });
  });

  it('reports an empty string and plain values as invalid or not JSON', () => {
    expect(parseProgress('')).toMatchObject({ ok: false });
    expect(parseProgress('42')).toMatchObject({ ok: false, reason: 'invalid' });
    expect(parseProgress('null')).toMatchObject({
      ok: false,
      reason: 'invalid',
    });
    expect(parseProgress('[]')).toMatchObject({ ok: false, reason: 'invalid' });
  });

  it('reports data with a wrong shape and says where', () => {
    const progress = JSON.parse(
      serializeProgress(createEmptyProgress(CREATED)),
    ) as Record<string, unknown>;
    progress.lessons = { a: { status: 'done', step: 99 } };
    const result = parseProgress(JSON.stringify(progress));
    expect(result).toMatchObject({ ok: false, reason: 'invalid' });
    if (!result.ok) expect(result.detail).toContain('lessons');
  });

  it('rejects an unknown extra field instead of silently dropping it', () => {
    const progress = JSON.parse(
      serializeProgress(createEmptyProgress(CREATED)),
    ) as Record<string, unknown>;
    progress.surprise = 1;
    expect(parseProgress(JSON.stringify(progress))).toMatchObject({
      ok: false,
      reason: 'invalid',
    });
  });

  it('rejects more than 300 mistakes', () => {
    const progress = createEmptyProgress(CREATED);
    progress.mistakes = Array.from({ length: 301 }, () => ({
      exerciseId: 'p1-t01-l01-quiz-01',
      lessonId: 'p1-t01-l01',
      answer: 'x',
      at: CREATED,
    }));
    expect(parseProgress(serializeProgress(progress))).toMatchObject({
      ok: false,
    });
  });

  it('refuses data from a newer version', () => {
    const progress = {
      ...createEmptyProgress(CREATED),
      schemaVersion: CURRENT_SCHEMA_VERSION + 1,
    };
    expect(parseProgress(JSON.stringify(progress))).toMatchObject({
      ok: false,
      reason: 'newer-version',
    });
  });

  it('refuses a missing schemaVersion', () => {
    expect(parseProgress('{}')).toMatchObject({ ok: false, reason: 'invalid' });
  });
});

describe('migrateProgress', () => {
  const migrations: Migrations = {
    1: (data) => ({
      ...data,
      learnerName: `${typeof data.learnerName === 'string' ? data.learnerName : ''}!`,
    }),
    2: (data) => ({ ...data, extra: true }),
  };

  it('runs every step from the old version up to the target', () => {
    const result = migrateProgress(
      { schemaVersion: 1, learnerName: 'Hetal' },
      migrations,
      3,
    );
    expect(result).toEqual({
      data: { schemaVersion: 3, learnerName: 'Hetal!', extra: true },
    });
  });

  it('does nothing when the data is already on the target version', () => {
    const data = { schemaVersion: 3, learnerName: 'Hetal' };
    expect(migrateProgress(data, migrations, 3)).toEqual({ data });
  });

  it('fails when a step is missing', () => {
    expect(
      migrateProgress({ schemaVersion: 1 }, { 2: (d) => d }, 3),
    ).toMatchObject({
      error: 'invalid',
    });
  });

  it('fails for a newer version', () => {
    expect(migrateProgress({ schemaVersion: 5 }, migrations, 3)).toMatchObject({
      error: 'newer-version',
    });
  });

  it('does not change the input object', () => {
    const data = { schemaVersion: 1, learnerName: 'Hetal' };
    migrateProgress(data, migrations, 3);
    expect(data).toEqual({ schemaVersion: 1, learnerName: 'Hetal' });
  });
});
