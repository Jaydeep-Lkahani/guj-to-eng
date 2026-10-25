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
