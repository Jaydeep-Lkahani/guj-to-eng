import { useState } from 'react';
import { gu } from '../i18n/gu';
import type { TranslitMode } from '../lib/translit';

/** The Gujarati pronunciation help: always, only after a tap, or never (pending.md 7.5). */
export function Translit({ text, mode }: { text: string; mode: TranslitMode }) {
  const [shown, setShown] = useState(false);
  if (mode === 'never') return null;
  if (mode === 'tap' && !shown) {
    return (
      <button
        type="button"
        className="text-primary min-h-12 rounded-xl px-2 font-bold underline"
        onClick={() => setShown(true)}
      >
        {gu.lesson.translitShow}
      </button>
    );
  }
  return <span className="text-muted">{`(${text})`}</span>;
}
