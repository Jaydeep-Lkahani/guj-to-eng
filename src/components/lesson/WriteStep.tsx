import { useState } from 'react';
import { gu } from '../../i18n/gu';
import { nowIso } from '../../lib/dates';
import type { WriteTask } from '../../schema/content';
import { useProgress } from '../../state/progressContext';
import { En } from '../En';
import { GuText } from '../GuText';

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function TypeTask({ task }: { task: WriteTask }) {
  const { dispatch } = useProgress();
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const words = countWords(text);
  const tooShort = task.minWords !== undefined && words < task.minWords;

  return (
    <div className="flex flex-col gap-2">
      <textarea
        lang="en"
        dir="ltr"
        rows={4}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={text}
        disabled={submitted}
        aria-label={gu.lesson.write.typeLabel}
        className="font-en text-learn w-full rounded-xl border-2 border-black/15 bg-white p-3"
        onChange={(event) => setText(event.target.value)}
      />
      <p className="text-muted">
        {gu.lesson.write.wordCount(words)}
        {task.minWords !== undefined && !submitted && tooShort
          ? ` · ${gu.lesson.write.minWords(task.minWords)}`
          : ''}
      </p>
      {!submitted && (
        <button
          type="button"
          disabled={text.trim() === ''}
          className="bg-primary inline-flex min-h-12 min-w-12 items-center justify-center self-start rounded-xl px-6 font-bold text-white disabled:opacity-50"
          onClick={() => {
            dispatch({
              type: 'saveWriting',
              taskId: task.id,
              text,
              at: nowIso(),
            });
            setSubmitted(true);
          }}
        >
          {gu.lesson.write.submit}
        </button>
      )}
      {submitted && (
        <div
          role="status"
          className="bg-surface rounded-xl border border-black/15 p-3"
        >
          <p>{gu.lesson.write.saved}</p>
          {task.model && (
            <>
              <p className="mt-2 font-bold">{gu.lesson.write.modelTitle}</p>
              <p>
                <En>{task.model}</En>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function HandwriteTask({ task }: { task: WriteTask }) {
  return (
    <div className="flex flex-col gap-2">
      <p>{gu.lesson.write.handwriteIntro}</p>
      {task.letters && (
        <p className="bg-surface rounded-xl border border-black/10 p-3 text-center">
          <En className="text-4xl tracking-widest">{task.letters}</En>
        </p>
      )}
    </div>
  );
}

/**
 * Step 7: type a few sentences (with a model answer after sending) or practise letters on paper.
 * Never blocks progress. The self-check list and the tracing canvas come later (milestone M5).
 */
export function WriteStep({ tasks }: { tasks: readonly WriteTask[] }) {
  return (
    <div className="flex flex-col gap-6">
      {tasks.map((task) => (
        <section key={task.id} className="flex flex-col gap-2">
          <p className="font-bold">
            <GuText text={task.promptGu} />
          </p>
          {task.kind === 'type' ? (
            <TypeTask task={task} />
          ) : (
            <HandwriteTask task={task} />
          )}
        </section>
      ))}
    </div>
  );
}
