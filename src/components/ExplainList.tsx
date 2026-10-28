import { useEffect, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { MixedText } from "./MixedText";

// The explanation as numbered points on a line. Each point ticks itself off once it has been
// on screen long enough to read, so she can see how much is left.
export function ExplainList({ paras, onSeen }: { paras: string[]; onSeen?: (count: number) => void }) {
  const list = useRef<HTMLOListElement>(null);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const root = list.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const timers = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.i);
          // Mostly in the reading area (or, for a tall paragraph, filling half of it).
          const inView =
            e.isIntersecting &&
            (e.intersectionRatio >= 0.5 ||
              (e.rootBounds !== null && e.intersectionRect.height >= e.rootBounds.height * 0.5));
          if (inView && !timers.has(e.target)) {
            // A short stay counts as read; scrolling straight past doesn't.
            timers.set(
              e.target,
              window.setTimeout(() => {
                io.unobserve(e.target);
                setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
              }, 700),
            );
          } else if (!inView && timers.has(e.target)) {
            window.clearTimeout(timers.get(e.target));
            timers.delete(e.target);
          }
        }
      },
      { rootMargin: "-15% 0px -25% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    root.querySelectorAll("[data-i]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => onSeen?.(seen.size), [seen, onSeen]);

  return (
    <ol ref={list} className="lx-ideas">
      {paras.map((para, i) => (
        <li key={i} data-i={i} className={seen.has(i) ? "lx-idea seen" : "lx-idea"}>
          <span className="lx-idea-dot" aria-hidden="true">
            <span className="lx-idea-num">{i + 1}</span>
            <Check weight="bold" className="lx-idea-check" />
          </span>
          <p>
            <MixedText text={para} say />
          </p>
        </li>
      ))}
    </ol>
  );
}
