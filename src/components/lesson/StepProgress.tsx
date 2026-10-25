import { gu } from '../../i18n/gu';

/** "Step 3 / 8" with a bar. Counts only the steps that are shown for this lesson. */
export function StepProgress({
  position,
  total,
}: {
  position: number;
  total: number;
}) {
  return (
    <div className="mb-4">
      <div
        role="progressbar"
        aria-label={gu.lesson.progressAria}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={position}
        aria-valuetext={gu.lesson.stepLabel(position, total)}
        className="h-2 overflow-hidden rounded-full bg-black/10"
      >
        <div
          className="bg-primary h-full"
          style={{ width: `${(position / total) * 100}%` }}
        />
      </div>
      <p className="text-muted mt-1">{gu.lesson.stepLabel(position, total)}</p>
    </div>
  );
}
