import { useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  CheckCircle,
  Sparkle,
  Trophy,
  XCircle,
} from "@phosphor-icons/react";
import { answerText, isEnglishText, type ChoiceQuestion, type OrderQuestion, type Question } from "../content";
import { AutoText, MixedText } from "./MixedText";
import { ListenButton } from "./ListenButton";

type Props = {
  questions: Question[];
  onFinish: () => void;
};

// One question at a time. She answers, sees right or wrong, then goes on.
export function Practice({ questions, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return null;

  if (finished) {
    const perfect = score === questions.length;
    return (
      <div className="practice practice-result" role="status">
        <span className={perfect ? "result-badge perfect" : "result-badge"} aria-hidden="true">
          {perfect ? <Trophy weight="duotone" /> : <Sparkle weight="duotone" />}
        </span>
        <p className="result-score">
          {questions.length} માંથી {score} જવાબ સાચા.
        </p>
        <p className="result-text">
          {perfect ? "ખૂબ સરસ! બધા જવાબ સાચા." : "સરસ પ્રયત્ન! ફરી કરશો તો વધુ પાકું થશે."}
        </p>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => {
            setIndex(0);
            setResult(null);
            setScore(0);
            setResults([]);
            setFinished(false);
          }}
        >
          <ArrowCounterClockwise weight="bold" className="spin-hover" aria-hidden="true" />
          ફરીથી કરો
        </button>
      </div>
    );
  }

  const q = questions[index];
  const answered = result !== null;
  const isLast = index === questions.length - 1;
  const correct = answerText(q);
  const correctIsEnglish = isEnglishText(correct);

  const answer = (right: boolean) => {
    if (answered) return;
    setResult(right);
    setResults((r) => [...r, right]);
    if (right) setScore((s) => s + 1);
  };

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
          સવાલ {index + 1} / {questions.length}
        </p>
        <ol className="dots" aria-hidden="true">
          {questions.map((_, i) => (
            <li
              key={i}
              className={
                i < results.length ? (results[i] ? "dot good" : "dot bad") : i === index ? "dot current" : "dot"
              }
            />
          ))}
        </ol>
      </div>

      <div key={index} className="question-wrap">
        <p className="question" id={`q-${index}`}>
          <MixedText text={q.questionGu} />
        </p>
        {q.type === "choice" ? (
          <ChoiceBody q={q} labelId={`q-${index}`} onAnswer={answer} />
        ) : (
          <OrderBody q={q} labelId={`q-${index}`} onAnswer={answer} />
        )}
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
                  "સરસ! સાચો જવાબ."
                ) : (
                  <>
                    ના, સાચો જવાબ છે: <AutoText text={correct} />
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
