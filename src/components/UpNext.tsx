import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Clock, ChatsCircle, Flag, House } from "@phosphor-icons/react";
import { getTopicInfo, lessonStats, type Part, type TopicMeta } from "../content";
import { useCompleted } from "../progress";
import { En } from "./MixedText";
import { PartIcon } from "./PartIcon";
import { spotlight } from "./ExampleCard";

// The end of a lesson: a big card for the next lesson, a small link back,
// and how far she has got in this part.
export function UpNext({ part, prev, next }: { part: Part; prev?: TopicMeta; next?: TopicMeta }) {
  const completed = useCompleted();
  const done = part.topics.filter((t) => completed.has(t.id)).length;
  const pct = Math.round((done / part.topics.length) * 100);
  const nextInfo = next && getTopicInfo(next.id);
  const nextStats = next && lessonStats(next.id);
  const newPart = nextInfo && nextInfo.part.id !== part.id;

  return (
    <section className="lx-end" aria-labelledby="up-next">
      <h2 id="up-next" className="visually-hidden">
        હવે આગળ
      </h2>

      {next && nextInfo ? (
        <Link
          to={`/topic/${next.id}`}
          className="lx-next"
          data-part={nextInfo.part.number}
          onPointerMove={spotlight}
        >
          <span className="lx-next-glow" aria-hidden="true" />
          <span className="lx-next-eyebrow">
            <PartIcon number={nextInfo.part.number} />
            {newPart ? `નવો ભાગ ${nextInfo.part.number} શરૂ કરો` : "આગળનો પાઠ"}
            <span className="lx-next-num">· પાઠ {nextInfo.number}</span>
          </span>
          <span className="lx-next-title">{next.titleGu}</span>
          <span className="lx-next-en">
            <En>{next.titleEn}</En>
          </span>
          {nextStats && (
            <span className="lx-next-meta">
              <span>
                <Clock weight="bold" aria-hidden="true" />~{nextStats.minutes} મિનિટ
              </span>
              <span>
                <ChatsCircle weight="bold" aria-hidden="true" />
                {nextStats.examples} ઉદાહરણ
              </span>
            </span>
          )}
          <span className="lx-next-go" aria-hidden="true">
            <ArrowRight weight="bold" />
          </span>
        </Link>
      ) : (
        <Link to="/" className="lx-next lx-next-finish" onPointerMove={spotlight}>
          <span className="lx-next-glow" aria-hidden="true" />
          <span className="lx-next-eyebrow">
            <Flag weight="duotone" aria-hidden="true" />
            છેલ્લો પાઠ
          </span>
          <span className="lx-next-title">અભિનંદન! આ છેલ્લો પાઠ હતો.</span>
          <span className="lx-next-en">બાકી રહેલા પાઠ ઘરેથી ફરી ખોલો.</span>
          <span className="lx-next-go" aria-hidden="true">
            <House weight="bold" />
          </span>
        </Link>
      )}

      <div className="lx-end-row">
        {prev ? (
          <Link to={`/topic/${prev.id}`} className="lx-prev">
            <ArrowLeft weight="bold" className="nudge-back" aria-hidden="true" />
            <span>
              <span className="lx-prev-label">પાછલો પાઠ</span>
              <span className="lx-prev-title">{prev.titleGu}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}

        <Link to={`/part/${part.id}`} className="lx-partprog">
          <span className="lx-partprog-top">
            <span>
              ભાગ {part.number}: {part.titleGu}
            </span>
            <strong>
              {done}/{part.topics.length}
            </strong>
          </span>
          <span className="lx-partprog-track" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </span>
          <span className="lx-partprog-sub">બધા પાઠ જુઓ</span>
        </Link>
      </div>
    </section>
  );
}
