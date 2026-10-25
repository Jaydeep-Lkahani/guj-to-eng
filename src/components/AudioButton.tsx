import { Turtle, Volume2 } from 'lucide-react';
import { gu } from '../i18n/gu';
import { speechRate } from '../lib/voice';
import { tts } from '../services/tts';
import { useProgress } from '../state/progressContext';
import { useTtsStatus } from './useTtsStatus';

const BUTTON =
  'bg-surface text-primary inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-black/15';

/**
 * Plays English text with the browser voice: a normal button and a slow ("🐢") button (pending.md 7.7).
 * The labels never contain the text, because listening exercises must not give the answer away.
 * Without an English voice nothing is shown (the lesson shows one notice instead).
 */
export function AudioButton({ text }: { text: string }) {
  const status = useTtsStatus();
  const { progress } = useProgress();
  if (status === 'none') return null;
  const { voiceLang, voiceRate } = progress.settings;
  const speak = (slow: boolean) =>
    tts.speak(text, { lang: voiceLang, rate: speechRate(slow, voiceRate) });

  return (
    <span className="inline-flex shrink-0 gap-2">
      <button
        type="button"
        className={BUTTON}
        aria-label={gu.audio.listen}
        onClick={() => speak(false)}
      >
        <Volume2 aria-hidden size={24} />
      </button>
      <button
        type="button"
        className={BUTTON}
        aria-label={gu.audio.listenSlowly}
        onClick={() => speak(true)}
      >
        <Turtle aria-hidden size={24} />
      </button>
    </span>
  );
}
