import type { ZodType } from 'zod';
import {
  LessonsFileSchema,
  PhasesFileSchema,
  TestFileSchema,
  VideosFileSchema,
  VocabFileSchema,
  type LessonsFile,
  type PhasesFile,
  type TestFile,
  type VideosFile,
  type VocabFile,
} from '../schema/content.ts';

/** Content files, keyed by their path inside content/, e.g. "lessons/p1-t01.json". */
export type ContentFiles = Record<string, unknown>;

export type Issue = {
  rule: string;
  file: string;
  /** Where inside the file, e.g. "lessons.0.quiz.2.options". Empty for a whole file. */
  path: string;
  message: string;
};

export type Entry<T> = { file: string; data: T };

export type ParsedContent = {
  phases: Entry<PhasesFile> | null;
  videos: Entry<VideosFile> | null;
  vocab: (Entry<VocabFile> & { phaseId: string })[];
  lessons: (Entry<LessonsFile> & { topicId: string })[];
  tests: (Entry<TestFile> & { testId: string })[];
};

type FileKind =
  | { kind: 'phases' }
  | { kind: 'videos' }
  | { kind: 'vocab'; phaseId: string }
  | { kind: 'lessons'; topicId: string }
  | { kind: 'tests'; testId: string };

/** Which kind of content a path is, or null if it is not an allowed content file. */
export function classifyContentPath(path: string): FileKind | null {
  if (path === 'phases.json') return { kind: 'phases' };
  if (path === 'videos.json') return { kind: 'videos' };
  const vocab = /^vocab\/(p[1-9])\.json$/.exec(path);
  if (vocab?.[1]) return { kind: 'vocab', phaseId: vocab[1] };
  const lessons = /^lessons\/(p[1-9]-t\d{2})\.json$/.exec(path);
  if (lessons?.[1]) return { kind: 'lessons', topicId: lessons[1] };
  const tests = /^tests\/(p[1-9]-final)\.json$/.exec(path);
  if (tests?.[1]) return { kind: 'tests', testId: tests[1] };
  return null;
}

function parseWith<T>(
  schema: ZodType<T>,
  file: string,
  data: unknown,
  issues: Issue[],
): T | null {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  for (const issue of result.error.issues) {
    issues.push({
      rule: 'schema',
      file,
      path: issue.path.join('.'),
      message: issue.message,
    });
  }
  return null;
}

/** Checks every file against its zod schema. Files that fail are left out of `parsed`. */
export function parseContentFiles(files: ContentFiles): {
  parsed: ParsedContent;
  issues: Issue[];
} {
  const issues: Issue[] = [];
  const parsed: ParsedContent = {
    phases: null,
    videos: null,
    vocab: [],
    lessons: [],
    tests: [],
  };

  for (const file of Object.keys(files).sort()) {
    const data = files[file];
    const kind = classifyContentPath(file);
    if (!kind) {
      issues.push({
        rule: 'unknown-file',
        file,
        path: '',
        message:
          'Not an allowed content file. Allowed: phases.json, videos.json, vocab/p{n}.json, lessons/p{n}-t{nn}.json, tests/p{n}-final.json.',
      });
      continue;
    }
    switch (kind.kind) {
      case 'phases': {
        const result = parseWith(PhasesFileSchema, file, data, issues);
        if (result) parsed.phases = { file, data: result };
        break;
      }
      case 'videos': {
        const result = parseWith(VideosFileSchema, file, data, issues);
        if (result) parsed.videos = { file, data: result };
        break;
      }
      case 'vocab': {
        const result = parseWith(VocabFileSchema, file, data, issues);
        if (result)
          parsed.vocab.push({ file, data: result, phaseId: kind.phaseId });
        break;
      }
      case 'lessons': {
        const result = parseWith(LessonsFileSchema, file, data, issues);
        if (result)
          parsed.lessons.push({ file, data: result, topicId: kind.topicId });
        break;
      }
      case 'tests': {
        const result = parseWith(TestFileSchema, file, data, issues);
        if (result)
          parsed.tests.push({ file, data: result, testId: kind.testId });
        break;
      }
    }
  }
  return { parsed, issues };
}
