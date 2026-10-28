import { useEffect, useState } from "react";
import { SpeakerHigh } from "@phosphor-icons/react";
import type { Example } from "../content";
import { speak, stopSpeaking, useCanSpeak } from "../speech";

// One example: English, how to say it, and the Gujarati meaning.
// Where the browser can speak, the whole card is a button that reads the English aloud.
export function ExampleCard({ ex }: { ex: Example }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => stopSpeaking(), []);

  const speakable = useCanSpeak();
  const content = (
    <>
      <span lang="en" className="example-en">
        {ex.en}
      </span>
      <span className="visually-hidden"> – </span>
      <span className="example-translit">
        {ex.translit}
        {speakable && (
          <span className="example-speaker" aria-hidden="true">
            <SpeakerHigh weight="duotone" />
          </span>
        )}
      </span>
      <span className="visually-hidden"> – </span>
      <span className="example-gu">{ex.gu}</span>
    </>
  );

  if (!speakable) return <li className="example">{content}</li>;

  return (
    <li className="example example-speak">
      <button
        type="button"
        className={playing ? "example-play playing" : "example-play"}
        onClick={() => {
          setPlaying(true);
          speak(ex.en, () => setPlaying(false));
        }}
      >
        {content}
        <span className="visually-hidden"> (સાંભળો)</span>
      </button>
    </li>
  );
}
