export function ProgressBar({ done, total, label = true }: { done: number; total: number; label?: boolean }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label="પૂરા થયેલા પાઠ"
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {label && (
        <p className="progress-text">
          <span>
            {total} માંથી {done} પાઠ પૂરા
          </span>
          <span className="progress-pct">{pct}%</span>
        </p>
      )}
    </div>
  );
}

// Round progress for the home page.
export function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const frac = total ? done / total : 0;
  return (
    <div className="ring" role="img" aria-label={`${total} માંથી ${done} પાઠ પૂરા`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring-track" cx="50" cy="50" r={r} />
        <circle
          className="ring-fill"
          cx="50"
          cy="50"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          style={{ "--ring-c": c } as React.CSSProperties}
        />
      </svg>
      <span className="ring-label" aria-hidden="true">
        <span className="ring-num">{done}</span>
        <span className="ring-total">/ {total}</span>
      </span>
    </div>
  );
}
