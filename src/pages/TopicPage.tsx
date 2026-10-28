import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  ChatsCircle,
  CheckCircle,
  Clock,
  Info,
  Lightbulb,
  PencilSimpleLine,
} from "@phosphor-icons/react";
import { getLesson, getTopicInfo } from "../content";
import { markComplete, useCompleted } from "../progress";
import { Breadcrumb } from "../components/Breadcrumb";
import { En, MixedText } from "../components/MixedText";
import { ExampleCard } from "../components/ExampleCard";
import { Practice } from "../components/Practice";
import { PartIcon } from "../components/PartIcon";
import { NotFoundPage } from "./NotFoundPage";

export function TopicPage() {
  const { topicId } = useParams();
  const info = getTopicInfo(topicId);
  const completed = useCompleted();
  if (!info) return <NotFoundPage />;

  const { topic, part, number, prev, next } = info;
  const lesson = getLesson(topic.id);
  const isDone = completed.has(topic.id);

  return (
    <article data-part={part.number}>
      <Breadcrumb
        items={[
          { label: "ઘર", to: "/" },
          { label: `ભાગ ${part.number}`, to: `/part/${part.id}` },
          { label: `પાઠ ${number}` },
        ]}
      />
      <p className="chip">
        <PartIcon number={part.number} />
        ભાગ {part.number} · પાઠ {number} / {part.topics.length}
      </p>
      <h1>{topic.titleGu}</h1>
      <p className="subtitle">
        <En>{topic.titleEn}</En>
      </p>

      {isDone && (
        <p className="done-banner">
          <CheckCircle weight="fill" aria-hidden="true" />
          <span>આ પાઠ પૂરો થઈ ગયો છે. ફરી વાંચવો હોય તો વાંચો.</span>
        </p>
      )}

      {!lesson ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            <Clock weight="duotone" />
          </span>
          <p className="empty-title">આ પાઠ હજી તૈયાર થાય છે. જલ્દી આવશે.</p>
          <p>ત્યાં સુધી આગળના પાઠ ફરી જોઈ શકો છો.</p>
        </div>
      ) : (
        <>
          {lesson.placeholder && (
            <p className="note">
              <Info weight="duotone" aria-hidden="true" />
              <span>આ નમૂનાનો પાઠ છે. સાચો પાઠ જલ્દી આવશે.</span>
            </p>
          )}

          <section className="lesson-section" aria-labelledby="explain">
            <h2 id="explain" className="section-head">
              <span className="section-icon" aria-hidden="true">
                <Lightbulb weight="duotone" />
              </span>
              સમજીએ
            </h2>
            <div className="prose">
              {lesson.explanationGu.map((para, i) => (
                <p key={i}>
                  <MixedText text={para} />
                </p>
              ))}
            </div>
          </section>

          <section className="lesson-section" aria-labelledby="examples">
            <h2 id="examples" className="section-head">
              <span className="section-icon" aria-hidden="true">
                <ChatsCircle weight="duotone" />
              </span>
              ઉદાહરણ
            </h2>
            <ul className="examples">
              {lesson.examples.map((ex, i) => (
                <ExampleCard key={i} ex={ex} />
              ))}
            </ul>
          </section>

          {lesson.practice.length > 0 && (
            <section className="lesson-section" aria-labelledby="practice">
              <h2 id="practice" className="section-head">
                <span className="section-icon" aria-hidden="true">
                  <PencilSimpleLine weight="duotone" />
                </span>
                ચાલો, પ્રેક્ટિસ કરીએ
              </h2>
              <Practice key={topic.id} questions={lesson.practice} onFinish={() => markComplete(topic.id)} />
            </section>
          )}
        </>
      )}

      <nav className="pager" aria-label="બીજા પાઠ">
        {prev ? (
          <Link to={`/topic/${prev.id}`} className="button button-secondary">
            <ArrowLeft weight="bold" className="nudge-back" aria-hidden="true" />
            પાછલો પાઠ
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/topic/${next.id}`} className="button">
            આગળનો પાઠ
            <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
          </Link>
        )}
      </nav>
    </article>
  );
}
