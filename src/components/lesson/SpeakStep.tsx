import { gu } from '../../i18n/gu';
import type { TranslitMode } from '../../lib/translit';
import type { SpeakItem } from '../../schema/content';
import { ExampleCard } from './ExampleCard';

/** Step 6: listen, then say it aloud. Recording and the speech check come later (milestone M5). */
export function SpeakStep({
  items,
  translit,
}: {
  items: readonly SpeakItem[];
  translit: TranslitMode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p>{gu.lesson.speak.intro}</p>
      {items.map((item) => (
        <ExampleCard
          key={item.id}
          en={item.en}
          gu={item.gu}
          translit={item.translit}
          mode={translit}
        />
      ))}
    </div>
  );
}
