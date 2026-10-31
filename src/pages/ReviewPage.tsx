import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowsClockwise, CalendarCheck, Fire, House, Sparkle } from "@phosphor-icons/react";
import { allTopics, getTopicInfo } from "../content";
import { useCompleted } from "../progress";
import {
  addDays,
  DAILY_SIZE,
  dueCount,
  finishReviewDay,
  questionCatalog,
  recordAnswer,
  streak,
  todaysSet,
  today,
  useReview,
  waitingToday,
  type Entry,
} from "../review";
import { Breadcrumb } from "../components/Breadcrumb";
import { Practice } from "../components/Practice";
import "../review.css";

// Shown under the result of a review set: the streak and what is waiting tomorrow.
function Finished() {
  const review = useReview();
  const day = today();
  const run = streak(review.days, day);
  const tomorrow = dueCount(review.items, addDays(day, 1));
  return (
    <div className="rv-after">
      {run > 0 && (
        <p className="rv-streak">
          <Fire weight="fill" aria-hidden="true" />
          {run} દિવસ સળંગ
        </p>
      )}
      <p className="rv-tomorrow">
        <CalendarCheck weight="duotone" aria-hidden="true" />
        {tomorrow > 0 ? `કાલે ${tomorrow} સવાલ તમારી રાહ જુએ છે.` : "કાલે ફરી મળીએ."}
      </p>
      <Link to="/" className="button button-secondary">
        <House weight="bold" aria-hidden="true" />
        ઘરે જાઓ
      </Link>
    </div>
  );
}

export function ReviewPage() {
  const review = useReview();
  const completed = useCompleted();
  // The set is picked once, when she taps start, so it doesn't change while she answers.
  const [set, setSet] = useState<Entry[] | null>(null);
  const day = today();
  const waiting = waitingToday(review, day);
  const run = streak(review.days, day);
  const tomorrow = dueCount(review.items, addDays(day, 1));
  const nothingYet = completed.size === 0 && Object.keys(review.items).length === 0;
  const first = allTopics[0];

  const start = () => {
    const catalog = questionCatalog();
    const entries = todaysSet(review.items, day, DAILY_SIZE)
      .map((id) => catalog.get(id))
      .filter((e): e is Entry => e !== undefined);
    setSet(entries);
  };

  return (
    <article className="rv">
      <header className="rv-head">
        <Breadcrumb items={[{ label: "ઘર", to: "/" }, { label: "આજનું પુનરાવર્તન" }]} />
        <p className="chip">
          <ArrowsClockwise weight="duotone" aria-hidden="true" />
          રોજ 10 મિનિટ
        </p>
        <h1>આજનું પુનરાવર્તન</h1>
        <p className="rv-lead">જૂના સવાલ ફરી પૂછીએ છીએ, ભૂલી જાઓ તે પહેલાં. ખોટા સવાલ કાલે ફરી આવશે.</p>
        {run > 0 && !set && (
          <p className="rv-streak">
            <Fire weight="fill" aria-hidden="true" />
            {run} દિવસ સળંગ
          </p>
        )}
      </header>

      {set ? (
        set.length > 0 ? (
          <Practice
            key="review"
            questions={set.map((e) => e.question)}
            tags={set.map((e) => `પાઠ: ${getTopicInfo(e.topicId)?.topic.titleGu ?? ""}`)}
            onAnswer={recordAnswer}
            onFinish={finishReviewDay}
            after={<Finished />}
          />
        ) : (
          <p className="note">આજે કોઈ સવાલ બાકી નથી.</p>
        )
      ) : nothingYet ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            <Sparkle weight="duotone" />
          </span>
          <p className="empty-title">હજી પુનરાવર્તન માટે કંઈ નથી.</p>
          <p>પહેલો પાઠ પૂરો કરો. પછી અહીં જૂના સવાલ પાછા આવશે.</p>
          <Link to={`/topic/${first.id}`} className="button button-lg">
            પહેલો પાઠ: {first.titleGu}
            <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
          </Link>
        </div>
      ) : waiting === 0 ? (
        <div className="rv-card rv-rest">
          <span className="rv-icon" aria-hidden="true">
            <CalendarCheck weight="duotone" />
          </span>
          <p className="rv-title">આજનું પુનરાવર્તન પૂરું! કાલે ફરી મળીએ.</p>
          {tomorrow > 0 && <p className="rv-sub">કાલે {tomorrow} સવાલ આવશે.</p>}
          <Link to="/" className="button button-secondary">
            <House weight="bold" aria-hidden="true" />
            ઘરે જાઓ
          </Link>
        </div>
      ) : (
        <div className="rv-card">
          <span className="rv-icon" aria-hidden="true">
            <ArrowsClockwise weight="duotone" />
          </span>
          <p className="rv-count" lang="en">
            {waiting}
          </p>
          <p className="rv-title">સવાલ આજે તમારી રાહ જુએ છે.</p>
          <button type="button" className="button button-lg" onClick={start}>
            શરૂ કરો
            <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
          </button>
        </div>
      )}
    </article>
  );
}
