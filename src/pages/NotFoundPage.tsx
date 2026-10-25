import { Link } from "react-router";
import { Compass, House } from "@phosphor-icons/react";

export function NotFoundPage() {
  return (
    <article className="empty-state empty-page">
      <span className="empty-icon" aria-hidden="true">
        <Compass weight="duotone" />
      </span>
      <h1>આ પાનું મળ્યું નહીં</h1>
      <p>કદાચ લિંક ખોટી છે. ઘરે પાછા જાઓ અને ત્યાંથી પાઠ પસંદ કરો.</p>
      <Link to="/" className="button">
        <House weight="bold" aria-hidden="true" />
        ઘરે જાઓ
      </Link>
    </article>
  );
}
