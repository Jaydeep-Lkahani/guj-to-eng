import { useState } from 'react';
import { gu } from '../../i18n/gu';
import type { TranslitMode } from '../../lib/translit';
import type { WarmupItem } from '../../lib/warmup';
import { AudioButton } from '../AudioButton';
import { En } from '../En';
import { ExerciseView } from '../exercise/ExerciseView';
import { Translit } from '../Translit';
import { StepNav } from './StepNav';

function CardItem({
  item,
  translit,
  onNext,
}: {
  item: Extract<WarmupItem, { kind: 'card' }>;
  translit: TranslitMode;
  onNext: () => void;
}) {
  const [shown, setShown] = useState(false);
  const { word } = item;
  return (
    <div className="flex flex-col gap-3">
      <p className="font-bold">{gu.lesson.warmup.cardQuestion}</p>
      <p className="bg-surface flex items-center justify-between gap-3 rounded-xl border border-black/10 p-3">
        <span className="flex items-center gap-3">
          {word.emoji && (
            <span aria-hidden className="text-3xl">
              {word.emoji}
            </span>
          )}
          <En className="font-bold">{word.en}</En>
        </span>
        <AudioButton text={word.en} />
      </p>
      {shown ? (
        <p>
          {word.gu} <Translit text={word.translit} mode={translit} />
        </p>
      ) : (
        <button
          type="button"
          className="bg-primary inline-flex min-h-12 min-w-12 items-center justify-center self-start rounded-xl px-6 font-bold text-white"
          onClick={() => setShown(true)}
        >
          {gu.lesson.warmup.showAnswer}
        </button>
      )}
      {shown && <StepNav onNext={onNext} />}
    </div>
  );
}

/** Step 1: a short review made from due flashcards or the last lesson's quiz. Never scored. */
export function WarmupStep({
  items,
  translit,
  onNext,
}: {
  items: readonly WarmupItem[];
  translit: TranslitMode;
  onNext: () => void;
}) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  const advance = () =>
    index + 1 < items.length ? setIndex(index + 1) : onNext();

  return (
    <div>
      <p className="mb-4">{gu.lesson.warmup.intro}</p>
      {item?.kind === 'card' && (
        <CardItem
          key={item.word.id}
          item={item}
          translit={translit}
          onNext={advance}
        />
      )}
      {item?.kind === 'question' && (
        <ExerciseView
          key={item.exercise.id}
          exercise={item.exercise}
          mode="practice"
          onNext={advance}
        />
      )}
    </div>
  );
}
