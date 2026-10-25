import { gu } from '../../i18n/gu';
import type { TranslitMode } from '../../lib/translit';
import type { Example } from '../../schema/content';
import { ExampleCard } from './ExampleCard';

/** Step 4: examples with audio. */
export function ExamplesStep({
  examples,
  translit,
}: {
  examples: readonly Example[];
  translit: TranslitMode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p>{gu.lesson.examples.intro}</p>
      {examples.map((example, i) => (
        <ExampleCard
          key={i}
          en={example.en}
          gu={example.gu}
          translit={example.translit}
          note={example.noteGu}
          mode={translit}
        />
      ))}
    </div>
  );
}
