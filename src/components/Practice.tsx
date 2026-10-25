import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CheckCircle, Sparkle, Trophy, XCircle } from "@phosphor-icons/react";
import type { Question } from "../content";
import { AutoText, MixedText } from "./MixedText";

type Props = {
  questions: Question[];
  onFinish: () => void;
};

// One question at a time. She taps an answer, sees right or wrong, then goes on.
export function Practice({ questions, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
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
            setPicked(null);
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
  const answered = picked !== null;
  const isLast = index === questions.length - 1;
  const right = picked === q.answer;

  const pick = (i: number) => {
    if (answered) return;
    setPicked(i);
    setResults((r) => [...r, i === q.answer]);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const goOn = () => {
    if (isLast) {
      setFinished(true);
      onFinish();
    } else {
      setIndex(index + 1);
      setPicked(null);
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
        <div className={answered ? "options answered" : "options"} role="group" aria-labelledby={`q-${index}`}>
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
                onClick={() => pick(i)}
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
      </div>

      <div aria-live="polite">
        {answered && (
          <div className={right ? "feedback good" : "feedback bad"}>
            <span className="feedback-icon" aria-hidden="true">
              {right ? <CheckCircle weight="fill" /> : <XCircle weight="fill" />}
            </span>
            <div>
              <p className="feedback-title">
                {right ? (
                  "સરસ! સાચો જવાબ."
                ) : (
                  <>
                    ના, સાચો જવાબ છે: <AutoText text={q.options[q.answer]} />
                  </>
                )}
              </p>
              {q.explainGu && (
                <p>
                  <MixedText text={q.explainGu} />
                </p>
              )}
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
