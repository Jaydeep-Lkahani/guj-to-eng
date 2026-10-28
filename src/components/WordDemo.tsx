import { useEffect, useRef, useState } from "react";
import { SpeakerHigh } from "@phosphor-icons/react";
import { speak, stopSpeaking, useCanSpeak } from "../speech";

// A small live sample of a lesson card for the home page: it moves to the next word on its own,
// can be tapped to hear the English, and the dots pick a word by hand.
// Spellings are copied from the lessons so they match what she'll see there.
export const demoWords = [
  { en: "Water", translit: "વૉટર", gu: "પાણી" },
  { en: "Thank you", translit: "થૅન્ક યૂ", gu: "આભાર" },
  { en: "Good morning", translit: "ગુડ મૉર્નિંગ", gu: "સુપ્રભાત" },
  { en: "Family", translit: "ફૅમિલી", gu: "કુટુંબ" },
  { en: "How are you?", translit: "હાઉ આર યૂ?", gu: "તમે કેમ છો?" },
];

const STEP_MS = 3600;

export function WordDemo() {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false); // pointer over it or keyboard focus inside
  const [playing, setPlaying] = useState(false);
  const [still, setStill] = useState(true); // true until we know motion is welcome
  const canSpeak = useCanSpeak();
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia) return; // very old browsers and tests: stay still
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);

  const paused = held || playing || still;

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % demoWords.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [index, paused]);

  useEffect(() => () => stopSpeaking(), []);

  const word = demoWords[index];

  // A gentle 3D tilt that follows the mouse (not on touch screens, not with reduced motion).
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || still || !card.current) return;
    const r = card.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.current.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    card.current.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
  };
  const untilt = () => {
    card.current?.style.removeProperty("--rx");
    card.current?.style.removeProperty("--ry");
  };

  return (
    <div
      ref={card}
      className="wd"
      data-paused={paused || undefined}
      onPointerEnter={() => setHeld(true)}
      onPointerMove={tilt}
      onPointerLeave={() => {
        setHeld(false);
        untilt();
      }}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false);
      }}
    >
      <div className="wd-head">
        <span className="wd-tag">
          <span className="wd-tag-dot" aria-hidden="true" />
          પાઠમાં આવું દેખાશે
        </span>
        <span className="wd-count" aria-hidden="true">
          {index + 1}/{demoWords.length}
        </span>
      </div>

      <div className="wd-body" key={index}>
        <span lang="en" className="wd-en">
          {word.en}
        </span>
        <span className="wd-row">
          <span className="wd-label">ઉચ્ચાર</span>
          <span className="wd-translit">{word.translit}</span>
        </span>
        <span className="wd-row">
          <span className="wd-label">અર્થ</span>
          <span className="wd-gu">{word.gu}</span>
        </span>
      </div>

      <div className="wd-foot">
        <div className="wd-dots" role="group" aria-label="બીજો શબ્દ જુઓ">
          {demoWords.map((w, i) => (
            <button
              key={w.en}
              type="button"
              className="wd-dot"
              aria-label={`શબ્દ ${i + 1}: ${w.en}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <span className="wd-dot-mark">
                {i === index && <span className="wd-dot-fill" key={index} />}
              </span>
            </button>
          ))}
        </div>
        {canSpeak && (
          <button
            type="button"
            className={playing ? "wd-listen playing" : "wd-listen"}
            onClick={() => {
              setPlaying(true);
              speak(word.en, () => setPlaying(false));
            }}
          >
            {playing ? (
              <span className="wd-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <SpeakerHigh weight="fill" aria-hidden="true" />
            )}
            સાંભળો
          </button>
        )}
      </div>
    </div>
  );
}
