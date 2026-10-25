/**
 * English inside Gujarati text is written {{en:word}} (pending.md 7.4).
 * These helpers split such text so English can be shown with the <En> component.
 */

export type RichPart = { kind: 'gu' | 'en'; text: string };

const TOKEN = /\{\{en:(.+?)\}\}/g;

export function parseRichText(input: string): RichPart[] {
  const parts: RichPart[] = [];
  let last = 0;
  for (const match of input.matchAll(TOKEN)) {
    if (match.index > last) {
      parts.push({ kind: 'gu', text: input.slice(last, match.index) });
    }
    parts.push({ kind: 'en', text: match[1] ?? '' });
    last = match.index + match[0].length;
  }
  if (last < input.length) parts.push({ kind: 'gu', text: input.slice(last) });
  return parts;
}

/** The English words inside the {{en:...}} markers. */
export function englishTokens(input: string): string[] {
  return Array.from(input.matchAll(TOKEN), (match) => match[1] ?? '');
}

/** The text with the markers removed and the English kept (for the browser tab title). */
export function plainText(input: string): string {
  return input.replace(TOKEN, '$1');
}

/** The text with the English inside markers removed (to find English typed outside markers). */
export function withoutEnglishTokens(input: string): string {
  return input.replace(TOKEN, '');
}
