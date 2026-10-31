import { Link } from "react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowsClockwise,
  CaretDown,
  ChatsCircle,
  CheckCircle,
  HandWaving,
  Lightbulb,
  PencilSimpleLine,
  Question,
  Trophy,
} from "@phosphor-icons/react";
import { allTopics, parts } from "../content";
import { useCompleted } from "../progress";
import { today, useReview, waitingToday } from "../review";
import { ProgressBar, ProgressRing } from "../components/ProgressBar";
import { PartIcon } from "../components/PartIcon";
import { En, MixedText } from "../components/MixedText";
import { WordDemo } from "../components/WordDemo";
import { homeFaq, stats } from "../seo";
import "../home.css";

const steps = [
  { icon: Lightbulb, title: "સમજો", text: "દરેક વાત સરળ ગુજરાતીમાં સમજાવી છે." },
  { icon: ChatsCircle, title: "ઉદાહરણ જુઓ", text: "અંગ્રેજી શબ્દ, તેનો ઉચ્ચાર અને અર્થ સાથે." },
  { icon: PencilSimpleLine, title: "પ્રેક્ટિસ કરો", text: "નાના સવાલથી તરત ખબર પડે કે બરાબર છે કે નહીં." },
];

// Moves a soft light under the mouse on the part cards.
function spotlight(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

// Scrolls to the parts list without adding "#parts" to the address.
function toParts(e: React.MouseEvent<HTMLAnchorElement>) {
  const el = document.getElementById("parts");
  if (!el) return;
  e.preventDefault();
  const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
  el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
}

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

export function HomePage() {
  const completed = useCompleted();
  const nextTopic = allTopics.find((t) => !completed.has(t.id));
  const started = completed.size > 0;
  const done = allTopics.filter((t) => completed.has(t.id)).length;
  const continueLabel = nextTopic && `${started ? "આગળ ભણો" : "શરૂ કરો"}: ${nextTopic.titleGu}`;
  const review = useReview();
  const waiting = waitingToday(review, today());
  const hasReview = Object.keys(review.items).length > 0;

  return (
    <article className="home">
      {/* ---------- Hero ---------- */}
      <section className="hx" aria-labelledby="home-title">
        <div className="hx-bg" aria-hidden="true">
          <span className="hx-blob hx-blob-1" />
          <span className="hx-blob hx-blob-2" />
          <span className="hx-blob hx-blob-3" />
          <span className="hx-grid" />
        </div>

        <div className="hx-copy">
          <p className="hx-badge enter" style={d(0)}>
            <HandWaving weight="duotone" className="wave" aria-hidden="true" />
            {started ? "ફરી સ્વાગત છે" : "સ્વાગત છે"}
            <span className="hx-badge-sep" aria-hidden="true" />
            <span className="hx-badge-free">મફત · ખાતું જરૂરી નથી</span>
          </p>

          <h1 id="home-title" className="hx-title enter" style={d(1)}>
            <span className="hx-hello">નમસ્તે!</span>
            <span className="hx-h1-sub">
              <span lang="en">Gujarati to English</span> · ગુજરાતીમાં અંગ્રેજી શીખો
            </span>
          </h1>

          <p className="hx-lead enter" style={d(2)}>
            અહીં તમે ધીમે ધીમે, આરામથી અંગ્રેજી શીખશો. બધું ગુજરાતીમાં સમજાવ્યું છે. ભાગ 1 થી શરૂ કરો અને પાઠ
            એક પછી એક કરો.
          </p>

          <div className="hx-actions enter" style={d(3)}>
            {nextTopic && (
              <Link to={`/topic/${nextTopic.id}`} className="button button-lg hx-cta">
                <span>{continueLabel}</span>
                <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
              </Link>
            )}
            <a href="#parts" className="button button-lg button-secondary hx-ghost" onClick={toParts}>
              બધા ભાગ જુઓ
              <ArrowDown weight="bold" className="hx-ghost-arrow" aria-hidden="true" />
            </a>
          </div>

          <ul className="hx-stats enter" style={d(4)} aria-label="આ સાઇટમાં શું છે">
            <li>
              <strong lang="en">{stats.lessons}</strong>
              <span>પાઠ</span>
            </li>
            <li>
              <strong lang="en">{stats.examples}+</strong>
              <span>ઉદાહરણ</span>
            </li>
            <li>
              <strong lang="en">{stats.questions}</strong>
              <span>પ્રેક્ટિસ સવાલ</span>
            </li>
          </ul>
        </div>

        <div className="hx-visual enter" style={d(2)}>
          <WordDemo />

          <div className="hx-float hx-progress">
            <ProgressRing done={done} total={allTopics.length} />
            <span className="hx-progress-text">
              <span className="hx-progress-title">તમારી પ્રગતિ</span>
              <span>પાઠ પૂરા</span>
            </span>
          </div>

          <div className="hx-float hx-chip" aria-hidden="true">
            <CheckCircle weight="fill" />
            સરસ! સાચો જવાબ.
          </div>
        </div>
      </section>

      {/* ---------- Daily review (only once she has questions to review) ---------- */}
      {hasReview && (
        <section className="hv" aria-labelledby="review-title">
          <span className="hv-icon" aria-hidden="true">
            <ArrowsClockwise weight="duotone" />
          </span>
          <div className="hv-text">
            <h2 id="review-title" className="hv-title">
              આજનું પુનરાવર્તન
            </h2>
            <p>{waiting > 0 ? `${waiting} સવાલ તમારી રાહ જુએ છે.` : "આજનું પુનરાવર્તન પૂરું! કાલે ફરી મળીએ."}</p>
          </div>
          {waiting > 0 && (
            <Link to="/review" className="button hv-button">
              શરૂ કરો
              <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
            </Link>
          )}
        </section>
      )}

      {/* ---------- How a lesson works ---------- */}
      <section className="hs" aria-labelledby="steps-title">
        <header className="sec-head sr">
          <p className="sec-eyebrow">કેવી રીતે શીખશો</p>
          <h2 id="steps-title" className="sec-title">
            દરેક પાઠ ત્રણ સરળ પગલાંમાં
          </h2>
        </header>
        <ol className="steps">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="step sr" style={d(i)}>
              <span className="step-top">
                <span className="step-icon" aria-hidden="true">
                  <Icon weight="duotone" />
                </span>
                <span className="step-num" aria-hidden="true">
                  {i + 1}
                </span>
              </span>
              <h3 className="step-title">{title}</h3>
              <p className="step-text">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- The three parts ---------- */}
      <section id="parts" className="hp" aria-labelledby="parts-title">
        <header className="sec-head sr">
          <p className="sec-eyebrow">તમારો રસ્તો</p>
          <h2 id="parts-title" className="sec-title">
            ત્રણ ભાગ
          </h2>
          <p className="sec-sub">શરૂઆતના અક્ષરોથી લઈને રોજની વાતચીત સુધી, એક એક પગલું.</p>
        </header>
        <ul className="pc-list">
          {parts.map((part, i) => {
            const partDone = part.topics.filter((t) => completed.has(t.id)).length;
            const finished = partDone === part.topics.length;
            return (
              <li key={part.id} className="sr" style={d(i)}>
                <Link to={`/part/${part.id}`} className="pc" data-part={part.number} onPointerMove={spotlight}>
                  <span className="pc-glow" aria-hidden="true" />
                  <span className="pc-num" aria-hidden="true">
                    0{part.number}
                  </span>
                  <span className="pc-top">
                    <span className="part-tile pc-icon" aria-hidden="true">
                      <PartIcon number={part.number} />
                    </span>
                    <span className="pc-label">ભાગ {part.number}</span>
                    {partDone > 0 && (
                      <span className={finished ? "pc-pill done" : "pc-pill"}>
                        {finished ? (
                          <>
                            <Trophy weight="fill" aria-hidden="true" /> પૂરો
                          </>
                        ) : (
                          "ચાલુ છે"
                        )}
                      </span>
                    )}
                  </span>
                  <span className="pc-title">{part.titleGu}</span>
                  <span className="pc-sub">
                    <En>{part.titleEn}</En> · {part.topics.length} પાઠ
                  </span>
                  <span className="pc-text">{part.introGu}</span>
                  <span className="pc-bottom">
                    <ProgressBar done={partDone} total={part.topics.length} />
                    <span className="pc-go" aria-hidden="true">
                      <ArrowRight weight="bold" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------- Questions ---------- */}
      <section className="hf" aria-labelledby="faq-title">
        <header className="sec-head sr">
          <p className="sec-eyebrow">સવાલ-જવાબ</p>
          <h2 id="faq-title" className="sec-title">
            વારંવાર પૂછાતા સવાલ
          </h2>
          <p className="sec-sub">શરૂ કરતાં પહેલાં લોકો આ પૂછે છે.</p>
        </header>
        <div className="faq-list">
          {homeFaq.map((item, i) => (
            <details key={item.q} className="faq-item sr" style={d(i)}>
              <summary>
                <span className="faq-icon" aria-hidden="true">
                  <Question weight="duotone" />
                </span>
                <span className="faq-q">{item.q}</span>
                <CaretDown weight="bold" className="faq-caret" aria-hidden="true" />
              </summary>
              <div className="faq-answer">
                <p>
                  <MixedText text={item.a} />
                </p>
                {item.link && (
                  <Link to={item.link.to} className="faq-link">
                    {item.link.label}
                    <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Last nudge ---------- */}
      {nextTopic && (
        <section className="hc sr" aria-labelledby="cta-title">
          <span className="hc-shine" aria-hidden="true" />
          <div className="hc-text">
            <h2 id="cta-title">રોજ થોડું, ધીમે ધીમે.</h2>
            <p>રોજ એક પાઠ પૂરતો છે. ભૂલ થાય તો ચિંતા નહીં, એ પણ શીખવાનો ભાગ છે.</p>
          </div>
          <Link to={`/topic/${nextTopic.id}`} className="button button-lg hc-button">
            <span>{continueLabel}</span>
            <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
          </Link>
        </section>
      )}
    </article>
  );
}
