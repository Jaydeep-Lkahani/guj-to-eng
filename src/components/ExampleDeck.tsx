import { useCallback, useEffect, useRef, useState } from "react";
import { EyeSlash, Eye, Play, Stop, SpeakerHigh } from "@phosphor-icons/react";
import type { Example } from "../content";
import { speak, stopSpeaking, useCanSpeak } from "../speech";
import { ExampleCard } from "./ExampleCard";

// The example cards with a small toolbar:
// - "બધા સાંભળો" plays every card one after another,
// - "અર્થ છુપાવો" hides the Gujarati meanings so she can test herself,
// - a counter of how many cards she has listened to.
export function ExampleDeck({ examples, onHeard }: { examples: Example[]; onHeard?: (count: number) => void }) {
  const speakable = useCanSpeak();
  const [playing, setPlaying] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [heard, setHeard] = useState<Set<number>>(() => new Set());
  const [hideMeaning, setHideMeaning] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set());
  const deck = useRef<HTMLUListElement>(null);
  const run = useRef(0); // bumps on every new play, so old "finished" calls are ignored
  const timer = useRef<number | undefined>(undefined);

  const markHeard = (i: number) => setHeard((h) => (h.has(i) ? h : new Set(h).add(i)));

  const stopAll = useCallback(() => {
    run.current++;
    window.clearTimeout(timer.current);
    stopSpeaking();
    setPlaying(null);
    setAutoPlay(false);
  }, []);

  // Leaving the page: stop talking.
  useEffect(
    () => () => {
      run.current++;
      window.clearTimeout(timer.current);
      stopSpeaking();
    },
    [],
  );

  useEffect(() => onHeard?.(heard.size), [heard, onHeard]);

  const playOne = (i: number) => {
    const id = ++run.current;
    window.clearTimeout(timer.current);
    setAutoPlay(false);
    setPlaying(i);
    markHeard(i);
    speak(examples[i].en, () => {
      if (run.current === id) setPlaying(null);
    });
  };

  const step = (id: number, i: number) => {
    if (run.current !== id) return;
    if (i >= examples.length) {
      setPlaying(null);
      setAutoPlay(false);
      return;
    }
    setPlaying(i);
    markHeard(i);
    const card = deck.current?.querySelector(`[data-index="${i}"]`);
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
    card?.scrollIntoView({ block: "nearest", behavior: still ? "auto" : "smooth" });
    speak(examples[i].en, () => {
      if (run.current !== id) return;
      setPlaying(null);
      timer.current = window.setTimeout(() => step(id, i + 1), 450);
    });
  };

  const playAll = () => {
    const id = ++run.current;
    setAutoPlay(true);
    // Carry on from the card playing now, or start at the top.
    step(id, playing ?? 0);
  };

  const tap = (i: number) => {
    if (hideMeaning && !revealed.has(i)) setRevealed((r) => new Set(r).add(i));
    if (speakable) playOne(i);
  };

  const pct = examples.length ? Math.round((heard.size / examples.length) * 100) : 0;

  return (
    <>
      <div className="lx-toolbar" role="group" aria-label="ઉદાહરણનાં બટન">
        {speakable && (
          <button
            type="button"
            className={autoPlay ? "lx-tool active" : "lx-tool"}
            aria-pressed={autoPlay}
            onClick={autoPlay ? stopAll : playAll}
          >
            {autoPlay ? <Stop weight="fill" aria-hidden="true" /> : <Play weight="fill" aria-hidden="true" />}
            {autoPlay ? "રોકો" : "બધા સાંભળો"}
          </button>
        )}
        <button
          type="button"
          className={hideMeaning ? "lx-tool active" : "lx-tool"}
          aria-pressed={hideMeaning}
          onClick={() => {
            setHideMeaning((h) => !h);
            setRevealed(new Set());
          }}
        >
          {hideMeaning ? <Eye weight="bold" aria-hidden="true" /> : <EyeSlash weight="bold" aria-hidden="true" />}
          {hideMeaning ? "અર્થ બતાવો" : "અર્થ છુપાવો"}
        </button>
        {speakable && (
          <p className="lx-heard">
            <span className="lx-heard-ring" style={{ "--pct": pct } as React.CSSProperties} aria-hidden="true">
              <SpeakerHigh weight="fill" />
            </span>
            <span>
              <strong>{heard.size}</strong> / {examples.length} સાંભળ્યા
            </span>
          </p>
        )}
      </div>

      <p className="lx-hint">
        {hideMeaning
          ? "પહેલાં મનમાં અર્થ વિચારો, પછી કાર્ડ પર ટૅપ કરીને જુઓ કે સાચું હતું કે નહીં."
          : speakable
            ? "કોઈ પણ કાર્ડ પર ટૅપ કરો અને અંગ્રેજી સાંભળો. સાથે મોટેથી બોલો."
            : "દરેક કાર્ડમાં અંગ્રેજી, તેનો ઉચ્ચાર અને ગુજરાતી અર્થ છે."}
      </p>

      <ul ref={deck} className={hideMeaning ? "examples hide-meaning" : "examples"}>
        {examples.map((ex, i) => (
          <ExampleCard
            key={i}
            ex={ex}
            index={i}
            interactive={speakable || hideMeaning}
            speakable={speakable}
            playing={playing === i}
            heard={heard.has(i)}
            masked={hideMeaning && !revealed.has(i)}
            onTap={() => tap(i)}
          />
        ))}
      </ul>
    </>
  );
}
