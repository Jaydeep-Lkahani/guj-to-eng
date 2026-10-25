import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Topic = { id: string; titleGu: string; introGu: string; order: number };
type Phase = { id: string; titleGu: string; topics: Topic[] };

/** The real phases from content/phases.json, so the tests check what the site should show. */
export const PHASES: Phase[] = (
  JSON.parse(
    readFileSync(resolve(process.cwd(), 'content/phases.json'), 'utf8'),
  ) as {
    phases: Phase[];
  }
).phases;

export type Exercise =
  | {
      id: string;
      type: 'mcq' | 'listenChoose';
      options: string[];
      answer: number;
    }
  | { id: string; type: 'trueFalse'; answer: boolean }
  | { id: string; type: 'fill' | 'listenType' | 'translate'; answers: string[] }
  | { id: string; type: 'order'; answers: string[] }
  | { id: string; type: 'match'; pairs: { left: string; right: string }[] };

type SampleLesson = {
  id: string;
  titleGu: string;
  practice: Exercise[];
  quiz: Exercise[];
  newWordIds: string[];
  useToday: { en: string };
};

/** The sample lesson from content/lessons/p1-t01.json. */
export const LESSON: SampleLesson = (
  JSON.parse(
    readFileSync(resolve(process.cwd(), 'content/lessons/p1-t01.json'), 'utf8'),
  ) as { lessons: SampleLesson[] }
).lessons[0]!;
