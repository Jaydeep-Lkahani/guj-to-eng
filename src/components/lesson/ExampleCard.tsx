import type { TranslitMode } from '../../lib/translit';
import { AudioButton } from '../AudioButton';
import { En } from '../En';
import { GuText } from '../GuText';
import { Translit } from '../Translit';

/** An English sentence or word with audio, its Gujarati meaning and (if allowed) the pronunciation help. */
export function ExampleCard({
  en,
  gu: meaning,
  translit,
  note,
  mode,
}: {
  en: string;
  gu: string;
  translit?: string;
  note?: string;
  mode: TranslitMode;
}) {
  return (
    <div className="bg-surface rounded-xl border border-black/10 p-3">
      <p className="flex items-center justify-between gap-3">
        <En className="font-bold">{en}</En>
        <AudioButton text={en} />
      </p>
      <p>
        <GuText text={meaning} />
      </p>
      {translit && <Translit text={translit} mode={mode} />}
      {note && (
        <p className="text-muted mt-1">
          <GuText text={note} />
        </p>
      )}
    </div>
  );
}
