import { Link, useParams } from "react-router";
import { ArrowRight, CaretRight, ChatsCircle, CheckCircle, Clock, PencilSimpleLine, Timer } from "@phosphor-icons/react";
import { getPart, lessonStats, parts } from "../content";
import { useCompleted } from "../progress";
import { Breadcrumb } from "../components/Breadcrumb";
import { ProgressRing } from "../components/ProgressBar";
import { PartIcon } from "../components/PartIcon";
import { En } from "../components/MixedText";
import { spotlight } from "../components/ExampleCard";
import { NotFoundPage } from "./NotFoundPage";
import "../lesson.css";

export function PartPage() {
  const { partId } = useParams();
  const part = getPart(partId);
  const completed = useCompleted();
  if (!part) return <NotFoundPage />;

  const done = part.topics.filter((t) => completed.has(t.id)).length;
  const nextIndex = part.topics.findIndex((t) => !completed.has(t.id) && lessonStats(t.id));
  const nextTopic = part.topics[nextIndex];

  // Totals for this part.
  const totals = part.topics.reduce(
    (sum, t) => {
      const s = lessonStats(t.id);
      return s
        ? { examples: sum.examples + s.examples, questions: sum.questions + s.questions, minutes: sum.minutes + s.minutes }
        : sum;
    },
    { examples: 0, questions: 0, minutes: 0 },
  );
  const hours = Math.round(totals.minutes / 30) / 2;

  const startLabel = !nextTopic
    ? "ફરી પાઠ 1 થી જુઓ"
    : done === 0
      ? "પાઠ 1 થી શરૂ કરો"
      : `પાઠ ${nextIndex + 1} થી આગળ ભણો`;
  const startTo = `/topic/${(nextTopic ?? part.topics[0]).id}`;

  return (
    <article className="px" data-part={part.number}>
      <header className="px-hero">
        <div className="lx-hero-bg" aria-hidden="true">
          <span className="lx-blob lx-blob-1" />
          <span className="lx-blob lx-blob-2" />
          <span className="lx-grid" />
        </div>

        <Breadcrumb items={[{ label: "ઘર", to: "/" }, { label: `ભાગ ${part.number}` }]} />

        <div className="px-head">
          <div>
            <div className="px-title-row">
              <span className="px-icon" aria-hidden="true">
                <PartIcon number={part.number} />
              </span>
              <div>
                <p className="eyebrow">
                  ભાગ {part.number} · {part.topics.length} પાઠ
                </p>
                <h1>
                  ભાગ {part.number}: {part.titleGu}
                </h1>
                <p className="subtitle">
                  <En>{part.titleEn}</En>
                </p>
              </div>
            </div>
            <p className="px-lead">{part.introGu}</p>
          </div>

          <div className="px-card">
            <ProgressRing done={done} total={part.topics.length} />
            <ul className="px-stats">
              <li>
                <strong>{totals.examples}</strong> ઉદાહરણ
              </li>
              <li>
                <strong>{totals.questions}</strong> સવાલ
              </li>
              <li>
                <strong>~{hours}</strong> કલાક
              </li>
            </ul>
            <Link to={startTo} className="button">
              {startLabel}
              <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <div className="px-section-head">
        <h2>પાઠ</h2>
        <p className="px-legend" aria-hidden="true">
          <span>
            <i /> પૂરો
          </span>
          <span>
            <i className="next" /> હવે આ
          </span>
        </p>
      </div>

      <ol className="px-path">
        {part.topics.map((topic, i) => {
          const isDone = completed.has(topic.id);
          const stats = lessonStats(topic.id);
          const isNext = i === nextIndex && done > 0;
          return (
            <li
              key={topic.id}
              className={["px-step", isDone && "done", isNext && "next"].filter(Boolean).join(" ")}
            >
              <span className="px-node" aria-hidden="true">
                {isDone ? <CheckCircle weight="bold" /> : i + 1}
              </span>
              <Link to={`/topic/${topic.id}`} className="px-link" onPointerMove={spotlight}>
                <span className="px-text">
                  <span className="px-name">
                    <span className="visually-hidden">પાઠ {i + 1}: </span>
                    {topic.titleGu}
                  </span>
                  <span className="px-en">
                    <En>{topic.titleEn}</En>
                  </span>
                  {stats && (
                    <span className="px-tags">
                      <span>
                        <ChatsCircle weight="bold" aria-hidden="true" />
                        {stats.examples} ઉદાહરણ
                      </span>
                      <span>
                        <PencilSimpleLine weight="bold" aria-hidden="true" />
                        {stats.questions} સવાલ
                      </span>
                      <span>
                        <Timer weight="bold" aria-hidden="true" />~{stats.minutes} મિનિટ
                      </span>
                    </span>
                  )}
                </span>
                <span className="px-side">
                  {isDone ? (
                    <span className="badge badge-done">
                      <CheckCircle weight="bold" aria-hidden="true" />
                      પૂરો
                    </span>
                  ) : isNext ? (
                    <span className="badge badge-next">અહીંથી આગળ</span>
                  ) : (
                    !stats && (
                      <span className="badge">
                        <Clock weight="bold" aria-hidden="true" />
                        જલ્દી આવશે
                      </span>
                    )
                  )}
                  <CaretRight weight="bold" className="px-go" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="px-section-head">
        <h2>બીજા ભાગ</h2>
      </div>
      <ul className="px-others">
        {parts
          .filter((p) => p.id !== part.id)
          .map((p) => {
            const pDone = p.topics.filter((t) => completed.has(t.id)).length;
            return (
              <li key={p.id} data-part={p.number}>
                <Link to={`/part/${p.id}`} className="px-other">
                  <span className="part-tile" aria-hidden="true">
                    <PartIcon number={p.number} />
                  </span>
                  <span className="px-other-text">
                    <span className="px-other-title">
                      ભાગ {p.number}: {p.titleGu}
                    </span>
                    <span className="px-other-sub">
                      {p.topics.length} માંથી {pDone} પાઠ પૂરા
                    </span>
                    <span className="px-mini" aria-hidden="true">
                      <span style={{ width: `${Math.round((pDone / p.topics.length) * 100)}%` }} />
                    </span>
                  </span>
                  <CaretRight weight="bold" className="px-go" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
      </ul>
    </article>
  );
}
