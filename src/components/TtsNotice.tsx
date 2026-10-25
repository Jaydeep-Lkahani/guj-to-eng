import { deviceTerms, gu } from '../i18n/gu';
import { En } from './En';
import { useTtsStatus } from './useTtsStatus';

/** One Gujarati notice, shown when the phone has no English voice (pending.md 7.7). */
export function TtsNotice() {
  if (useTtsStatus() !== 'none') return null;
  return (
    <p
      role="note"
      className="bg-surface mb-4 rounded-xl border border-black/15 p-3"
    >
      {gu.audio.noVoiceBefore} <En>{deviceTerms.textToSpeechPath}</En>{' '}
      {gu.audio.noVoiceAfter}
    </p>
  );
}
