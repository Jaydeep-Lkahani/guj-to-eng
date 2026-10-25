import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { ContentFiles, Issue } from '../src/lib/contentFiles.ts';

/** Reads every .json file under a content folder. Files that are not valid JSON are reported. */
export function readContentFiles(dir: string): {
  files: ContentFiles;
  problems: Issue[];
} {
  const files: ContentFiles = {};
  const problems: Issue[] = [];

  const walk = (folder: string) => {
    for (const name of readdirSync(folder).sort()) {
      const full = join(folder, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (name.endsWith('.json')) {
        const file = relative(dir, full).split(sep).join('/');
        try {
          files[file] = JSON.parse(readFileSync(full, 'utf8')) as unknown;
        } catch (cause) {
          problems.push({
            rule: 'json-parse',
            file,
            path: '',
            message: cause instanceof Error ? cause.message : 'Not valid JSON.',
          });
        }
      }
    }
  };

  walk(dir);
  return { files, problems };
}
