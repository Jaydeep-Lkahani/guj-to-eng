import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ArrowRight, CaretDown, Check, House, Trophy } from "@phosphor-icons/react";
import { allTopics, parts, partOfTopic } from "../content";
import { useCompleted } from "../progress";
import { PartIcon } from "./PartIcon";
import "../sidebar.css";

// The page's kind and id, e.g. ["topic", "p1-t04"].
function route(pathname: string): [string | undefined, string | undefined] {
  const [, kind, id] = pathname.split("/");
  return [kind, id];
}

// The part that the current page belongs to, so it opens automatically.
function currentPartId(pathname: string): string | undefined {
  const [kind, id] = route(pathname);
  if (kind === "part") return id;
  if (kind === "topic" && id) return partOfTopic(id)?.id;
  return undefined;
}

// Small round progress for the card at the top.
function MiniRing({ done, total }: { done: number; total: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const frac = total ? done / total : 0;
  return (
    <span className="sp-ring" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <circle className="sp-ring-track" cx="24" cy="24" r={r} />
        <circle
          className="sp-ring-fill"
          cx="24"
          cy="24"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <span className="sp-ring-pct">{Math.round(frac * 100)}%</span>
    </span>
  );
}

export function Sidebar() {
  const { pathname } = useLocation();
  const completed = useCompleted();
  const activePart = currentPartId(pathname);
  const [kind, currentId] = route(pathname);
  const currentTopic = kind === "topic" ? currentId : undefined;
  const [open, setOpen] = useState<Set<string>>(() => new Set(activePart ? [activePart] : []));
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activePart) setOpen((prev) => (prev.has(activePart) ? prev : new Set([...prev, activePart])));
  }, [activePart]);

  // Keep the open lesson visible in the sidebar's own scroll (after its part has opened).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nav = root.current?.closest(".sidebar");
      const item = nav?.querySelector<HTMLElement>(".st-link.active");
      if (!nav || !item || !nav.clientHeight) return;
      const navBox = nav.getBoundingClientRect();
      const box = item.getBoundingClientRect();
      const pad = 96; // room for the part heading that sticks at the top
      if (box.top < navBox.top + pad || box.bottom > navBox.bottom - 24) {
        nav.scrollTo?.({ top: nav.scrollTop + box.top - navBox.top - navBox.height / 3, behavior: "smooth" });
      }
    }, 340);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const doneCount = allTopics.filter((t) => completed.has(t.id)).length;
  const firstUndone = allTopics.find((t) => !completed.has(t.id));
  // Suggest the next lesson she hasn't done, but not the one she is already reading.
  const resume = allTopics.find((t) => !completed.has(t.id) && t.id !== currentTopic);

  return (
    <div className="side" ref={root}>
      <section className="sp-card" aria-label="તમારી પ્રગતિ">
        <div className="sp-top">
          <MiniRing done={doneCount} total={allTopics.length} />
          <div className="sp-text">
            <p className="sp-title">તમારી પ્રગતિ</p>
            <p className="sp-sub">
              {allTopics.length} માંથી <b>{doneCount}</b> પાઠ પૂરા
            </p>
          </div>
        </div>
        {resume ? (
          <Link to={`/topic/${resume.id}`} className="sp-resume">
            <span className="sp-resume-text">
              <span className="sp-resume-label">{doneCount === 0 && !currentTopic ? "શરૂ કરો" : "આગળ ભણો"}</span>
              <span className="sp-resume-title">{resume.titleGu}</span>
            </span>
            <span className="sp-resume-go" aria-hidden="true">
              <ArrowRight weight="bold" />
            </span>
          </Link>
        ) : (
          !firstUndone && (
            <p className="sp-done">
              <Trophy weight="duotone" aria-hidden="true" />
              બધા પાઠ પૂરા! શાબાશ!
            </p>
          )
        )}
      </section>

      <NavLink to="/" end className="side-home">
        <span className="side-home-icon" aria-hidden="true">
          <House weight="duotone" />
        </span>
        ઘર
      </NavLink>

      <p className="side-heading">ભાગ અને પાઠ</p>

      <ul className="side-parts">
        {parts.map((part) => {
          const isOpen = open.has(part.id);
          const listId = `side-${part.id}`;
          const done = part.topics.filter((t) => completed.has(t.id)).length;
          const pct = Math.round((done / part.topics.length) * 100);
          const isHere = activePart === part.id;
          return (
            <li
              key={part.id}
              className={["sx", isOpen && "open", isHere && "here"].filter(Boolean).join(" ")}
              data-part={part.number}
            >
              <div className="sx-head">
                <NavLink to={`/part/${part.id}`} end className="sx-link">
                  <span className="sx-tile" aria-hidden="true">
                    <PartIcon number={part.number} />
                  </span>
                  <span className="sx-text">
                    <span className="sx-eyebrow">
                      ભાગ {part.number} <span aria-hidden="true">·</span> <span lang="en">{part.titleEn}</span>
                    </span>
                    <span className="sx-title">{part.titleGu}</span>
                    <span className="sx-meter" aria-hidden="true">
                      <span className="sx-bar">
                        <span className="sx-fill" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="sx-count">
                        {done}/{part.topics.length}
                      </span>
                    </span>
                    <span className="visually-hidden">
                      ({part.topics.length} માંથી {done} પાઠ પૂરા)
                    </span>
                  </span>
                </NavLink>
                <button
                  type="button"
                  className="sx-toggle"
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  aria-label={`ભાગ ${part.number} ના પાઠ ${isOpen ? "છુપાવો" : "બતાવો"}`}
                  onClick={() => toggle(part.id)}
                >
                  <CaretDown weight="bold" aria-hidden="true" />
                </button>
              </div>

              <div className="sx-collapse" id={listId} inert={!isOpen}>
                <ol className="st-list">
                  {part.topics.map((topic, i) => {
                    const isDone = completed.has(topic.id);
                    const isNext = topic.id === firstUndone?.id && topic.id !== currentTopic;
                    return (
                      <li key={topic.id} className={isDone ? "st done" : "st"} style={{ "--i": i } as React.CSSProperties}>
                        <NavLink to={`/topic/${topic.id}`} className="st-link">
                          <span className="st-node" aria-hidden="true">
                            {isDone ? <Check weight="bold" /> : i + 1}
                          </span>
                          <span className="st-text">
                            <span className="st-title">{topic.titleGu}</span>
                            <span className="st-en" lang="en">
                              {topic.titleEn}
                            </span>
                          </span>
                          {isNext && <span className="st-badge">હવે</span>}
                          {isDone && <span className="visually-hidden">(પૂરો)</span>}
                        </NavLink>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
