import {
  parseContentFiles,
  type ContentFiles,
  type Issue,
} from './contentFiles.ts';
import type { Lesson, Phase, Topic, Video, Word } from '../schema/content.ts';

/** All learning content, checked against the schemas and ready to use. */
export type Content = {
  phases: Phase[];
  videos: Video[];
  words: Word[];
  /** Lessons of each topic, in their own order. Topics without lessons are missing. */
  lessonsByTopic: Record<string, Lesson[]>;
};

export class ContentError extends Error {
  readonly issues: Issue[];

  constructor(issues: Issue[]) {
    const first = issues[0];
    super(
      `Content is invalid (${issues.length} problem(s)). First: ${first ? `${first.file} ${first.path}: ${first.message}` : 'unknown'}. Run npm run validate:content.`,
    );
    this.name = 'ContentError';
    this.issues = issues;
  }
}

/** Builds the content from the raw files. Throws ContentError when a file does not match its schema. */
export function buildContent(files: ContentFiles): Content {
  const { parsed, issues } = parseContentFiles(files);
  const problems = [...issues];
  if (!parsed.phases) {
    problems.push({
      rule: 'missing-file',
      file: 'phases.json',
      path: '',
      message: 'Missing or invalid.',
    });
  }
  if (!parsed.videos) {
    problems.push({
      rule: 'missing-file',
      file: 'videos.json',
      path: '',
      message: 'Missing or invalid.',
    });
  }
  if (problems.length > 0 || !parsed.phases || !parsed.videos) {
    throw new ContentError(problems);
  }

  const lessonsByTopic: Record<string, Lesson[]> = {};
  for (const { data } of parsed.lessons) {
    lessonsByTopic[data.topicId] = [...data.lessons].sort(
      (a, b) => a.order - b.order,
    );
  }

  return {
    phases: [...parsed.phases.data.phases].sort((a, b) => a.order - b.order),
    videos: parsed.videos.data.videos,
    words: parsed.vocab.flatMap((entry) => entry.data.words),
    lessonsByTopic,
  };
}

export function findTopic(
  content: Content,
  topicId: string,
): { phase: Phase; topic: Topic } | undefined {
  for (const phase of content.phases) {
    const topic = phase.topics.find((t) => t.id === topicId);
    if (topic) return { phase, topic };
  }
  return undefined;
}

export function lessonsOfTopic(content: Content, topicId: string): Lesson[] {
  return content.lessonsByTopic[topicId] ?? [];
}

/** Only approved videos are ever shown (pending.md V.3). Keeps the order of `ids`. */
export function approvedVideos(
  content: Content,
  ids: readonly string[],
): Video[] {
  const result: Video[] = [];
  for (const id of ids) {
    const video = content.videos.find((v) => v.id === id);
    if (video?.status === 'approved') result.push(video);
  }
  return result;
}
