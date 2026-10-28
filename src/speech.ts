// Reads English aloud. First choice is a recorded MP3 made by a natural-sounding voice
// (see scripts/make-audio.mjs), so the pronunciation is the same on every phone.
// If a sentence has no recording yet, the phone's or computer's built-in voice reads it instead.
import { useSyncExternalStore } from "react";
import audioManifest from "./audio-manifest.json";

function canUseVoice(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && (typeof Audio !== "undefined" || canUseVoice());
}

// For components: false in the pre-built page and on the browser's first draw (so they match),
// then the real answer right after.
const noChange = () => () => {};
export function useCanSpeak(): boolean {
  return useSyncExternalStore(noChange, canSpeak, () => false);
}

// Turns lesson text like "book → books" or "Neha: Hello!" into something a voice reads naturally.
// The audio script uses this too, so a recording is found by the same text.
export function speakable(text: string): string {
  return text
    .replace(/^[A-Z][a-z]+: /, "") // dialogue speaker names
    .replace(/^(.*[A-Za-z].*?)\s*\([^)]*\)$/, "$1") // a note at the end, like "(voice goes up)"
    .replace(/\s*(→|\+|\/|–|—)\s*/g, ", ")
    .replace(/…|___/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([?.!,])/g, "$1")
    .replace(/^[,\s]+|[,\s]+$/g, "")
    .trim();
}

// Spoken text -> MP3 file name in /audio. Part of the page itself, so it's ready on the very first tap
// (loading it during the tap would make iPhones block the sound).
const audioFiles = audioManifest.files as Record<string, string>;

export function audioFileFor(text: string): string | undefined {
  const file = audioFiles[speakable(text)];
  return file ? `/audio/${file}` : undefined;
}

// What is playing now, so a new tap (or leaving the page) can stop it and tell its button it ended.
let current: { audio?: HTMLAudioElement; finish: () => void } | undefined;

export function stopSpeaking(): void {
  const playing = current;
  current = undefined;
  playing?.audio?.pause();
  playing?.finish();
  if (canUseVoice()) window.speechSynthesis.cancel();
}

export function speak(text: string, onEnd?: () => void): void {
  stopSpeaking();
  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    onEnd?.();
  };

  const src = audioFileFor(text);
  if (!src || typeof Audio === "undefined") {
    speakWithVoice(text, finish);
    return;
  }

  const audio = new Audio(src);
  const me = { audio, finish };
  current = me;
  const fallBack = () => {
    if (current !== me) return; // stopped on purpose
    current = undefined;
    speakWithVoice(text, finish);
  };
  audio.onended = () => {
    if (current === me) current = undefined;
    finish();
  };
  audio.onerror = fallBack;
  audio.play()?.catch(fallBack);
}

// An Indian English voice first (closest to what she hears around her), then British, then any English.
function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  for (const lang of ["en-IN", "en-GB", "en-US"]) {
    const v = voices.find((x) => x.lang.replace("_", "-") === lang);
    if (v) return v;
  }
  return voices.find((x) => x.lang.toLowerCase().startsWith("en"));
}

function speakWithVoice(text: string, finish: () => void): void {
  if (!canUseVoice()) {
    finish();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(speakable(text));
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? "en-IN";
  u.rate = 0.85; // a little slower than normal, easier for a beginner
  u.onend = finish;
  u.onerror = finish;
  current = { finish };
  synth.speak(u);
}

// Some browsers load voices late; asking once early makes the first tap faster.
if (canUseVoice()) window.speechSynthesis.getVoices();
