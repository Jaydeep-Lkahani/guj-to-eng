import { Link } from "react-router";
import {
  ArrowRight,
  CaretDown,
  ChatsCircle,
  HandWaving,
  Lightbulb,
  PencilSimpleLine,
  Question,
} from "@phosphor-icons/react";
import { allTopics, parts } from "../content";
import { useCompleted } from "../progress";
import { ProgressBar, ProgressRing } from "../components/ProgressBar";
import { PartIcon } from "../components/PartIcon";
import { En, MixedText } from "../components/MixedText";
import { homeFaq } from "../seo";

const steps = [
  { icon: Lightbulb, title: "સમજો", text: "દરેક વાત સરળ ગુજરાતીમાં સમજાવી છે." },
  { icon: ChatsCircle, title: "ઉદાહરણ જુઓ", text: "અંગ્રેજી શબ્દ, તેનો ઉચ્ચાર અને અર્થ સાથે." },
  { icon: PencilSimpleLine, title: "પ્રેક્ટિસ કરો", text: "નાના સવાલથી તરત ખબર પડે કે બરાબર છે કે નહીં." },
];

export function HomePage() {
  const completed = useCompleted();
  const nextTopic = allTopics.find((t) => !completed.has(t.id));
  const started = completed.size > 0;
  const done = allTopics.filter((t) => completed.has(t.id)).length;

  return (
    <article className="home">
      <section className="hero">
        <div className="hero-text">
          <p className="hero-hello">
            <HandWaving weight="duotone" className="wave" aria-hidden="true" />
            {started ? "ફરી સ્વાગત છે" : "સ્વાગત છે"}
          </p>
          <h1>
            નમસ્તે!
            <span className="hero-h1-sub">
              <span lang="en">Gujarati to English</span> · ગુજરાતીમાં અંગ્રેજી શીખો
            </span>
          </h1>
          <p className="lead">અહીં તમે ધીમે ધીમે, આરામથી અંગ્રેજી શીખશો. બધું ગુજરાતીમાં સમજાવ્યું છે.</p>
          <p className="hero-sub">
            ભાગ 1 થી શરૂ કરો અને પાઠ એક પછી એક કરો. દરેક પાઠ આગળના પાઠ પર બને છે.
          </p>
          {nextTopic && (
            <Link to={`/topic/${nextTopic.id}`} className="button button-lg continue">
              <span>
                {started ? "આગળ ભણો" : "શરૂ કરો"}: {nextTopic.titleGu}
              </span>
              <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
            </Link>
          )}
        </div>
        <div className="hero-progress">
          <ProgressRing done={done} total={allTopics.length} />
          <p className="hero-progress-text">પાઠ પૂરા</p>
        </div>
      </section>

      <ul className="how" aria-label="દરેક પાઠમાં શું છે">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="how-item reveal" style={{ "--i": i } as React.CSSProperties}>
            <span className="how-icon" aria-hidden="true">
              <Icon weight="duotone" />
            </span>
            <span>
              <span className="how-title">{title}</span>
              <span className="how-text">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <h2 className="section-title">ત્રણ ભાગ</h2>
      <ul className="cards">
        {parts.map((part, i) => {
          const partDone = part.topics.filter((t) => completed.has(t.id)).length;
          return (
            <li key={part.id} className="reveal" style={{ "--i": i + 3 } as React.CSSProperties}>
              <Link to={`/part/${part.id}`} className="card" data-part={part.number}>
                <span className="card-top">
                  <span className="part-tile card-icon" aria-hidden="true">
                    <PartIcon number={part.number} />
                  </span>
                  <span className="card-label">ભાગ {part.number}</span>
                </span>
                <span className="card-title">{part.titleGu}</span>
                <span className="card-sub">
                  <En>{part.titleEn}</En> · {part.topics.length} પાઠ
                </span>
                <span className="card-text">{part.introGu}</span>
                <span className="card-bottom">
                  <ProgressBar done={partDone} total={part.topics.length} />
                  <span className="card-go" aria-hidden="true">
                    <ArrowRight weight="bold" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="section-title">
          વારંવાર પૂછાતા સવાલ
        </h2>
        <div className="faq-list">
          {homeFaq.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>
                <Question weight="duotone" className="faq-icon" aria-hidden="true" />
                <span>{item.q}</span>
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
    </article>
  );
}
