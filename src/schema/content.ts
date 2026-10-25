import { z } from 'zod';

/**
 * Content schemas (pending.md 7.4), defined once in zod. TypeScript types come from z.infer.
 *
 * These schemas only check the SHAPE of the data. Everything else (ID formats, counts,
 * references, Gujarati / English letters, order rules) is checked by the content validator
 * in src/lib/validateContent.ts, so that every rule has its own name and its own test.
 */

/** The 26 Gujarati-speaker problems from pending.md section 1. */
export const GS_IDS: readonly string[] = Array.from(
  { length: 26 },
  (_, i) => `GS-${String(i + 1).padStart(2, '0')}`,
);

export const EXERCISE_SECTIONS = [
  'warmup',
  'practice',
  'speak',
  'write',
  'quiz',
] as const;

// ---------------------------------------------------------------- exercises

const exerciseBase = {
  id: z.string(),
  promptGu: z.string(),
  explainGu: z.string(),
};

export const ExerciseSchema = z.discriminatedUnion('type', [
  z.strictObject({
    ...exerciseBase,
    type: z.literal('mcq'),
    options: z.array(z.string()),
    answer: z.number().int(),
    promptEn: z.string().optional(),
    audio: z.string().optional(),
  }),
  z.strictObject({
    ...exerciseBase,
    type: z.literal('trueFalse'),
    statementEn: z.string(),
    answer: z.boolean(),
  }),
  z.strictObject({
    ...exerciseBase,
    type: z.literal('fill'),
    sentence: z.string(),
    answers: z.array(z.string()).min(1),
  }),
  z.strictObject({
    ...exerciseBase,
    type: z.literal('order'),
    tiles: z.array(z.string()).min(1),
    answers: z.array(z.string()).min(1),
  }),
  z.strictObject({
    ...exerciseBase,
    type: z.literal('match'),
    pairs: z.array(z.strictObject({ left: z.string(), right: z.string() })),
  }),
  z.strictObject({
    ...exerciseBase,
    type: z.literal('listenChoose'),
    audio: z.string(),
    options: z.array(z.string()),
    answer: z.number().int(),
  }),
  z.strictObject({
    ...exerciseBase,
    type: z.literal('listenType'),
    audio: z.string(),
    answers: z.array(z.string()).min(1),
  }),
  z.strictObject({
    ...exerciseBase,
    type: z.literal('translate'),
    gu: z.string(),
    answers: z.array(z.string()).min(1),
  }),
]);
export type Exercise = z.infer<typeof ExerciseSchema>;

export const SpeakItemSchema = z.strictObject({
  id: z.string(),
  en: z.string(),
  gu: z.string(),
  translit: z.string().optional(),
});
export type SpeakItem = z.infer<typeof SpeakItemSchema>;

export const WriteTaskSchema = z.strictObject({
  id: z.string(),
  kind: z.enum(['type', 'handwrite']),
  promptGu: z.string(),
  model: z.string().optional(),
  minWords: z.number().int().positive().optional(),
  letters: z.string().optional(),
});
export type WriteTask = z.infer<typeof WriteTaskSchema>;

// ------------------------------------------------------------------ lessons

export const ExampleSchema = z.strictObject({
  en: z.string(),
  gu: z.string(),
  translit: z.string().optional(),
  noteGu: z.string().optional(),
});
export type Example = z.infer<typeof ExampleSchema>;

export const BlockSchema = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('heading'), gu: z.string() }),
  z.strictObject({ type: z.literal('text'), gu: z.string() }),
  z.strictObject({
    type: z.literal('table'),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  z.strictObject({
    type: z.literal('compare'),
    gu: z.string(),
    en: z.string(),
    noteGu: z.string().optional(),
  }),
  z.strictObject({
    type: z.literal('mistake'),
    wrong: z.string(),
    right: z.string(),
    whyGu: z.string(),
    gsId: z.string().optional(),
  }),
  z.strictObject({ type: z.literal('tip'), gu: z.string() }),
  z.strictObject({
    type: z.literal('example'),
    en: z.string(),
    gu: z.string(),
    translit: z.string().optional(),
  }),
]);
export type Block = z.infer<typeof BlockSchema>;

export const LessonSchema = z.strictObject({
  id: z.string(),
  topicId: z.string(),
  order: z.number().int(),
  titleGu: z.string(),
  titleEn: z.string(),
  estimatedMinutes: z.number(),
  videoIds: z.array(z.string()),
  explanation: z.array(BlockSchema),
  examples: z.array(ExampleSchema),
  practice: z.array(ExerciseSchema),
  speak: z.array(SpeakItemSchema),
  write: z.array(WriteTaskSchema),
  quiz: z.array(ExerciseSchema),
  useToday: z.strictObject({ en: z.string(), gu: z.string() }),
  newWordIds: z.array(z.string()),
  targetsMistakes: z.array(z.string()),
  reviewedGu: z.boolean(),
});
export type Lesson = z.infer<typeof LessonSchema>;

export const LessonsFileSchema = z.strictObject({
  topicId: z.string(),
  lessons: z.array(LessonSchema),
});
export type LessonsFile = z.infer<typeof LessonsFileSchema>;

// ------------------------------------------------------------------- phases

export const TopicSchema = z.strictObject({
  id: z.string(),
  code: z.string(),
  order: z.number().int(),
  titleGu: z.string(),
  titleEn: z.string(),
  introGu: z.string(),
  videoIds: z.array(z.string()),
});
export type Topic = z.infer<typeof TopicSchema>;

export const PhaseSchema = z.strictObject({
  id: z.enum(['p1', 'p2', 'p3']),
  order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  titleGu: z.string(),
  titleEn: z.string(),
  levelCefr: z.string(),
  goalGu: z.string(),
  finalTestId: z.string(),
  topics: z.array(TopicSchema),
  recommendedOrder: z.array(z.string()),
});
export type Phase = z.infer<typeof PhaseSchema>;

export const PhasesFileSchema = z.strictObject({
  phases: z.array(PhaseSchema),
});
export type PhasesFile = z.infer<typeof PhasesFileSchema>;

// -------------------------------------------------------------------- vocab

export const WORD_POS = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'phrase',
  'number',
  'other',
] as const;

export const WordSchema = z.strictObject({
  id: z.string(),
  en: z.string(),
  gu: z.string(),
  translit: z.string(),
  pos: z.enum(WORD_POS),
  phaseId: z.string(),
  topicId: z.string(),
  emoji: z.string().optional(),
  exampleEn: z.string().optional(),
  exampleGu: z.string().optional(),
});
export type Word = z.infer<typeof WordSchema>;

export const VocabFileSchema = z.strictObject({
  words: z.array(WordSchema),
});
export type VocabFile = z.infer<typeof VocabFileSchema>;

// ------------------------------------------------------------------- videos

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const VideoSchema = z.strictObject({
  id: z.string(),
  youtubeId: z.string(),
  titleOriginal: z.string(),
  channel: z.string(),
  titleGu: z.string(),
  aboutGu: z.string(),
  durationSeconds: z.number().positive().optional(),
  startSeconds: z.number().nonnegative().optional(),
  endSeconds: z.number().positive().optional(),
  topicIds: z.array(z.string()),
  keyWordIds: z.array(z.string()),
  checkQuestions: z.array(ExerciseSchema),
  status: z.enum(['candidate', 'approved', 'rejected']),
  foundAt: dateString,
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
  reviewNote: z.string().optional(),
  lastLinkCheck: dateString.optional(),
});
export type Video = z.infer<typeof VideoSchema>;

export const VideosFileSchema = z.strictObject({
  videos: z.array(VideoSchema),
});
export type VideosFile = z.infer<typeof VideosFileSchema>;

// -------------------------------------------------------------------- tests

export const TEST_SKILLS = [
  'alphabet',
  'vocabulary',
  'grammar',
  'spelling',
  'reading',
  'listening',
  'writing',
  'speaking',
] as const;

export const TestSectionSchema = z.strictObject({
  id: z.string(),
  titleGu: z.string(),
  skill: z.enum(TEST_SKILLS),
  passageEn: z.string().optional(),
  exercises: z.array(ExerciseSchema).optional(),
  write: z.array(WriteTaskSchema).optional(),
  speak: z.array(SpeakItemSchema).optional(),
});
export type TestSection = z.infer<typeof TestSectionSchema>;

export const TestFileSchema = z.strictObject({
  id: z.string(),
  phaseId: z.string(),
  titleGu: z.string(),
  passPercent: z.literal(70),
  sections: z.array(TestSectionSchema),
});
export type TestFile = z.infer<typeof TestFileSchema>;
