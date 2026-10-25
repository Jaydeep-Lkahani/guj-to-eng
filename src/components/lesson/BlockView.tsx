import { Lightbulb } from 'lucide-react';
import { gu, symbols } from '../../i18n/gu';
import type { Block } from '../../schema/content';
import { AudioButton } from '../AudioButton';
import { En } from '../En';
import { GuText } from '../GuText';
import { MixedText } from '../MixedText';
import { Translit } from '../Translit';
import type { TranslitMode } from '../../lib/translit';

const CARD = 'bg-surface mb-4 rounded-xl border border-black/10 p-3';

/** One block of the written explanation (step 3, pending.md 7.4). */
export function BlockView({
  block,
  translit,
}: {
  block: Block;
  translit: TranslitMode;
}) {
  switch (block.type) {
    case 'heading':
      return (
        <h3 className="mt-6 mb-2 text-xl font-bold">
          <GuText text={block.gu} />
        </h3>
      );
    case 'text':
      return (
        <p className="mb-3">
          <GuText text={block.gu} />
        </p>
      );
    case 'table':
      return (
        <div className="mb-4 overflow-x-auto" tabIndex={0}>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="border-b-2 border-black/20 px-2 py-2"
                  >
                    <GuText text={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="border-b border-black/10 px-2 py-2">
                      <GuText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'compare':
      return (
        <div className={CARD}>
          <p>
            <GuText text={block.gu} />
          </p>
          <p className="flex items-center gap-3">
            <En className="font-bold">{block.en}</En>
            <AudioButton text={block.en} />
          </p>
          {block.noteGu && (
            <p className="text-muted">
              <GuText text={block.noteGu} />
            </p>
          )}
        </div>
      );
    case 'mistake':
      return (
        <div className="border-error mb-4 rounded-xl border-2 bg-red-50 p-3">
          <p className="mb-2 font-bold">{gu.glossary.commonMistake}</p>
          <p>
            <span className="text-error font-bold">
              <span aria-hidden>{symbols.wrong}</span> {`${gu.glossary.wrong}:`}
            </span>{' '}
            <MixedText text={block.wrong} />
          </p>
          <p>
            <span className="text-success font-bold">
              <span aria-hidden>{symbols.right}</span>{' '}
              {`${gu.exercise.trueLabel}:`}
            </span>{' '}
            <MixedText text={block.right} />
          </p>
          <p className="mt-2">
            <GuText text={block.whyGu} />
          </p>
        </div>
      );
    case 'tip':
      return (
        <p className="bg-surface mb-4 flex gap-2 rounded-xl border border-black/10 p-3">
          <Lightbulb
            aria-hidden
            size={24}
            className="text-primary mt-1 shrink-0"
          />
          <span>
            <GuText text={block.gu} />
          </span>
        </p>
      );
    case 'example':
      return (
        <div className={CARD}>
          <p className="flex items-center gap-3">
            <En className="font-bold">{block.en}</En>
            <AudioButton text={block.en} />
          </p>
          <p>
            <GuText text={block.gu} />
          </p>
          {block.translit && <Translit text={block.translit} mode={translit} />}
        </div>
      );
  }
}
