import { describe, expect, it } from 'vitest';
import {
  makeBundle,
  makeLesson,
  toFiles,
  type FixtureBundle,
} from '../test/contentFixture';
import type { ContentFiles } from './contentFiles';
import {
  ERROR_RULES,
  WARNING_RULES,
  validateContent,
  type ErrorRule,
  type WarningRule,
} from './validateContent';

/** Builds the valid fixture, lets the test break one thing, and returns the files to check. */
function broken(
  change: (bundle: FixtureBundle, files: ContentFiles) => void,
): ContentFiles {
  const bundle = makeBundle();
  const files = toFiles(bundle);
  change(bundle, files);
  return files;
}

const firstLesson = (b: FixtureBundle) => b.lessonsT01.lessons[0]!;
const firstVideo = (b: FixtureBundle) => b.videos.videos[0]!;

function practiceOf(b: FixtureBundle, type: string) {
  const found = firstLesson(b).practice.find((e) => e.type === type);
  if (!found) throw new Error(`fixture has no ${type} exercise`);
  return found;
}

/** One broken fixture per error rule (pending.md 7.12). The type forces a fixture for every rule. */
const BROKEN_FIXTURES: Record<
  ErrorRule,
  (b: FixtureBundle, f: ContentFiles) => void
> = {
  'unknown-file': (_b, f) => {
    f['notes/readme.json'] = {};
  },
  'missing-file': (_b, f) => {
    delete f['videos.json'];
  },
  schema: (_b, f) => {
    f['phases.json'] = { phases: 'not a list' };
  },
  'file-name': (b) => {
    b.lessonsT01.topicId = 'p1-t02';
  },
  'id-format': (b) => {
    firstLesson(b).write[0]!.id = 'my-write-task';
  },
  'id-unique': (b) => {
    b.vocab.words[1]!.id = 'w-apple';
  },
  'ref-missing': (b) => {
    firstLesson(b).newWordIds.push('w-missing');
  },
  'order-complete': (b) => {
    b.phases.phases[0]!.recommendedOrder.pop();
  },
  'order-sequence': (b) => {
    b.phases.phases[0]!.recommendedOrder = [
      'p1-t01-l02',
      'p1-t02-l01',
      'p1-t01-l01',
    ];
  },
  'lesson-minutes': (b) => {
    firstLesson(b).estimatedMinutes = 5;
  },
  'count-examples': (b) => {
    firstLesson(b).examples.pop();
  },
  'count-practice': (b) => {
    firstLesson(b).practice.length = 5;
  },
  'count-speak': (b) => {
    firstLesson(b).speak.length = 2;
  },
  'count-write': (b) => {
    firstLesson(b).write = [];
  },
  'count-quiz': (b) => {
    firstLesson(b).quiz.pop();
  },
  'count-check-questions': (b) => {
    const q = firstLesson(b).quiz;
    firstVideo(b).checkQuestions = q
      .slice(0, 4)
      .map((e, i) => ({ ...e, id: `check-${i}` }));
  },
  'mcq-options': (b) => {
    const mcq = practiceOf(b, 'mcq');
    if (mcq.type === 'mcq') mcq.options = ['only one'];
  },
  'mcq-answer': (b) => {
    const mcq = practiceOf(b, 'listenChoose');
    if (mcq.type === 'listenChoose') mcq.answer = 5;
  },
  'match-pairs': (b) => {
    const match = practiceOf(b, 'match');
    if (match.type === 'match') match.pairs.length = 2;
  },
  'fill-blank': (b) => {
    const fill = practiceOf(b, 'fill');
    if (fill.type === 'fill') fill.sentence = 'A – Apple, B – ___, C – ___';
  },
  'order-tiles': (b) => {
    const order = practiceOf(b, 'order');
    if (order.type === 'order') order.answers = ['C B A'];
  },
  'empty-string': (b) => {
    firstLesson(b).titleEn = '   ';
  },
  'gujarati-missing': (b) => {
    firstLesson(b).titleGu = 'Only English here';
  },
  'english-has-gujarati': (b) => {
    firstLesson(b).titleEn = 'પાઠ';
  },
  'youtube-id': (b) => {
    firstVideo(b).youtubeId = 'short';
  },
  'review-fields': (b) => {
    delete firstVideo(b).reviewedBy;
  },
};

/** One fixture per warning rule. */
const WARNING_FIXTURES: Record<
  WarningRule,
  (b: FixtureBundle, f: ContentFiles) => void
> = {
  'unreviewed-gu': () => {},
  'no-approved-video': () => {},
  'gs-uncovered': () => {},
  'vocab-unused': (b) => {
    b.vocab.words.push({
      id: 'w-unused',
      en: 'unused',
      gu: 'વપરાયેલ નહીં',
      translit: 'અનયૂઝ્ડ',
      pos: 'other',
      phaseId: 'p1',
      topicId: 'p1-t01',
    });
  },
  'new-words-limit': (b) => {
    const ids = Array.from({ length: 9 }, (_, i) => `w-extra-${i}`);
    for (const id of ids) {
      b.vocab.words.push({
        id,
        en: id,
        gu: 'શબ્દ',
        translit: 'શબ્દ',
        pos: 'other',
        phaseId: 'p1',
        topicId: 'p1-t01',
      });
    }
    firstLesson(b).newWordIds = ids;
  },
  'test-empty': (b) => {
    b.test.sections = [];
  },
  'latin-outside-en': (b) => {
    firstLesson(b).explanation.push({ type: 'text', gu: 'આ Apple છે.' });
  },
};

describe('validateContent on valid content', () => {
  it('finds no errors', () => {
    expect(validateContent(toFiles(makeBundle())).errors).toEqual([]);
  });

  it('accepts topics interleaved in the recommended order', () => {
    const files = broken((b) => {
      b.phases.phases[0]!.recommendedOrder = [
        'p1-t02-l01',
        'p1-t01-l01',
        'p1-t01-l02',
      ];
    });
    expect(validateContent(files).errors).toEqual([]);
  });

  it('accepts English letters inside {{en:...}} markers in Gujarati fields', () => {
    const result = validateContent(toFiles(makeBundle()));
    expect(result.warnings.map((w) => w.rule)).not.toContain(
      'latin-outside-en',
    );
  });
});

describe('validateContent error rules', () => {
  it('has a broken fixture for every rule', () => {
    expect(Object.keys(BROKEN_FIXTURES).sort()).toEqual(
      [...ERROR_RULES].sort(),
    );
  });

  it.each(ERROR_RULES)('fails on a broken fixture for "%s"', (rule) => {
    const files = broken(BROKEN_FIXTURES[rule]);
    const rules = validateContent(files).errors.map((e) => e.rule);
    expect(rules).toContain(rule);
  });

  it('points at the file and the place of the problem', () => {
    const files = broken((b) => {
      firstLesson(b).estimatedMinutes = 5;
    });
    const issue = validateContent(files).errors.find(
      (e) => e.rule === 'lesson-minutes',
    );
    expect(issue).toMatchObject({
      file: 'lessons/p1-t01.json',
      path: 'lessons.0.estimatedMinutes',
    });
  });
});

describe('validateContent details', () => {
  it('rejects an unknown field (a typo in the content)', () => {
    const files = broken((b) => {
      (firstLesson(b) as Record<string, unknown>)['titelGu'] = 'ખોટી જોડણી';
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'schema',
    );
  });

  it('checks the English side of a mistake box', () => {
    const files = broken((b) => {
      firstLesson(b).explanation.push({
        type: 'mistake',
        wrong: 'ખોટું',
        right: 'right',
        whyGu: 'કારણ',
      });
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'english-has-gujarati',
    );
  });

  it('rejects Gujarati letters inside an {{en:...}} marker', () => {
    const files = broken((b) => {
      firstLesson(b).explanation.push({
        type: 'text',
        gu: 'આ {{en:સફરજન}} છે.',
      });
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'english-has-gujarati',
    );
  });

  it('rejects a Gujarati meaning that has no Gujarati', () => {
    const files = broken((b) => {
      b.vocab.words[0]!.gu = 'apple';
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'gujarati-missing',
    );
  });

  it('rejects an unknown Gujarati-speaker problem id', () => {
    const files = broken((b) => {
      firstLesson(b).targetsMistakes = ['GS-27'];
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'ref-missing',
    );
  });

  it('rejects a mistake box with an unknown gsId', () => {
    const files = broken((b) => {
      firstLesson(b).explanation.push({
        type: 'mistake',
        wrong: 'a',
        right: 'b',
        whyGu: 'કારણ',
        gsId: 'GS-99',
      });
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'ref-missing',
    );
  });

  it('rejects a missing final test', () => {
    const files = broken((_b, f) => {
      delete f['tests/p1-final.json'];
    });
    const refs = validateContent(files).errors.filter(
      (e) => e.rule === 'ref-missing',
    );
    expect(refs.some((e) => e.path.endsWith('finalTestId'))).toBe(true);
  });

  it('rejects a duplicate lesson in the recommended order', () => {
    const files = broken((b) => {
      b.phases.phases[0]!.recommendedOrder.push('p1-t01-l01');
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'order-complete',
    );
  });

  it('rejects a lesson that is not in its phase in the recommended order', () => {
    const files = broken((b) => {
      b.phases.phases[0]!.recommendedOrder.push('p1-t09-l01');
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'order-complete',
    );
  });

  it('rejects a lesson id that does not start with its topic id', () => {
    const files = broken((b) => {
      b.lessonsT01.lessons[1] = makeLesson('p1-t02', 5);
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'file-name',
    );
  });

  it('rejects a topic code that does not match the topic id', () => {
    const files = broken((b) => {
      b.phases.phases[0]!.topics[0]!.code = 'P1.9';
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'id-format',
    );
  });

  it('rejects an exercise id that is in the wrong section', () => {
    const files = broken((b) => {
      b.lessonsT01.lessons[0]!.quiz[0]!.id = 'p1-t01-l01-practice-01';
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'id-format',
    );
  });

  it('rejects a rejected video without review details', () => {
    const files = broken((b) => {
      firstVideo(b).status = 'rejected';
      delete firstVideo(b).reviewedAt;
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'review-fields',
    );
  });

  it('accepts a candidate video without review details', () => {
    const files = broken((b) => {
      firstVideo(b).status = 'candidate';
      delete firstVideo(b).reviewedBy;
      delete firstVideo(b).reviewedAt;
    });
    expect(validateContent(files).errors).toEqual([]);
  });

  it('accepts order tiles when the answer differs only in capitals and the final full stop', () => {
    const files = broken((b) => {
      const order = practiceOf(b, 'order');
      if (order.type === 'order') {
        order.tiles = ['I', 'am', 'Hetal'];
        order.answers = ['I am hetal.'];
      }
    });
    expect(validateContent(files).errors).toEqual([]);
  });

  it('checks test exercises too', () => {
    const files = broken((b) => {
      const exercise = b.test.sections[0]!.exercises![0]!;
      if (exercise.type === 'mcq') exercise.answer = 7;
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'mcq-answer',
    );
  });

  it('rejects a test item id that does not follow {testId}-{sectionId}-{nn}', () => {
    const files = broken((b) => {
      b.test.sections[0]!.exercises![0]!.id = 'p1-final-reading-01';
    });
    expect(validateContent(files).errors.map((e) => e.rule)).toContain(
      'id-format',
    );
  });
});

describe('validateContent warnings', () => {
  it('has a fixture for every warning rule', () => {
    expect(Object.keys(WARNING_FIXTURES).sort()).toEqual(
      [...WARNING_RULES].sort(),
    );
  });

  it.each(WARNING_RULES)('warns for "%s" and does not fail', (rule) => {
    const files = broken(WARNING_FIXTURES[rule]);
    const result = validateContent(files);
    expect(result.warnings.map((w) => w.rule)).toContain(rule);
    expect(result.errors).toEqual([]);
  });
});
