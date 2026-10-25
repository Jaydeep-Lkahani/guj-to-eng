import { Link } from "react-router";
import { Heart, House, LockSimple } from "@phosphor-icons/react";
import { allTopics, parts } from "../content";
import { useCompleted } from "../progress";
import { LogoMark, siteName } from "./Logo";
import { PartIcon } from "./PartIcon";

export function Footer() {
  const completed = useCompleted();
  const done = allTopics.filter((t) => completed.has(t.id)).length;

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label={`${siteName} – ઘર`}>
            <LogoMark size={56} />
          </Link>
          <div>
            <p className="footer-name">{siteName}</p>
            <p className="footer-tag">રોજ થોડું, ધીરે ધીરે. અંગ્રેજી, તમારી પોતાની ભાષામાં સમજીને.</p>
            <p className="footer-stat">
              <span className="footer-stat-num">{done}</span> / {allTopics.length} પાઠ પૂરા
            </p>
          </div>
        </div>

        <nav className="footer-nav" aria-label="ફૂટર">
          <p className="footer-head">ભણવાનું</p>
          <ul>
            <li>
              <Link to="/" className="footer-link">
                <House weight="duotone" aria-hidden="true" />
                ઘર
              </Link>
            </li>
            {parts.map((part) => (
              <li key={part.id}>
                <Link to={`/part/${part.id}`} className="footer-link" data-part={part.number}>
                  <PartIcon number={part.number} />
                  ભાગ {part.number}: {part.titleGu}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>
          <LockSimple weight="duotone" aria-hidden="true" /> તમારી પ્રગતિ ફક્ત આ બ્રાઉઝરમાં સચવાય છે.
        </p>
        <p>
          <Heart weight="fill" className="footer-heart" aria-hidden="true" /> પ્રેમથી બનાવ્યું
        </p>
      </div>
    </footer>
  );
}
