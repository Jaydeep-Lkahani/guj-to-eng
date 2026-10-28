import { useEffect, useState } from "react";
import { SpeakerHigh } from "@phosphor-icons/react";
import { speak, stopSpeaking, useCanSpeak } from "../speech";

// A "સાંભળો" button that plays the English text aloud. Hidden when the browser can't speak.
export function ListenButton({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const speakable = useCanSpeak();

  // Stop the voice if she leaves the page while it is talking.
  useEffect(() => () => stopSpeaking(), []);

  if (!speakable) return null;

  return (
    <button
      type="button"
      className={playing ? "listen playing" : "listen"}
      aria-label={`સાંભળો: ${text}`}
      onClick={() => {
        setPlaying(true);
        speak(text, () => setPlaying(false));
      }}
    >
      <SpeakerHigh weight="duotone" aria-hidden="true" />
      <span>સાંભળો</span>
    </button>
  );
}
