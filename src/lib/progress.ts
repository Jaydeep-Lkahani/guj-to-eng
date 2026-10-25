import {
  CURRENT_SCHEMA_VERSION,
  ProgressSchema,
  type Progress,
  type Settings,
} from '../schema/progress';

export const DEFAULT_SETTINGS: Settings = {
  transliteration: 'auto',
  voiceLang: 'en-IN',
  voiceRate: 0.9,
  dailyGoalMinutes: 30,
  unlockAll: false,
};

/** Progress of a learner who has not done anything yet. */
export function createEmptyProgress(createdAt: string): Progress {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt,
    learnerName: '',
    lessons: {},
    videos: {},
    srs: {},
    mistakes: [],
    tests: {},
    days: {},
    notes: {},
    wordBank: [],
    writings: {},
    recordings: {},
    settings: { ...DEFAULT_SETTINGS },
  };
}

/**
 * One function per old version: migrations[1] turns version 1 data into version 2 data, and so on.
 * Never remove or rename a field without adding one here (pending.md 7.5).
 */
export type Migrations = Record<
  number,
  (data: Record<string, unknown>) => Record<string, unknown>
>;

export const MIGRATIONS: Migrations = {};

export type ParseResult =
  | { ok: true; progress: Progress }
  | {
      ok: false;
      reason: 'not-json' | 'invalid' | 'newer-version';
      detail: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Moves old data up to the current schema version. Returns undefined when that is impossible. */
export function migrateProgress(
  data: unknown,
  migrations: Migrations = MIGRATIONS,
  target: number = CURRENT_SCHEMA_VERSION,
):
  | { data: Record<string, unknown> }
  | { error: 'newer-version' | 'invalid'; detail: string } {
  if (!isRecord(data) || typeof data.schemaVersion !== 'number') {
    return { error: 'invalid', detail: 'schemaVersion is missing' };
  }
  let current: Record<string, unknown> = data;
  let version = data.schemaVersion;
  if (version > target) {
    return {
      error: 'newer-version',
      detail: `saved by a newer version (${version})`,
    };
  }
  while (version < target) {
    const migrate = migrations[version];
    if (!migrate) {
      return {
        error: 'invalid',
        detail: `no migration from version ${version}`,
      };
    }
    current = { ...migrate(current), schemaVersion: version + 1 };
    version += 1;
  }
  return { data: current };
}

/** Parses the saved text. Never throws. A failure means the text must be kept, not overwritten. */
export function parseProgress(
  raw: string,
  migrations: Migrations = MIGRATIONS,
  target: number = CURRENT_SCHEMA_VERSION,
): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (error) {
    return {
      ok: false,
      reason: 'not-json',
      detail: error instanceof Error ? error.message : 'invalid JSON',
    };
  }
  const migrated = migrateProgress(json, migrations, target);
  if ('error' in migrated) {
    return { ok: false, reason: migrated.error, detail: migrated.detail };
  }
  const parsed = ProgressSchema.safeParse(migrated.data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      reason: 'invalid',
      detail: first
        ? `${first.path.join('.')}: ${first.message}`
        : 'invalid progress',
    };
  }
  return { ok: true, progress: parsed.data };
}

export function serializeProgress(progress: Progress): string {
  return JSON.stringify(progress);
}
