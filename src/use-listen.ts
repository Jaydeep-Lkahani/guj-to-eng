// Listens to her through the microphone and turns what she says into text, using the browser's
// own speech recognition (Chrome on Android works best; Firefox and some iPhones have none).
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { stopSpeaking } from "./speech";

// Only the parts of the browser's recognizer we use.
type Alternative = { transcript: string };
type ResultList = ArrayLike<ArrayLike<Alternative>>;
type Recognizer = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: { results: ResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecognizerClass = new () => Recognizer;

function recognizerClass(): RecognizerClass | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognizerClass; webkitSpeechRecognition?: RecognizerClass };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function canListen(): boolean {
  return recognizerClass() !== undefined;
}

// False in the pre-built page and on the browser's first draw (so they match), then the real answer.
const noChange = () => () => {};
export function useCanListen(): boolean {
  return useSyncExternalStore(noChange, canListen, () => false);
}

// heard: the phone's guesses of what she said (best first).
// nothing: she was silent or it didn't catch anything. She can try again.
// blocked: no permission, no microphone or no connection. Use the "say it, then tap" way instead.
export type ListenResult = { kind: "heard"; alternatives: string[] } | { kind: "nothing" } | { kind: "blocked" };

const BLOCKED_ERRORS = ["not-allowed", "service-not-allowed", "audio-capture", "network", "language-not-supported"];

// The guesses for the whole utterance. Usually there is one result; if the phone split it, join the parts.
function alternativesOf(results: ResultList): string[] {
  const lists = Array.from(results);
  const most = Math.max(0, ...lists.map((r) => r.length));
  return Array.from({ length: most }, (_, i) =>
    lists
      .map((r) => (r[Math.min(i, r.length - 1)]?.transcript ?? "").trim())
      .join(" ")
      .trim(),
  ).filter(Boolean);
}

export function useListen() {
  const supported = useCanListen();
  const active = useRef<Recognizer | null>(null);

  // Stop listening if she leaves the question.
  useEffect(() => () => active.current?.abort(), []);

  const listen = useCallback(
    () =>
      new Promise<ListenResult>((resolve) => {
        const Rec = recognizerClass();
        if (!Rec) {
          resolve({ kind: "blocked" });
          return;
        }
        stopSpeaking(); // the Listen voice must not be heard as her answer

        const rec = new Rec();
        rec.lang = "en-IN";
        rec.interimResults = false;
        rec.maxAlternatives = 3;
        rec.continuous = false;

        let done = false;
        const finish = (result: ListenResult) => {
          if (done) return;
          done = true;
          if (active.current === rec) active.current = null;
          resolve(result);
        };
        rec.onresult = (e) => {
          const alternatives = alternativesOf(e.results);
          finish(alternatives.length > 0 ? { kind: "heard", alternatives } : { kind: "nothing" });
        };
        rec.onerror = (e) => finish(BLOCKED_ERRORS.includes(e.error) ? { kind: "blocked" } : { kind: "nothing" });
        rec.onend = () => finish({ kind: "nothing" });

        try {
          rec.start();
          active.current = rec;
        } catch {
          finish({ kind: "blocked" });
        }
      }),
    [],
  );

  // Tapping the mic again while it listens: stop now and check what was said so far.
  const stop = useCallback(() => active.current?.stop(), []);

  return { supported, listen, stop };
}

// The one-time note that Chrome sends her voice to Google to turn it into text.
const NOTE_KEY = "guj-eng.mic-note.v1";

export function micNoteSeen(): boolean {
  try {
    return localStorage.getItem(NOTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markMicNoteSeen(): void {
  try {
    localStorage.setItem(NOTE_KEY, "1");
  } catch {
    // Storage can be blocked. The note then shows again next visit, which is harmless.
  }
}
