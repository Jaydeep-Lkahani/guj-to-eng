import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { CaretDown, CheckCircle, House } from "@phosphor-icons/react";
import { parts, partOfTopic } from "../content";
import { useCompleted } from "../progress";
import { PartIcon } from "./PartIcon";

// The part that the current page belongs to, so it opens automatically.
function currentPartId(pathname: string): string | undefined {
  const [, kind, id] = pathname.split("/");
  if (kind === "part") return id;
  if (kind === "topic") return partOfTopic(id)?.id;
  return undefined;
}

export function Sidebar() {
  const { pathname } = useLocation();
  const completed = useCompleted();
  const activePart = currentPartId(pathname);
  const [open, setOpen] = useState<Set<string>>(() => new Set(activePart ? [activePart] : []));

  useEffect(() => {
    if (activePart) setOpen((prev) => (prev.has(activePart) ? prev : new Set([...prev, activePart])));
  }, [activePart]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <p className="side-heading">પાઠની યાદી</p>
      <ul className="side-list">
        <li>
          <NavLink to="/" end className="side-link side-home">
            <span className="side-icon" aria-hidden="true">
              <House weight="duotone" />
            </span>
            ઘર
          </NavLink>
        </li>
        {parts.map((part) => {
          const isOpen = open.has(part.id);
          const listId = `side-${part.id}`;
          const done = part.topics.filter((t) => completed.has(t.id)).length;
          return (
            <li key={part.id} className="side-part" data-part={part.number}>
              <div className="side-part-row">
                <NavLink to={`/part/${part.id}`} end className="side-link side-part-link">
                  <span className="side-icon part-tile" aria-hidden="true">
                    <PartIcon number={part.number} />
                  </span>
                  <span className="side-part-text">
                    <span className="side-part-num">ભાગ {part.number}</span>
                    <span className="side-part-title">{part.titleGu}</span>
                  </span>
                  <span className="side-count" aria-hidden="true">
                    {done}/{part.topics.length}
                  </span>
                </NavLink>
                <button
                  type="button"
                  className={isOpen ? "side-toggle open" : "side-toggle"}
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  aria-label={`ભાગ ${part.number} ના પાઠ ${isOpen ? "છુપાવો" : "બતાવો"}`}
                  onClick={() => toggle(part.id)}
                >
                  <CaretDown weight="bold" aria-hidden="true" />
                </button>
              </div>
              {isOpen && (
                <ol id={listId} className="side-topics">
                  {part.topics.map((topic, i) => {
                    const isDone = completed.has(topic.id);
                    return (
                      <li key={topic.id} style={{ "--i": i } as React.CSSProperties}>
                        <NavLink to={`/topic/${topic.id}`} className="side-link side-topic">
                          <span className={isDone ? "side-num done" : "side-num"} aria-hidden="true">
                            {isDone ? <CheckCircle weight="fill" /> : i + 1}
                          </span>
                          <span className="side-topic-title">{topic.titleGu}</span>
                          {isDone && <span className="visually-hidden">(પૂરો)</span>}
                        </NavLink>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
