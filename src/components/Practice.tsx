import { useEffect, useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  CheckCircle,
  Fire,
  Microphone,
  Sparkle,
  Target,
  Trophy,
  XCircle,
} from "@phosphor-icons/react";
import {
  answerText,
  isEnglishText,
  type BuildQuestion,
  type ChoiceQuestion,
  type OrderQuestion,
  type Question,
  type SayQuestion,
} from "../content";
import { checkSpeech, type SpeechCheck } from "../speak-check";
import { markMicNoteSeen, micNoteSeen, useListen } from "../use-listen";
import { AutoText, MixedText } from "./MixedText";
import { ListenButton } from "./ListenButton";
import { roleLabel } from "./PatternCard";

type Props = {
  questions: Question[];
  onFinish: () => void;
  // How many questions are answered so far (0..all), for the lesson's step bar.
  onProgress?: (answered: number, total: number) => void;
  // Shown under the result, e.g. the "next lesson" button.
  after?: React.ReactNode;
  // Called once for every answer, so the daily review can remember it.
  onAnswer?: (question: Question, correct: boolean) => void;
  // A small tag above each question (same order as `questions`), e.g. the lesson it came from.
  tags?: string[];
};

const all = (n: number) => Array.from({ length: n }, (_, i) => i);

// One question at a time. She answers, sees right or wrong, then goes on.
export function Practice({ questions, onFinish, onProgress, after, onAnswer, tags }: Props) {
  // Which questions are in this round: all of them, or only the ones she got wrong last time.
  const [round, setRound] = useState<number[]>(() => all(questions.length));
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(0); // longest run of right answers this round

  const isRetry = round.length < questions.length;
  useEffect(() => {
    // A retry of wrong ones keeps the bar full: the lesson was already finished once.
    onProgress?.(isRetry ? questions.length : results.length, questions.length);
  }, [results.length, isRetry, questions.length, onProgress]);

  if (questions.length === 0) return null;

  const restart = (next: number[]) => {
    setRound(next);
    setIndex(0);
    setResult(null);
    setScore(0);
    setResults([]);
    setBest(0);
    setFinished(false);
  };

  if (finished) {
    const total = round.length;
    const perfect = score === total;
    const good = score / total >= 0.7;
    const wrong = round.filter((_, i) => !results[i]);
    return (
      <div className="practice practice-result" role="status">
        {good && <Confetti big={perfect} />}
        <ScoreRing score={score} total={total} perfect={perfect} />
        <p className="result-score">
          {total} માંથી {score} જવાબ સાચા.
        </p>
        <p className="result-text">
          {perfect
            ? "ખૂબ સરસ! બધા જવાબ સાચા."
            : good
              ? "સરસ! થોડા જ બાકી છે. ખોટા સવાલ ફરી કરી જુઓ."
              : "સરસ પ્રયત્ન! ફરી કરશો તો વધુ પાકું થશે."}
        </p>
        {best >= 3 && (
          <p className="result-streak">
            <Fire weight="fill" aria-hidden="true" />
            સળંગ {best} સાચા જવાબ
          </p>
        )}
        {after && <div className="result-after">{after}</div>}
        <div className="result-actions">
          {wrong.length > 0 && (
            <button type="button" className="button button-secondary" onClick={() => restart(wrong)}>
              <Target weight="bold" aria-hidden="true" />
              ખોટા {wrong.length} સવાલ ફરી કરો
            </button>
          )}
          <button type="button" className="button button-secondary" onClick={() => restart(all(questions.length))}>
            <ArrowCounterClockwise weight="bold" className="spin-hover" aria-hidden="true" />
            ફરીથી કરો
          </button>
        </div>
      </div>
    );
  }

  const q = questions[round[index]];
  const answered = result !== null;
  const isLast = index === round.length - 1;
  const correct = answerText(q);
  const correctIsEnglish = isEnglishText(correct);

  const answer = (right: boolean) => {
    if (answered) return;
    onAnswer?.(q, right);
    setResult(right);
    const next = [...results, right];
    setResults(next);
    if (right) setScore((s) => s + 1);
    setBest((b) => Math.max(b, streakAt(next)));
  };
  const streak = streakAt(results);

  const goOn = () => {
    if (isLast) {
      setFinished(true);
      onFinish();
    } else {
      setIndex(index + 1);
      setResult(null);
    }
  };

  return (
    <div className="practice">
      <div className="practice-top">
        <p className="question-count">
          {isRetry && <span className="retry-tag">ખોટા સવાલ ફરી</span>}
          સવાલ {index + 1} / {round.length}
        </p>
        {answered && result && streak >= 2 && (
          <p key={streak} className="streak">
            <Fire weight="fill" aria-hidden="true" />
            {streak} સળંગ સાચા!
          </p>
        )}
        <ol className="dots" aria-hidden="true">
          {round.map((_, i) => (
            <li
              key={i}
              className={
                i < results.length ? (results[i] ? "dot good" : "dot bad") : i === index ? "dot current" : "dot"
              }
            />
          ))}
        </ol>
      </div>

      <div key={`${round.length}-${index}`} className="question-wrap">
        {tags?.[round[index]] && <p className="question-tag">{tags[round[index]]}</p>}
        <p className="question" id={`q-${index}`}>
          <MixedText text={q.questionGu} />
        </p>
        {q.type === "choice" && <ChoiceBody q={q} labelId={`q-${index}`} onAnswer={answer} />}
        {q.type === "order" && <OrderBody q={q} labelId={`q-${index}`} onAnswer={answer} />}
        {q.type === "say" && <SayBody q={q} labelId={`q-${index}`} onAnswer={answer} />}
        {q.type === "build" && <BuildBody q={q} labelId={`q-${index}`} onAnswer={answer} />}
      </div>

      <div aria-live="polite">
        {answered && (
          <div className={result ? "feedback good" : "feedback bad"}>
            <span className="feedback-icon" aria-hidden="true">
              {result ? <CheckCircle weight="fill" /> : <XCircle weight="fill" />}
            </span>
            <div className="feedback-body">
              <p className="feedback-title">
                {result ? (
                  q.type === "say" ? (
                    "સરસ! બરાબર બોલ્યા."
                  ) : (
                    "સરસ! સાચો જવાબ."
                  )
                ) : (
                  <>
                    {q.type === "say" ? "વાંધો નહીં. વાક્ય ફરી સાંભળો:" : "ના, સાચો જવાબ છે:"}{" "}
                    <AutoText text={correct} />
                  </>
                )}
              </p>
              {q.explainGu && (
                <p>
                  <MixedText text={q.explainGu} />
                </p>
              )}
              {correctIsEnglish && <ListenButton text={correct} />}
            </div>
          </div>
        )}
      </div>

      {answered && (
        <button type="button" className="button next-button" onClick={goOn}>
          {isLast ? "પરિણામ જુઓ" : "આગળનો સવાલ"}
          <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

type BodyProps<Q> = { q: Q; labelId: string; onAnswer: (right: boolean) => void };

// Tap one of the options.
function ChoiceBody({ q, labelId, onAnswer }: BodyProps<ChoiceQuestion>) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <div className={answered ? "options answered" : "options"} role="group" aria-labelledby={labelId}>
      {q.options.map((option, i) => {
        let state = "";
        if (answered && i === q.answer) state = "correct";
        else if (answered && i === picked) state = "wrong";
        return (
          <button
            key={i}
            type="button"
            className={`option ${state}`}
            aria-pressed={picked === i}
            disabled={answered && i !== picked && i !== q.answer}
            onClick={() => {
              if (answered) return;
              setPicked(i);
              onAnswer(i === q.answer);
            }}
          >
            <span className="option-mark" aria-hidden="true">
              {state === "correct" && <CheckCircle weight="fill" />}
              {state === "wrong" && <XCircle weight="fill" />}
            </span>
            <span className="option-text">
              <AutoText text={option} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

// A small number generator seeded from the sentence, so the pre-built page and the browser
// mix the tiles the same way (a random mix would differ and make React redraw the page).
function seededRandom(text: string): () => number {
  let seed = 2166136261;
  for (let i = 0; i < text.length; i++) seed = Math.imul(seed ^ text.charCodeAt(i), 16777619);
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Mix the tiles, making sure they don't start out already in the right order.
export function shuffled(words: string[]): number[] {
  const ids = words.map((_, i) => i);
  if (words.length < 2) return ids;
  const random = seededRandom(words.join(" "));
  for (let tries = 0; tries < 10; tries++) {
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    if (ids.map((i) => words[i]).join(" ") !== words.join(" ")) break;
  }
  return ids;
}

// Tap the word tiles in order to build the sentence. Tap a placed word to send it back.
function OrderBody({ q, labelId, onAnswer }: BodyProps<OrderQuestion>) {
  const bank = useMemo(() => shuffled(q.words), [q.words]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);
  const done = checked !== null;
  const full = placed.length === q.words.length;

  const check = () => {
    const right = placed.map((i) => q.words[i]).join(" ") === q.words.join(" ");
    setChecked(right);
    onAnswer(right);
  };

  return (
    <div className="order" role="group" aria-labelledby={labelId}>
      <p className="order-hint">શબ્દો પર ક્રમથી ટૅપ કરો. ભૂલ થાય તો ઉપરના શબ્દ પર ટૅપ કરીને પાછો મોકલો.</p>

      <div
        className={`order-line${done ? (checked ? " correct" : " wrong") : ""}`}
        aria-label="તમારું વાક્ય"
        role="group"
      >
        {placed.length === 0 && <span className="order-empty">અહીં વાક્ય બનશે</span>}
        {placed.map((id, pos) => (
          <button
            key={id}
            type="button"
            lang="en"
            className="tile placed"
            disabled={done}
            onClick={() => setPlaced((p) => p.filter((_, k) => k !== pos))}
          >
            {q.words[id]}
          </button>
        ))}
        {full && <span className="order-end">{q.end ?? "."}</span>}
      </div>

      {!done && (
        <>
          <div className="order-bank" aria-label="શબ્દો" role="group">
            {bank.map((id) => {
              const used = placed.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  lang="en"
                  className={used ? "tile used" : "tile"}
                  disabled={used}
                  aria-hidden={used}
                  tabIndex={used ? -1 : undefined}
                  onClick={() => setPlaced((p) => [...p, id])}
                >
                  {q.words[id]}
                </button>
              );
            })}
          </div>
          <button type="button" className="button check-button" disabled={!full} onClick={check}>
            <CheckCircle weight="bold" aria-hidden="true" />
            જવાબ તપાસો
          </button>
        </>
      )}
    </div>
  );
}

// Fill the labelled boxes. Each box names the part that goes in it (કોણ? શું કરે? …).
// Tap a piece to put it in the next empty box; tap a filled box to take it out.
function BuildBody({ q, labelId, onAnswer }: BodyProps<BuildQuestion>) {
  const texts = useMemo(() => q.parts.map((p) => p.text), [q.parts]);
  const bank = useMemo(() => shuffled(texts), [texts]);
  const [placed, setPlaced] = useState<(number | null)[]>(() => q.parts.map(() => null));
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const done = checked !== null;
  const full = placed.every((p) => p !== null);

  const put = (id: number) => {
    const slot = placed.indexOf(null);
    if (slot === -1) return;
    setPlaced((p) => p.map((x, i) => (i === slot ? id : x)));
  };

  const check = () => {
    // A box is right when it holds the right words (two pieces with the same words are interchangeable).
    const result = placed.map((id, i) => id !== null && texts[id] === texts[i]);
    setChecked(result);
    onAnswer(result.every(Boolean));
  };

  // The first piece in a wrong box, and the box it belongs in.
  const firstWrong = checked ? checked.indexOf(false) : -1;
  const wrongPiece = firstWrong >= 0 ? q.parts[placed[firstWrong]!] : undefined;

  return (
    <div className="build" role="group" aria-labelledby={labelId}>
      <p className="build-hint">દરેક ખાનાની ઉપર લખ્યું છે તેમાં શું આવે. ટુકડા પર ટૅપ કરીને ખાનાં ભરો.</p>

      <ol className="build-slots" aria-label="ખાનાં">
        {q.parts.map((part, i) => {
          const id = placed[i];
          const state = checked ? (checked[i] ? " right" : " wrong") : "";
          return (
            <li key={i} className={`build-slot role-${part.role}${id !== null ? " filled" : ""}${state}`}>
              <span className="build-slot-label">{roleLabel[part.role]}</span>
              {id === null ? (
                <span className="build-slot-body" aria-label={`${roleLabel[part.role]} ખાલી ખાનું`} />
              ) : (
                <button
                  type="button"
                  lang="en"
                  className="build-slot-body"
                  disabled={done}
                  onClick={() => setPlaced((p) => p.map((x, k) => (k === i ? null : x)))}
                >
                  {texts[id]}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {wrongPiece && (
        <p className="build-msg">
          <MixedText
            text={
              // Two boxes can share a label (two verbs in an "if" sentence). Then the label is right, only the place is wrong.
              wrongPiece.role === q.parts[firstWrong].role
                ? `[[${wrongPiece.text}]] "${roleLabel[wrongPiece.role]}" જ છે, પણ આ જગ્યાએ નહીં. વાક્યનો ક્રમ ફરી જુઓ.`
                : `[[${wrongPiece.text}]] "${roleLabel[wrongPiece.role]}" નો જવાબ છે, એટલે તે "${roleLabel[wrongPiece.role]}" વાળા ખાનામાં જાય.`
            }
          />
        </p>
      )}

      {!done && (
        <>
          <div className="order-bank" aria-label="ટુકડા" role="group">
            {bank.map((id) => {
              const used = placed.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  lang="en"
                  className={used ? "tile used" : "tile"}
                  disabled={used}
                  aria-hidden={used}
                  tabIndex={used ? -1 : undefined}
                  onClick={() => put(id)}
                >
                  {texts[id]}
                </button>
              );
            })}
          </div>
          <button type="button" className="button check-button" disabled={!full} onClick={check}>
            <CheckCircle weight="bold" aria-hidden="true" />
            જવાબ તપાસો
          </button>
        </>
      )}
    </div>
  );
}

// After this many tries that didn't pass, she may go on (the answer then counts as wrong).
const SAY_TRIES = 3;

// Say the sentence aloud. The phone listens and shows which words it heard.
// Without speech recognition (or without mic permission) she says it aloud and taps "done".
function SayBody({ q, labelId, onAnswer }: BodyProps<SayQuestion>) {
  const { supported, listen, stop } = useListen();
  const [blocked, setBlocked] = useState(false);
  const [note, setNote] = useState(false);
  const [listening, setListening] = useState(false);
  const [check, setCheck] = useState<SpeechCheck | null>(null);
  const [silent, setSilent] = useState(false);
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);

  const finish = (right: boolean) => {
    setDone(true);
    onAnswer(right);
  };

  const start = async () => {
    if (listening) {
      stop();
      return;
    }
    if (!micNoteSeen()) {
      setNote(true);
      return;
    }
    setListening(true);
    setSilent(false);
    const heard = await listen();
    setListening(false);
    if (heard.kind === "blocked") {
      setBlocked(true);
      return;
    }
    setTries((t) => t + 1);
    if (heard.kind === "nothing") {
      setSilent(true);
      return;
    }
    const result = checkSpeech(q.text, heard.alternatives);
    setCheck(result);
    if (result.pass) finish(true);
  };

  const micLabel = listening ? "સાંભળું છું…" : tries > 0 ? "ફરી બોલો" : "બોલો";

  const target = (
    <div className="say-target">
      <p className="say-en" lang="en">
        {q.text}
      </p>
      {q.translit && <p className="say-translit">{q.translit}</p>}
      <ListenButton text={q.text} />
    </div>
  );

  if (!supported || blocked) {
    return (
      <div className="say-q" role="group" aria-labelledby={labelId}>
        {target}
        {blocked && <p className="say-hint">માઇક ચાલુ ન થયું. કંઈ વાંધો નહીં.</p>}
        <p className="say-hint">મોટેથી બોલો, પછી ✓ દબાવો.</p>
        {!done && (
          <button type="button" className="button check-button" onClick={() => finish(true)}>
            <CheckCircle weight="bold" aria-hidden="true" />
            મેં બોલી લીધું
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="say-q" role="group" aria-labelledby={labelId}>
      {target}

      {note ? (
        <div className="say-note" role="note">
          <p>
            નોંધ: તમે બોલો ત્યારે ફોન તમારો અવાજ લખાણમાં ફેરવવા Google ને મોકલે છે. આ સાઇટ તમારો અવાજ ક્યાંય
            સાચવતી નથી.
          </p>
          <button
            type="button"
            className="button"
            onClick={() => {
              markMicNoteSeen();
              setNote(false);
              void start();
            }}
          >
            <Microphone weight="bold" aria-hidden="true" />
            સમજાયું, હવે બોલું
          </button>
        </div>
      ) : (
        !done && (
          <div className="say-mic-row">
            <button
              type="button"
              className={listening ? "mic listening" : "mic"}
              aria-label={micLabel}
              onClick={() => void start()}
            >
              <Microphone weight="bold" aria-hidden="true" />
            </button>
            <span className="mic-label" aria-hidden="true">
              {micLabel}
            </span>
          </div>
        )
      )}

      <div aria-live="polite">
        {silent && !listening && <p className="say-hint">કંઈ સંભળાયું નહીં. ફોનની નજીક મોટેથી બોલો.</p>}
        {check && !silent && (
          <div className="say-result">
            <p className="say-words" lang="en" aria-label="સંભળાયેલા શબ્દો">
              {check.words.map((w, i) => (
                <span key={i} className={w.heard ? "say-word heard" : "say-word"}>
                  {w.text}
                </span>
              ))}
            </p>
            <p className="say-heard">
              ફોને સાંભળ્યું: <span lang="en">{check.heard}</span>
            </p>
            {!check.pass && !done && <p className="say-hint">ફરી બોલો. રાખોડી શબ્દો બરાબર સંભળાયા નહીં.</p>}
          </div>
        )}
      </div>

      {!done && !listening && tries >= SAY_TRIES && (
        <button type="button" className="button button-secondary say-skip" onClick={() => finish(false)}>
          આગળ વધો
          <ArrowRight weight="bold" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// How many right answers in a row at the end of the list.
function streakAt(results: boolean[]): number {
  let n = 0;
  for (let i = results.length - 1; i >= 0 && results[i]; i--) n++;
  return n;
}

// The score as a ring that fills up, with the number counting up in the middle.
function ScoreRing({ score, total, perfect }: { score: number; total: number; perfect: boolean }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
    if (still || score === 0) {
      setShown(score);
      return;
    }
    let n = 0;
    const t = window.setInterval(() => {
      n++;
      setShown(n);
      if (n >= score) window.clearInterval(t);
    }, Math.max(40, 700 / score));
    return () => window.clearInterval(t);
  }, [score]);

  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className={perfect ? "score-ring perfect" : "score-ring"} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <circle className="score-track" cx="50" cy="50" r={r} />
        <circle
          className="score-fill"
          cx="50"
          cy="50"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / total)}
          style={{ "--c": c } as React.CSSProperties}
        />
      </svg>
      <span className="score-mid">
        {perfect ? <Trophy weight="duotone" /> : <Sparkle weight="duotone" />}
        <span className="score-num">
          {shown}/{total}
        </span>
      </span>
    </div>
  );
}

// A short burst of coloured pieces for a good score. Purely decorative.
const pieces = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.2;
  const dist = 90 + ((i * 37) % 70);
  return {
    "--x": `${Math.cos(angle) * dist}px`,
    "--y": `${Math.sin(angle) * dist - 40}px`,
    "--r": `${(i * 47) % 360}deg`,
    "--d": `${(i % 5) * 40}ms`,
  } as React.CSSProperties;
});

function Confetti({ big }: { big: boolean }) {
  return (
    <span className={big ? "confetti big" : "confetti"} aria-hidden="true">
      {pieces.map((style, i) => (
        <i key={i} style={style} />
      ))}
    </span>
  );
}
