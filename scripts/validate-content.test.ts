import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateContent } from '../src/lib/validateContent.ts';
import { readContentFiles } from './read-content.ts';

describe('the real content folder', () => {
  const { files, problems } = readContentFiles(
    resolve(import.meta.dirname, '..', 'content'),
  );

  it('is valid JSON', () => {
    expect(problems).toEqual([]);
  });

  it('passes the validator with no errors', () => {
    expect(validateContent(files).errors).toEqual([]);
  });
});

describe('readContentFiles', () => {
  it('reads nested JSON files by their path and reports broken JSON', () => {
    const dir = mkdtempSync(join(tmpdir(), 'gujeng-content-'));
    try {
      mkdirSync(join(dir, 'lessons'));
      writeFileSync(join(dir, 'videos.json'), '{"videos":[]}');
      writeFileSync(join(dir, 'lessons', 'broken.json'), '{ nope');
      writeFileSync(join(dir, 'notes.md'), 'ignored');

      const { files, problems } = readContentFiles(dir);
      expect(files).toEqual({ 'videos.json': { videos: [] } });
      expect(problems).toHaveLength(1);
      expect(problems[0]).toMatchObject({
        rule: 'json-parse',
        file: 'lessons/broken.json',
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
