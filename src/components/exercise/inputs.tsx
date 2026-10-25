import { useEffect, useRef, useState } from 'react';
import { gu } from '../../i18n/gu';
import { isMatchPair, type Answer } from '../../lib/grading';
import { shuffleDifferent } from '../../lib/shuffle';
import { symbols } from '../../i18n/gu';
import { En } from '../En';
import { MixedText } from '../MixedText';

const OPTION =
  'bg-surface flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-4 py-2 text-left';

type InputProps<T extends Answer> = {
  disabled: boolean;
  onChange: (answer: T | undefined) => void;
};

/** A list of options (mcq and listenChoose). One can be chosen until the answer is checked. */
export function ChoiceInput({
  options,
  disabled,
  onChange,
}: InputProps<Extract<Answer, { kind: 'index' }>> & {
  options: readonly string[];
}) {
  const [chosen, setChosen] = useState(-1);
  return (
    <div role="radiogroup" className="flex flex-col gap-2">
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          role="radio"
          aria-checked={chosen === index}
          disabled={disabled}
          className={`${OPTION} ${chosen === index ? 'border-primary bg-orange-50 font-bold' : 'border-black/15'}`}
          onClick={() => {
            setChosen(index);
            onChange({ kind: 'index', value: index });
          }}
        >
          <MixedText text={option} />
        </button>
      ))}
    </div>
  );
}

export function TrueFalseInput({
  disabled,
  onChange,
}: InputProps<Extract<Answer, { kind: 'bool' }>>) {
  const [chosen, setChosen] = useState<boolean | undefined>(undefined);
  const choices = [
    { value: true, label: gu.exercise.trueLabel },
    { value: false, label: gu.exercise.falseLabel },
  ];
  return (
    <div role="radiogroup" className="grid grid-cols-2 gap-2">
      {choices.map(({ value, label }) => (
        <button
          key={label}
          type="button"
          role="radio"
          aria-checked={chosen === value}
          disabled={disabled}
          className={`${OPTION} justify-center ${chosen === value ? 'border-primary bg-orange-50 font-bold' : 'border-black/15'}`}
          onClick={() => {
            setChosen(value);
            onChange({ kind: 'bool', value });
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** A box for typing English. The browser must not "fix" what she types. */
export function TextBox({
  disabled,
  onChange,
  autoFocus,
}: InputProps<Extract<Answer, { kind: 'text' }>> & { autoFocus?: boolean }) {
  return (
    <input
      type="text"
      lang="en"
      dir="ltr"
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      enterKeyHint="done"
      autoFocus={autoFocus}
      disabled={disabled}
      aria-label={gu.exercise.answerLabel}
      className="font-en text-learn min-h-12 w-full min-w-0 rounded-xl border-2 border-black/15 bg-white px-3"
      onChange={(event) =>
        onChange({ kind: 'text', value: event.target.value })
      }
    />
  );
}

/** "My name ___ Hetal." with a box in place of the blank. */
export function FillInput({
  sentence,
  disabled,
  onChange,
}: InputProps<Extract<Answer, { kind: 'text' }>> & { sentence: string }) {
  const [before = '', after = ''] = sentence.split('___');
  return (
    <div className="flex flex-wrap items-center gap-2">
      {before.trim() !== '' && <En>{before.trim()}</En>}
      <div className="w-40">
        <TextBox disabled={disabled} onChange={onChange} />
      </div>
      {after.trim() !== '' && <En>{after.trim()}</En>}
    </div>
  );
}

/** Word tiles: tap a tile to put it in the sentence, tap it again to take it out. */
export function OrderInput({
  tiles,
  disabled,
  onChange,
}: InputProps<Extract<Answer, { kind: 'tiles' }>> & {
  tiles: readonly string[];
}) {
  const [shuffled] = useState(() => shuffleDifferent(tiles));
  const [picked, setPicked] = useState<number[]>([]);

  const update = (next: number[]) => {
    setPicked(next);
    onChange({
      kind: 'tiles',
      value: next.map((i) => shuffled[i] ?? ''),
    });
  };
  const tile = (index: number, onClick: () => void) => (
    <button
      key={index}
      type="button"
      disabled={disabled}
      className="bg-surface min-h-12 min-w-12 rounded-xl border-2 border-black/15 px-3"
      onClick={onClick}
    >
      <En>{shuffled[index]}</En>
    </button>
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted">{gu.exercise.tilesHint}</p>
      <div
        role="group"
        aria-label={gu.exercise.tilesAnswer}
        className="flex min-h-16 flex-wrap gap-2 rounded-xl border-2 border-dashed border-black/25 p-2"
      >
        {picked.map((index, position) =>
          tile(index, () => update(picked.filter((_, p) => p !== position))),
        )}
      </div>
      <div
        role="group"
        aria-label={gu.exercise.tilesPool}
        className="flex flex-wrap gap-2"
      >
        {shuffled.map((_, index) =>
          picked.includes(index)
            ? null
            : tile(index, () => update([...picked, index])),
        )}
      </div>
    </div>
  );
}

const FLASH_MS = 1000;

/**
 * Join each left item with its right item. A right pair locks in; a wrong tap flashes ✖ for
 * 1 second (pending.md 7.6). It is finished when every pair is joined.
 */
export function MatchInput({
  pairs,
  disabled,
  onComplete,
}: {
  pairs: readonly { left: string; right: string }[];
  disabled: boolean;
  onComplete: (answer: Extract<Answer, { kind: 'match' }>) => void;
}) {
  const [rights] = useState(() => shuffleDifferent(pairs.map((p) => p.right)));
  const [matched, setMatched] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [wrongPairs, setWrongPairs] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const pickRight = (right: string) => {
    if (selected === undefined) return;
    if (isMatchPair(pairs, selected, right)) {
      const next = [...matched, selected];
      setMatched(next);
      setSelected(undefined);
      if (next.length === pairs.length) {
        onComplete({ kind: 'match', wrongPairs });
      }
      return;
    }
    setWrongPairs([...wrongPairs, `${selected} → ${right}`]);
    setFlash(right);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(undefined), FLASH_MS);
  };

  const isRightMatched = (right: string) =>
    pairs.some((p) => p.right === right && matched.includes(p.left));
  const itemClass = (state: 'idle' | 'selected' | 'matched' | 'wrong') =>
    `bg-surface flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border-2 px-3 py-2 ${
      state === 'matched'
        ? 'border-success'
        : state === 'wrong'
          ? 'border-error'
          : state === 'selected'
            ? 'border-primary bg-orange-50 font-bold'
            : 'border-black/15'
    }`;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted">{gu.exercise.matchHint}</p>
      <div className="grid grid-cols-2 gap-3">
        <ul aria-label={gu.exercise.matchLeft} className="flex flex-col gap-2">
          {pairs.map(({ left }) => {
            const done = matched.includes(left);
            return (
              <li key={left}>
                <button
                  type="button"
                  disabled={disabled || done}
                  aria-pressed={selected === left}
                  className={itemClass(
                    done ? 'matched' : selected === left ? 'selected' : 'idle',
                  )}
                  onClick={() => setSelected(left)}
                >
                  <MixedText text={left} />
                  {done && <span aria-hidden>{symbols.right}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <ul aria-label={gu.exercise.matchRight} className="flex flex-col gap-2">
          {rights.map((right) => {
            const done = isRightMatched(right);
            const wrong = flash === right;
            return (
              <li key={right}>
                <button
                  type="button"
                  disabled={disabled || done}
                  className={itemClass(
                    done ? 'matched' : wrong ? 'wrong' : 'idle',
                  )}
                  onClick={() => pickRight(right)}
                >
                  <MixedText text={right} />
                  {done && <span aria-hidden>{symbols.right}</span>}
                  {wrong && (
                    <span role="img" aria-label={gu.glossary.wrong}>
                      {symbols.wrong}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
