// npm run validate:content: checks every JSON file in content/ (pending.md 7.12).
import { resolve } from 'node:path';
import type { Issue } from '../src/lib/contentFiles.ts';
import { validateContent } from '../src/lib/validateContent.ts';
import { readContentFiles } from './read-content.ts';

const contentDir = resolve(import.meta.dirname, '..', 'content');
const { files, problems } = readContentFiles(contentDir);
const { errors, warnings } = validateContent(files);
const allErrors = [...problems, ...errors];

const out = (line: string) => process.stdout.write(`${line}\n`);
const where = (issue: Issue) =>
  [issue.file, issue.path].filter((part) => part !== '').join(' > ');

for (const issue of allErrors) {
  out(`ERROR   [${issue.rule}] ${where(issue)}: ${issue.message}`);
}
for (const issue of warnings) {
  const place = where(issue);
  out(
    `warning [${issue.rule}] ${place === '' ? '' : `${place}: `}${issue.message}`,
  );
}

out(
  `validate:content: ${Object.keys(files).length} file(s), ${allErrors.length} error(s), ${warnings.length} warning(s).`,
);
process.exitCode = allErrors.length > 0 ? 1 : 0;
