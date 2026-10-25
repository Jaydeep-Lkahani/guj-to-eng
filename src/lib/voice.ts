export type VoiceLang = 'en-IN' | 'en-GB' | 'en-US';

export const SLOW_RATE = 0.6;

type VoiceLike = { lang: string };

function sameLang(a: string, b: string): boolean {
  return a.replace('_', '-').toLowerCase() === b.toLowerCase();
}

/**
 * Picks the English voice (pending.md 7.7): the first one in the chosen language
 * (en-IN and en_IN are the same), else en-GB, else en-US, else any English voice.
 */
export function pickVoice<T extends VoiceLike>(
  voices: readonly T[],
  preferred: VoiceLang,
): T | undefined {
  for (const lang of [preferred, 'en-GB', 'en-US']) {
    const found = voices.find((v) => sameLang(v.lang, lang));
    if (found) return found;
  }
  return voices.find((v) => /^en([-_]|$)/i.test(v.lang));
}

/** Normal speed comes from the settings, slow ("🐢") is always 0.6. */
export function speechRate(slow: boolean, voiceRate: number): number {
  return slow ? SLOW_RATE : voiceRate;
}
