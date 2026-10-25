import { useState } from 'react';
import { gu } from '../i18n/gu';
import { today } from '../lib/dates';
import { downloadText } from '../services/download';
import { useProgress } from '../state/progressContext';

const BUTTON =
  'inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl px-6 font-bold';

/**
 * Shown instead of the site when the saved progress cannot be read (pending.md 7.5).
 * The unreadable text is never overwritten: she can download it, and starting fresh needs a second confirmation.
 */
export function BrokenProgress() {
  const { broken, startFresh } = useProgress();
  const [confirming, setConfirming] = useState(false);
  if (!broken) return null;
  const text = gu.progressSafety;

  return (
    <section aria-labelledby="broken-title">
      <h1 id="broken-title" className="mb-4 text-2xl leading-snug font-bold">
        {text.brokenTitle}
      </h1>
      <p className="mb-6">{text.brokenMessage}</p>
      <div className="mb-6 flex flex-col gap-2">
        <button
          type="button"
          className={`${BUTTON} bg-primary text-white`}
          onClick={() =>
            downloadText(`gujeng-broken-backup-${today()}.json`, broken.raw)
          }
        >
          {text.downloadBackup}
        </button>
        {!confirming && (
          <button
            type="button"
            className={`${BUTTON} bg-surface text-primary border border-black/15`}
            onClick={() => setConfirming(true)}
          >
            {text.startFresh}
          </button>
        )}
      </div>
      {confirming && (
        <div
          role="alertdialog"
          aria-labelledby="confirm-title"
          className="bg-surface rounded-xl border-2 border-black/15 p-4"
        >
          <h2 id="confirm-title" className="mb-2 text-xl font-bold">
            {text.confirmTitle}
          </h2>
          <p className="mb-4">{text.confirmMessage}</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`${BUTTON} bg-error text-white`}
              onClick={startFresh}
            >
              {text.confirmYes}
            </button>
            <button
              type="button"
              className={`${BUTTON} bg-surface text-primary border border-black/15`}
              onClick={() => setConfirming(false)}
            >
              {text.confirmNo}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
