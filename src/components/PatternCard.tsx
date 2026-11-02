import { patternEnglish, type Pattern, type Role, type SentencePart } from "../content";
import { MixedText } from "./MixedText";
import { ListenButton } from "./ListenButton";
import "../pattern.css";

// The Gujarati name of each sentence part, shown under its piece and on the labelled boxes.
export const roleLabel: Record<Role, string> = {
  who: "કોણ?",
  verb: "શું કરે?",
  helper: "મદદગાર",
  what: "શું?",
  how: "કેવું?",
  where: "ક્યાં?",
  when: "ક્યારે?",
  link: "જોડતો શબ્દ",
};

// A row of coloured, numbered pieces with each piece's job written under it.
export function Pieces({ parts, english }: { parts: SentencePart[]; english: boolean }) {
  return (
    <ol className="pat-pieces">
      {parts.map((p, i) => (
        <li key={i} className={`pat-piece role-${p.role}`}>
          <span className="pat-num" aria-hidden="true">
            {i + 1}
          </span>
          <span className="pat-text" lang={english ? "en" : undefined}>
            {p.text}
          </span>
          <span className="pat-role">{roleLabel[p.role]}</span>
        </li>
      ))}
    </ol>
  );
}

function Row({ label, parts, english }: { label: string; parts: SentencePart[]; english: boolean }) {
  return (
    <div className="pat-row">
      <p className="pat-row-label">{label}</p>
      <Pieces parts={parts} english={english} />
    </div>
  );
}

// One sentence drawn as coloured pieces: Gujarati order on top, English order below.
// The same colour means the same job, so she can follow each piece to its new place.
export function PatternCard({ pattern }: { pattern: Pattern }) {
  const english = patternEnglish(pattern);
  return (
    <figure className="pat-card">
      {pattern.titleGu && <figcaption className="pat-title">{pattern.titleGu}</figcaption>}
      <Row label="ગુજરાતી" parts={pattern.gu} english={false} />
      <Row label="English" parts={pattern.en} english />
      {pattern.noteGu && (
        <p className="pat-note">
          <MixedText text={pattern.noteGu} />
        </p>
      )}
      <ListenButton text={english} />
    </figure>
  );
}
