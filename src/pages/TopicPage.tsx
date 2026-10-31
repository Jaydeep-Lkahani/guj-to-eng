import { useCallback, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowRight,
  ChatsCircle,
  CheckCircle,
  Clock,
  Info,
  Lightbulb,
  PencilSimpleLine,
  Timer,
} from "@phosphor-icons/react";
import { getLesson, getTopicInfo, lessonStats } from "../content";
import { markComplete, useCompleted } from "../progress";
import { recordAnswer } from "../review";
import { useCanSpeak } from "../speech";
import { Breadcrumb } from "../components/Breadcrumb";
import { En } from "../components/MixedText";
import { ExplainList } from "../components/ExplainList";
import { ExampleDeck } from "../components/ExampleDeck";
import { LessonSteps } from "../components/LessonSteps";
import { Practice } from "../components/Practice";
import { PartIcon } from "../components/PartIcon";
import { UpNext } from "../components/UpNext";
import { NotFoundPage } from "./NotFoundPage";
import "../lesson.css";

export function TopicPage() {
  const { topicId } = useParams();
  const info = getTopicInfo(topicId);
  const completed = useCompleted();
  const [ideasRead, setIdeasRead] = useState(0);
  const [answered, setAnswered] = useState(0);
  const onSeen = useCallback((n: number) => setIdeasRead(n), []);
  const onProgress = useCallback((n: number) => setAnswered(n), []);
  const canSpeak = useCanSpeak();
  if (!info) return <NotFoundPage />;

  const { topic, part, number, prev, next } = info;
  const lesson = getLesson(topic.id);
  const stats = lessonStats(topic.id);
  const isDone = completed.has(topic.id);

  return (
    <article className="lx" data-part={part.number}>
      {/* ---------- Top of the lesson ---------- */}
      <header className="lx-hero">
        <div className="lx-hero-bg" aria-hidden="true">
          <span className="lx-blob lx-blob-1" />
          <span className="lx-blob lx-blob-2" />
          <span className="lx-grid" />
        </div>

        <Breadcrumb
          items={[
            { label: "ઘર", to: "/" },
            { label: `ભાગ ${part.number}`, to: `/part/${part.id}` },
            { label: `પાઠ ${number}` },
          ]}
        />

        <div className="lx-hero-row">
          <p className="chip">
            <PartIcon number={part.number} />
            ભાગ {part.number} · પાઠ {number} / {part.topics.length}
          </p>
          {isDone && (
            <p className="lx-done-pill">
              <CheckCircle weight="fill" aria-hidden="true" />
              <span>
                આ પાઠ પૂરો થઈ ગયો છે.<span className="lx-done-more"> ફરી વાંચવો હોય તો વાંચો.</span>
              </span>
            </p>
          )}
        </div>

        <h1 className="lx-title">{topic.titleGu}</h1>
        <p className="lx-subtitle">
          <En>{topic.titleEn}</En>
        </p>

        {stats && (
          <ul className="lx-meta" aria-label="આ પાઠમાં">
            <li>
              <Lightbulb weight="duotone" aria-hidden="true" />
              <strong>{stats.ideas}</strong> વાત
            </li>
            <li>
              <ChatsCircle weight="duotone" aria-hidden="true" />
              <strong>{stats.examples}</strong> ઉદાહરણ
            </li>
            {stats.questions > 0 && (
              <li>
                <PencilSimpleLine weight="duotone" aria-hidden="true" />
                <strong>{stats.questions}</strong> સવાલ
              </li>
            )}
            <li>
              <Timer weight="duotone" aria-hidden="true" />
              <strong>~{stats.minutes}</strong> મિનિટ
            </li>
          </ul>
        )}

        {/* Where this lesson sits in the part. Each mark is a lesson; done ones are filled. */}
        <div className="lx-track" aria-hidden="true">
          {part.topics.map((t, i) => (
            <Link
              key={t.id}
              to={`/topic/${t.id}`}
              tabIndex={-1}
              title={`પાઠ ${i + 1}: ${t.titleGu}`}
              className={[
                "lx-track-mark",
                completed.has(t.id) && "done",
                t.id === topic.id && "here",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>
      </header>

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
          <LessonSteps
            explainProgress={lesson.explanationGu.length ? ideasRead / lesson.explanationGu.length : 1}
            practiceProgress={lesson.practice.length ? answered / lesson.practice.length : 1}
            hasPractice={lesson.practice.length > 0}
            lessonDone={isDone}
            next={next}
          />

          {lesson.placeholder && (
            <p className="note">
              <Info weight="duotone" aria-hidden="true" />
              <span>આ નમૂનાનો પાઠ છે. સાચો પાઠ જલ્દી આવશે.</span>
            </p>
          )}

          <section id="lx-explain" className="lesson-section" aria-labelledby="explain">
            <div className="lx-sec-head">
              <h2 id="explain" className="section-head">
                <span className="section-icon" aria-hidden="true">
                  <Lightbulb weight="duotone" />
                </span>
                સમજીએ
              </h2>
              <p className="lx-count">
                <span className="lx-count-num">{ideasRead}</span>/{lesson.explanationGu.length} વાંચ્યું
              </p>
            </div>
            {canSpeak && <p className="lx-hint">વાદળી અંગ્રેજી શબ્દ પર ટૅપ કરશો તો તે બોલીને સંભળાવશે.</p>}
            <ExplainList paras={lesson.explanationGu} onSeen={onSeen} />
          </section>

          <section id="lx-examples" className="lesson-section" aria-labelledby="examples">
            <div className="lx-sec-head">
              <h2 id="examples" className="section-head">
                <span className="section-icon" aria-hidden="true">
                  <ChatsCircle weight="duotone" />
                </span>
                ઉદાહરણ
              </h2>
            </div>
            <ExampleDeck examples={lesson.examples} />
          </section>

          {lesson.practice.length > 0 && (
            <section id="lx-practice" className="lesson-section" aria-labelledby="practice">
              <div className="lx-sec-head">
                <h2 id="practice" className="section-head">
                  <span className="section-icon" aria-hidden="true">
                    <PencilSimpleLine weight="duotone" />
                  </span>
                  ચાલો, પ્રેક્ટિસ કરીએ
                </h2>
              </div>
              <Practice
                key={topic.id}
                questions={lesson.practice}
                onFinish={() => markComplete(topic.id)}
                onProgress={onProgress}
                onAnswer={recordAnswer}
                after={
                  next && (
                    <Link to={`/topic/${next.id}`} className="button button-lg result-next">
                      આગળનો પાઠ: {next.titleGu}
                      <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
                    </Link>
                  )
                }
              />
            </section>
          )}
        </>
      )}

      <UpNext part={part} prev={prev} next={next} />
    </article>
  );
}
