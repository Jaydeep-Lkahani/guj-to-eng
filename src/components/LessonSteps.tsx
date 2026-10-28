import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChatsCircle, Check, Lightbulb, PencilSimpleLine, type Icon } from "@phosphor-icons/react";
import type { TopicMeta } from "../content";

type Props = {
  explainProgress: number; // 0..1, points read
  practiceProgress: number; // 0..1, questions answered
  hasPractice: boolean;
  lessonDone: boolean;
  next?: TopicMeta;
};

type Step = { target: string; section: string; label: string; icon: Icon };

const allSteps: Step[] = [
  { target: "explain", section: "lx-explain", label: "સમજીએ", icon: Lightbulb },
  { target: "examples", section: "lx-examples", label: "ઉદાહરણ", icon: ChatsCircle },
  { target: "practice", section: "lx-practice", label: "પ્રેક્ટિસ", icon: PencilSimpleLine },
];
const stepsNoPractice = allSteps.slice(0, 2);

function jump(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
  el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
}

// A bar that sticks under the header while she reads the lesson:
// the three parts of the lesson (each fills as it is done), a thin reading line, and "next lesson".
export function LessonSteps({ explainProgress, practiceProgress, hasPractice, lessonDone, next }: Props) {
  const steps = hasPractice ? allSteps : stepsNoPractice;
  const [active, setActive] = useState(0);
  const [examplesProgress, setExamplesProgress] = useState(0);
  const [stuck, setStuck] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const nav = bar.current;
    const article = nav?.closest("article");
    if (!nav || !article) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;

      // Which part is she reading now?
      let now = 0;
      steps.forEach((s, i) => {
        const el = document.getElementById(s.section);
        if (el && el.getBoundingClientRect().top < vh * 0.4) now = i;
      });
      setActive(now);

      // Examples count as seen once the end of the list has come up the screen.
      const ex = document.getElementById("lx-examples");
      if (ex) {
        const r = ex.getBoundingClientRect();
        const f = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / r.height));
        const q = Math.round(f * 50) / 50;
        setExamplesProgress((p) => (q > p ? q : p));
      }

      // Thin line: how far down the whole lesson she is.
      const a = article.getBoundingClientRect();
      const total = a.height - vh;
      const read = total > 0 ? Math.min(1, Math.max(0, -a.top / total)) : 1;
      line.current?.style.setProperty("--read", String(read));

      setStuck(nav.getBoundingClientRect().top <= parseFloat(getComputedStyle(nav).top) + 1);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps]);

  const progress = [explainProgress, examplesProgress, lessonDone ? 1 : practiceProgress];

  return (
    <nav ref={bar} className={stuck ? "lx-steps stuck" : "lx-steps"} aria-label="પાઠના ભાગ">
      <ol>
        {steps.map((s, i) => {
          const p = progress[i];
          const done = p >= 1;
          const Icon = s.icon;
          return (
            <li key={s.target}>
              <a
                href={`#${s.target}`}
                className={["lx-step", i === active && "active", done && "done"].filter(Boolean).join(" ")}
                aria-current={i === active ? "step" : undefined}
                onClick={(e) => jump(e, s.target)}
                style={{ "--p": p } as React.CSSProperties}
              >
                <span className="lx-step-icon" aria-hidden="true">
                  {done ? <Check weight="bold" /> : <Icon weight="duotone" />}
                </span>
                <span className="lx-step-label">
                  {s.label}
                  {done && <span className="visually-hidden"> (પૂરું)</span>}
                </span>
                <span className="lx-step-bar" aria-hidden="true">
                  <i />
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      {next && (
        <Link
          to={`/topic/${next.id}`}
          className={lessonDone ? "lx-steps-next ready" : "lx-steps-next"}
          aria-label={`આગળનો પાઠ: ${next.titleGu}`}
        >
          <span className="lx-steps-next-text">આગળ</span>
          <ArrowRight weight="bold" className="nudge" aria-hidden="true" />
        </Link>
      )}
      <span ref={line} className="lx-readline" aria-hidden="true" />
    </nav>
  );
}
