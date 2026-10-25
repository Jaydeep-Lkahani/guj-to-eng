import type { Settings } from '../schema/progress';

export type TranslitMode = 'always' | 'tap' | 'never';

/** "auto" = Phase 1 always, Phase 2 on tap, Phase 3 never (pending.md section 0 and 7.5). */
export function translitMode(
  setting: Settings['transliteration'],
  phaseId: string | undefined,
): TranslitMode {
  if (setting !== 'auto') return setting;
  if (phaseId === 'p1') return 'always';
  if (phaseId === 'p2') return 'tap';
  return 'never';
}
