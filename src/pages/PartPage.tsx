import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, CaretRight, CheckCircle, Clock } from "@phosphor-icons/react";
import { getLesson, getPart, parts } from "../content";
import { useCompleted } from "../progress";
import { Breadcrumb } from "../components/Breadcrumb";
import { ProgressBar } from "../components/ProgressBar";
import { PartIcon } from "../components/PartIcon";
import { En } from "../components/MixedText";
import { NotFoundPage } from "./NotFoundPage";

export function PartPage() {
  const { partId } = useParams();
  const part = getPart(partId);
  const completed = useCompleted();
  if (!part) return <NotFoundPage />;

  const done = part.topics.filter((t) => completed.has(t.id)).length;
  const index = parts.indexOf(part);
  const prev = parts[index - 1];
  const next = parts[index + 1];

  return (
    <article data-part={part.number}>
      <Breadcrumb items={[{ label: "ઘર", to: "/" }, { label: `ભાગ ${part.number}` }]} />

      <header className="page-head">
        <span className="part-tile page-head-icon" aria-hidden="true">
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
      </header>
      <p className="lead">{part.introGu}</p>
      <div className="panel">
        <ProgressBar done={done} total={part.topics.length} />
      </div>

      <h2 className="section-title">પાઠ</h2>
      <ol className="topic-list">
        {part.topics.map((topic, i) => {
          const isDone = completed.has(topic.id);
          const ready = Boolean(getLesson(topic.id));
          return (
            <li key={topic.id} className="reveal" style={{ "--i": i } as React.CSSProperties}>
              <Link
                to={`/topic/${topic.id}`}
                className={["topic-row", isDone && "done", !ready && "soon"].filter(Boolean).join(" ")}
              >
                <span className="topic-num" aria-hidden="true">
                  {isDone ? <CheckCircle weight="fill" /> : i + 1}
                </span>
                <span className="topic-text">
                  <span className="topic-title">
                    <span className="visually-hidden">પાઠ {i + 1}: </span>
                    {topic.titleGu}
                  </span>
                  <span className="topic-en">
                    <En>{topic.titleEn}</En>
                  </span>
                </span>
                {isDone ? (
                  <span className="badge badge-done">
                    <CheckCircle weight="bold" aria-hidden="true" />
                    પૂરો
                  </span>
                ) : (
                  !ready && (
                    <span className="badge">
                      <Clock weight="bold" aria-hidden="true" />
                      જલ્દી આવશે
                    </span>
                  )
                )}
                <CaretRight weight="bold" className="topic-go" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ol>

      <nav className="pager" aria-label="બીજા ભાગ">
        {prev ? (
          <Link to={`/part/${prev.id}`} className="button button-secondary">
            <ArrowLeft weight="bold" className="nudge-back" aria-hidden="true" />
            ભાગ {prev.number}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/part/${next.id}`} className="button button-secondary">
            ભાગ {next.number}
            <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
          </Link>
        )}
      </nav>
    </article>
  );
}
