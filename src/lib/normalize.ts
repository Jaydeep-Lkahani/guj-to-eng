/**
 * Normalises typed answers and word tiles before comparing them (pending.md 7.6):
 * trim, collapse spaces, lower-case, curly quotes and apostrophes to straight,
 * remove one final ".", "!" or "?".
 */
export function normalizeAnswer(text: string): string {
  return text
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/[.!?]$/, '')
    .trimEnd();
}
