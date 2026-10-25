import { buildContent, type Content } from '../lib/content';

// Every JSON file in content/, keyed by its path inside that folder (e.g. "lessons/p1-t01.json").
const modules = import.meta.glob<unknown>('../../content/**/*.json', {
  eager: true,
  import: 'default',
});

let cached: Content | undefined;

/** The learning content. Built once. Throws if a file does not match its schema. */
export function getContent(): Content {
  cached ??= buildContent(
    Object.fromEntries(
      Object.entries(modules).map(([path, data]) => [
        path.replace(/^.*\/content\//, ''),
        data,
      ]),
    ),
  );
  return cached;
}
