import { z } from 'zod';

/**
 * Saved progress (pending.md 7.5), defined once in zod.
 * Every change to this shape bumps CURRENT_SCHEMA_VERSION and adds a migration in src/lib/progress.ts.
 */

export const CURRENT_SCHEMA_VERSION = 1;

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const LessonProgressSchema = z.strictObject({
  status: z.enum(['in_progress', 'completed']),
  step: z.number().int().min(1).max(9),
  bestQuiz: z.number().min(0).max(5),
  quizAttempts: z.number().int().min(0),
  completedAt: z.string().optional(),
});
export type LessonProgress = z.infer<typeof LessonProgressSchema>;

export const VideoProgressSchema = z.strictObject({
  lastPosition: z.number().min(0),
  duration: z.number().min(0),
  watched: z.boolean(),
  watchedAt: z.string().optional(),
});
export type VideoProgress = z.infer<typeof VideoProgressSchema>;

export const SrsEntrySchema = z.strictObject({
  box: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  due: dateString,
  right: z.number().int().min(0),
  wrong: z.number().int().min(0),
});
export type SrsEntry = z.infer<typeof SrsEntrySchema>;

export const MistakeSchema = z.strictObject({
  exerciseId: z.string(),
  lessonId: z.string(),
  answer: z.string(),
  at: z.string(),
});
export type Mistake = z.infer<typeof MistakeSchema>;

export const MAX_MISTAKES = 300;

export const TestProgressSchema = z.strictObject({
  bestPercent: z.number().min(0).max(100),
  attempts: z.number().int().min(0),
  passedAt: z.string().optional(),
});
export type TestProgress = z.infer<typeof TestProgressSchema>;

export const DayProgressSchema = z.strictObject({
  lessons: z.number().min(0),
  reviews: z.number().min(0),
  tests: z.number().min(0),
  minutes: z.number().min(0),
});
export type DayProgress = z.infer<typeof DayProgressSchema>;

export const WordBankEntrySchema = z.strictObject({
  id: z.string(),
  en: z.string(),
  gu: z.string(),
  note: z.string().optional(),
  addedAt: z.string(),
});

export const WritingSchema = z.strictObject({
  text: z.string(),
  at: z.string(),
});
export const MAX_WRITINGS_PER_TASK = 5;

export const RecordingSchema = z.strictObject({
  key: z.string(),
  at: z.string(),
});

export const SettingsSchema = z.strictObject({
  transliteration: z.enum(['auto', 'always', 'tap', 'never']),
  voiceLang: z.enum(['en-IN', 'en-GB', 'en-US']),
  voiceRate: z.number().min(0.3).max(2),
  dailyGoalMinutes: z.number().min(1),
  unlockAll: z.boolean(),
});
export type Settings = z.infer<typeof SettingsSchema>;

export const ProgressSchema = z.strictObject({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  createdAt: z.string(),
  learnerName: z.string(),
  lastBackupAt: z.string().optional(),
  lessons: z.record(z.string(), LessonProgressSchema),
  videos: z.record(z.string(), VideoProgressSchema),
  srs: z.record(z.string(), SrsEntrySchema),
  mistakes: z.array(MistakeSchema).max(MAX_MISTAKES),
  tests: z.record(z.string(), TestProgressSchema),
  days: z.record(dateString, DayProgressSchema),
  notes: z.record(z.string(), z.string()),
  wordBank: z.array(WordBankEntrySchema),
  writings: z.record(z.string(), z.array(WritingSchema)),
  recordings: z.record(z.string(), z.array(RecordingSchema)),
  settings: SettingsSchema,
});
export type Progress = z.infer<typeof ProgressSchema>;
