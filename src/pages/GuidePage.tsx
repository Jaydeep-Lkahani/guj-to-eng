import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Compass,
  Lightbulb,
  ListChecks,
  PencilSimpleLine,
  Shuffle,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { getTopicInfo, guide, type Question } from "../content";
import { Breadcrumb } from "../components/Breadcrumb";
import { En, MixedText } from "../components/MixedText";
import { ListenButton } from "../components/ListenButton";
import { PatternCard, Pieces } from "../components/PatternCard";
import { Practice } from "../components/Practice";
import "../guide.css";

// One page she can open any time she wants to make a sentence:
// pick what she wants to say, and see its pattern, an example and the usual mistake.
// A practice set that opens under its button. Only one is open at a time,
// so the page never shows two quizzes at once.
function PracticeToggle({
  id,
  open,
  setOpen,
  questions,
  label,
}: {
  id: string;
  open: string | null;
  setOpen: (id: string | null) => void;
  questions: Question[];
  label: string;
}) {
  const isOpen = open === id;
  return (
    <div className="gd-practice">
      <button
        type="button"
        className={isOpen ? "button button-secondary gd-practice-btn" : "button gd-practice-btn"}
        aria-expanded={isOpen}
        onClick={() => setOpen(isOpen ? null : id)}
      >
        {isOpen ? <X weight="bold" aria-hidden="true" /> : <PencilSimpleLine weight="bold" aria-hidden="true" />}
        {isOpen ? "પ્રેક્ટિસ બંધ કરો" : `${label} (${questions.length} સવાલ)`}
      </button>
      {isOpen && <Practice key={id} questions={questions} onFinish={() => {}} />}
    </div>
  );
}

function TenseChart({ onPick }: { onPick: (itemId: string) => void }) {
  const chart = guide.tenseChart;
  return (
    <section className="gd-tenses" aria-labelledby="gd-tenses-title">
      <h2 id="gd-tenses-title">
        <Clock weight="duotone" aria-hidden="true" />
        {chart.titleGu}
      </h2>
      <p className="gd-tenses-note">{chart.noteGu}</p>
      <table className="gd-table">
        <thead>
          <tr>
            <td />
            {chart.columns.map((c) => (
              <th key={c.id} scope="col">
                {c.labelGu}
                <small lang="en">{c.en}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((r) => (
            <tr key={r.id}>
              <th scope="row">
                {r.labelGu}
                <small lang="en">{r.en}</small>
              </th>
              {chart.columns.map((c) => {
                const cell = chart.cells.find((x) => x.row === r.id && x.column === c.id);
                if (!cell) return <td key={c.id} />;
                const body = (
                  <>
                    <span className="gd-cell-en" lang="en">
                      {cell.en}
                    </span>
                    <span className="gd-cell-gu">{cell.gu}</span>
                  </>
                );
                return (
                  <td key={c.id}>
                    {cell.itemId ? (
                      <button type="button" className="gd-cell" onClick={() => onPick(cell.itemId!)}>
                        {body}
                      </button>
                    ) : (
                      <div className="gd-cell later">
                        {body}
                        <span className="gd-cell-later">આગળ શીખીશું</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function GuidePage() {
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const jump = (id: string) => {
    setPicked(id);
    const card = document.getElementById(`guide-${id}`);
    if (!card) return;
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
    card.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
    card.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
  };

  return (
    <article className="gd">
      <header className="gd-head">
        <Breadcrumb items={[{ label: "ઘર", to: "/" }, { label: "વાક્ય બનાવવાની ચાવી" }]} />
        <p className="chip">
          <Compass weight="duotone" aria-hidden="true" />
          ગમે ત્યારે જુઓ
        </p>
        <h1>વાક્ય બનાવવાની ચાવી</h1>
        <p className="gd-lead">{guide.introGu}</p>
      </header>

      <PatternCard pattern={guide.basic} />

      <TenseChart onPick={jump} />

      <section className="gd-pick" aria-labelledby="gd-pick-title">
        <h2 id="gd-pick-title">તમારે શું કહેવું છે?</h2>
        <div className="gd-chips">
          {guide.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={picked === item.id ? "gd-chip on" : "gd-chip"}
              onClick={() => jump(item.id)}
            >
              {item.labelGu}
            </button>
          ))}
        </div>
      </section>

      <div className="gd-list">
        {guide.items.map((item) => {
          const lesson = getTopicInfo(item.topicId)?.topic;
          return (
            <section
              key={item.id}
              id={`guide-${item.id}`}
              className={picked === item.id ? "gd-item picked" : "gd-item"}
              aria-labelledby={`guide-${item.id}-title`}
            >
              <h3 id={`guide-${item.id}-title`} tabIndex={-1}>
                {item.labelGu}
              </h3>
              <p className="gd-when">
                <MixedText text={item.whenGu} />
              </p>

              <Pieces parts={item.formula} english />

              <div className="gd-example">
                <p className="gd-en">
                  <En>{item.example.en}</En>
                </p>
                <p className="gd-gu">{item.example.gu}</p>
                <ListenButton text={item.example.en} />
              </div>

              {item.wrong && item.right && (
                <ul className="gd-mistake" aria-label="સામાન્ય ભૂલ">
                  <li className="gd-wrong">
                    <XCircle weight="fill" aria-hidden="true" />
                    <span>
                      <En>{item.wrong}</En> <span className="gd-tag">ખોટું</span>
                    </span>
                  </li>
                  <li className="gd-right">
                    <CheckCircle weight="fill" aria-hidden="true" />
                    <span>
                      <En>{item.right}</En> <span className="gd-tag">સાચું</span>
                    </span>
                  </li>
                </ul>
              )}

              <p className="gd-tip">
                <Lightbulb weight="duotone" aria-hidden="true" />
                <span>
                  <MixedText text={item.tipGu} say />
                </span>
              </p>

              {lesson && (
                <Link to={`/topic/${lesson.id}`} className="gd-lesson">
                  પાઠ જુઓ: {lesson.titleGu}
                  <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
                </Link>
              )}

              {item.practice && item.practice.length > 0 && (
                <PracticeToggle
                  id={item.id}
                  open={open}
                  setOpen={setOpen}
                  questions={item.practice}
                  label="પ્રેક્ટિસ કરો"
                />
              )}
            </section>
          );
        })}
      </div>

      <section className="gd-mixed" aria-labelledby="gd-mixed-title">
        <h2 id="gd-mixed-title">
          <Shuffle weight="duotone" aria-hidden="true" />
          {guide.mixed.titleGu}
        </h2>
        <p className="gd-when">
          <MixedText text={guide.mixed.introGu} />
        </p>
        <PracticeToggle
          id="mixed"
          open={open}
          setOpen={setOpen}
          questions={guide.mixed.questions}
          label="શરૂ કરો"
        />
      </section>

      <section className="gd-checks" aria-labelledby="gd-checks-title">
        <h2 id="gd-checks-title">
          <ListChecks weight="duotone" aria-hidden="true" />
          બોલતાં પહેલાં ચકાસો
        </h2>
        <ol>
          {guide.checksGu.map((c, i) => (
            <li key={i}>
              <MixedText text={c} />
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
