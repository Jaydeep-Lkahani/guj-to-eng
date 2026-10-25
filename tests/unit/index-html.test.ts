import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { gu } from '../../src/i18n/gu.ts';

describe('index.html', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

  it('is a Gujarati page', () => {
    expect(html).toContain('<html lang="gu">');
  });

  it('has the app name from gu.ts as its first title', () => {
    expect(html).toContain(`<title>${gu.appName}</title>`);
  });
});
