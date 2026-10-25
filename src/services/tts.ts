import { pickVoice, type VoiceLang } from '../lib/voice';

/**
 * Text-to-speech with the browser's speechSynthesis (pending.md 7.7).
 * loading = voices may still arrive, ready = an English voice exists, none = no English voice.
 */
export type TtsStatus = 'loading' | 'ready' | 'none';

export type SpeakOptions = { lang: VoiceLang; rate: number };

export type Tts = {
  getStatus: () => TtsStatus;
  subscribe: (listener: () => void) => () => void;
  speak: (text: string, options: SpeakOptions) => void;
};

type Dependencies = {
  synth: () => SpeechSynthesis | undefined;
  /** How long to wait for voices before saying there is none. */
  waitMs?: number;
};

const ENGLISH = /^en([-_]|$)/i;

export function createTts({ synth, waitMs = 3000 }: Dependencies): Tts {
  const listeners = new Set<() => void>();
  let timedOut = false;
  let started = false;

  function compute(): TtsStatus {
    const engine = synth();
    if (!engine) return 'none';
    const voices = engine.getVoices();
    if (voices.some((v) => ENGLISH.test(v.lang))) return 'ready';
    return voices.length > 0 || timedOut ? 'none' : 'loading';
  }

  let status = compute();

  function refresh() {
    const next = compute();
    if (next === status) return;
    status = next;
    listeners.forEach((listener) => listener());
  }

  function start() {
    started = true;
    const engine = synth();
    if (!engine || status !== 'loading') return;
    engine.addEventListener('voiceschanged', refresh);
    setTimeout(() => {
      timedOut = true;
      refresh();
    }, waitMs);
  }

  return {
    getStatus: () => status,
    subscribe(listener) {
      listeners.add(listener);
      if (!started) start();
      return () => listeners.delete(listener);
    },
    speak(text, { lang, rate }) {
      const engine = synth();
      if (!engine) return;
      const voice = pickVoice(engine.getVoices(), lang);
      if (!voice) return;
      engine.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = rate;
      engine.speak(utterance);
    },
  };
}

/** The one text-to-speech used by the whole site. */
export const tts = createTts({
  synth: () =>
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : undefined,
});
