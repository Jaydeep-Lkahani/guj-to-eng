import { useEffect, useRef, useState } from "react";
import { speak, stopSpeaking, useCanSpeak } from "../speech";

// Gujarati text that can contain English words marked like [[Water]].
// English parts get lang="en" and a slightly different style.
// With `say`, each English part can be tapped to hear it.
export function MixedText({ text, say = false }: { text: string; say?: boolean }) {
  const pieces = text.split(/\[\[(.+?)\]\]/);
  return (
    <>
      {pieces.map((piece, i) =>
        i % 2 === 1 ? (
          say ? <SayEn key={i}>{piece}</SayEn> : <En key={i}>{piece}</En>
        ) : (
          piece
        ),
      )}
    </>
  );
}

export function En({ children }: { children: string }) {
  return (
    <span lang="en" className="en">
      {children}
    </span>
  );
}

// An English word inside a Gujarati sentence that reads itself aloud when tapped.
// Plain text in the pre-built page; becomes a button once the browser shows it can speak.
function SayEn({ children }: { children: string }) {
  const speakable = useCanSpeak();
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  playingRef.current = playing;
  // Leaving the page while this word talks: stop it.
  useEffect(() => () => {
    if (playingRef.current) stopSpeaking();
  }, []);

  if (!speakable) return <En>{children}</En>;
  return (
    <button
      type="button"
      lang="en"
      className={playing ? "en say playing" : "en say"}
      aria-label={`સાંભળો: ${children}`}
      onClick={() => {
        setPlaying(true);
        speak(children, () => setPlaying(false));
      }}
    >
      {children}
    </button>
  );
}

const gujaratiLetters = /[઀-૿]/;

// For short strings like quiz options that are either all English or all Gujarati.
export function AutoText({ text }: { text: string }) {
  if (text.includes("[[")) return <MixedText text={text} />;
  return gujaratiLetters.test(text) ? <>{text}</> : <En>{text}</En>;
}
