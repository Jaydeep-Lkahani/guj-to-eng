import { gu } from '../../i18n/gu';

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
};

/** Back and next buttons at the end of a step. Next is never hidden for speaking and writing. */
export function StepNav({
  onBack,
  onNext,
  nextLabel = gu.glossary.next,
}: Props) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {onBack && (
        <button
          type="button"
          className="bg-surface text-primary inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-black/15 px-6 font-bold"
          onClick={onBack}
        >
          {gu.glossary.back}
        </button>
      )}
      {onNext && (
        <button
          type="button"
          className="bg-primary inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl px-6 font-bold text-white"
          onClick={onNext}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
