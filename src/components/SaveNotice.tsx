import { gu } from '../i18n/gu';
import { useProgress } from '../state/progressContext';

/** Tells her when progress cannot be saved in this browser. */
export function SaveNotice() {
  const { saveProblem } = useProgress();
  if (!saveProblem) return null;
  return (
    <div
      role="alert"
      className="border-error bg-surface mb-4 rounded-xl border-2 p-3"
    >
      <p className="text-error font-bold">
        {gu.progressSafety.saveProblemTitle}
      </p>
      <p>{gu.progressSafety.saveProblemMessage}</p>
    </div>
  );
}
