import type {
  Exercise,
  Lesson,
  LessonsFile,
  PhasesFile,
  TestFile,
  VideosFile,
  VocabFile,
} from '../schema/content';
import type { ContentFiles } from '../lib/contentFiles';

/**
 * A small, valid set of content files for the validator tests.
 * Every test that needs broken content starts from this and breaks one thing.
 * (The video ID is a made-up test value; it never appears in real content.)
 */

function makeExercises(
  lessonId: string,
  section: 'practice' | 'quiz',
): Exercise[] {
  const id = (n: number) =>
    `${lessonId}-${section}-${String(n).padStart(2, '0')}`;
  const base = { promptGu: 'પ્રશ્ન', explainGu: 'કારણ' };
  if (section === 'quiz') {
    return [1, 2, 3, 4, 5].map((n) => ({
      ...base,
      id: id(n),
      type: 'mcq' as const,
      options: ['A', 'B', 'C'],
      answer: 0,
    }));
  }
  return [
    { ...base, id: id(1), type: 'mcq', options: ['A', 'B', 'C'], answer: 1 },
    {
      ...base,
      id: id(2),
      type: 'trueFalse',
      statementEn: 'b = d',
      answer: false,
    },
    {
      ...base,
      id: id(3),
      type: 'fill',
      sentence: 'A – Apple, B – ___',
      answers: ['Ball'],
    },
    {
      ...base,
      id: id(4),
      type: 'order',
      tiles: ['A', 'B', 'C'],
      answers: ['A B C'],
    },
    {
      ...base,
      id: id(5),
      type: 'match',
      pairs: [
        { left: 'A', right: 'a' },
        { left: 'B', right: 'b' },
        { left: 'C', right: 'c' },
      ],
    },
    {
      ...base,
      id: id(6),
      type: 'listenChoose',
      audio: 'Ball',
      options: ['Ball', 'Cat'],
      answer: 0,
    },
    { ...base, id: id(7), type: 'listenType', audio: 'Egg', answers: ['egg'] },
    { ...base, id: id(8), type: 'translate', gu: 'સફરજન', answers: ['apple'] },
  ];
}

export function makeLesson(
  topicId: string,
  n: number,
  newWordIds: string[] = [],
): Lesson {
  const id = `${topicId}-l${String(n).padStart(2, '0')}`;
  const nn = (i: number) => String(i).padStart(2, '0');
  return {
    id,
    topicId,
    order: n,
    titleGu: 'પાઠનું શીર્ષક',
    titleEn: 'Lesson title',
    estimatedMinutes: 20,
    videoIds: [],
    explanation: [
      { type: 'heading', gu: 'શીર્ષક' },
      { type: 'text', gu: 'આ {{en:Apple}} છે.' },
      {
        type: 'mistake',
        wrong: 'b = d',
        right: 'b ≠ d',
        whyGu: 'અલગ અક્ષરો છે.',
      },
    ],
    examples: [1, 2, 3, 4, 5].map((i) => ({
      en: `Example ${i}`,
      gu: 'ઉદાહરણ',
    })),
    practice: makeExercises(id, 'practice'),
    speak: [1, 2, 3].map((i) => ({
      id: `${id}-speak-${nn(i)}`,
      en: 'Apple',
      gu: 'સફરજન',
    })),
    write: [
      {
        id: `${id}-write-01`,
        kind: 'type' as const,
        promptGu: 'લખો',
        model: 'apple',
        minWords: 1,
      },
    ],
    quiz: makeExercises(id, 'quiz'),
    useToday: { en: 'Apple', gu: 'આજે બોલો' },
    newWordIds,
    targetsMistakes: [],
    reviewedGu: false,
  };
}

export type FixtureBundle = {
  phases: PhasesFile;
  videos: VideosFile;
  vocab: VocabFile;
  lessonsT01: LessonsFile;
  lessonsT02: LessonsFile;
  test: TestFile;
};

export function makeBundle(): FixtureBundle {
  return {
    phases: {
      phases: [
        {
          id: 'p1',
          order: 1,
          titleGu: 'તબક્કો 1',
          titleEn: 'Phase 1',
          levelCefr: 'A0–A1',
          goalGu: 'લક્ષ્ય',
          finalTestId: 'p1-final',
          topics: [
            {
              id: 'p1-t01',
              code: 'P1.1',
              order: 1,
              titleGu: 'પહેલો વિષય',
              titleEn: 'First topic',
              introGu: 'પરિચય',
              videoIds: ['v-TEST_VIDEO1'],
            },
            {
              id: 'p1-t02',
              code: 'P1.2',
              order: 2,
              titleGu: 'બીજો વિષય',
              titleEn: 'Second topic',
              introGu: 'પરિચય',
              videoIds: [],
            },
          ],
          recommendedOrder: ['p1-t01-l01', 'p1-t02-l01', 'p1-t01-l02'],
        },
      ],
    },
    videos: {
      videos: [
        {
          id: 'v-TEST_VIDEO1',
          youtubeId: 'TEST_VIDEO1',
          titleOriginal: 'A test title',
          channel: 'A test channel',
          titleGu: 'વિડિયો',
          aboutGu: 'આમાં તમે શીખશો',
          topicIds: ['p1-t01'],
          keyWordIds: ['w-apple'],
          checkQuestions: [],
          status: 'approved',
          foundAt: '2026-10-25',
          reviewedBy: 'tester',
          reviewedAt: '2026-10-26',
        },
      ],
    },
    vocab: {
      words: [
        {
          id: 'w-apple',
          en: 'apple',
          gu: 'સફરજન',
          translit: 'ઍપલ',
          pos: 'noun',
          phaseId: 'p1',
          topicId: 'p1-t01',
        },
        {
          id: 'w-ball',
          en: 'ball',
          gu: 'દડો',
          translit: 'બૉલ',
          pos: 'noun',
          phaseId: 'p1',
          topicId: 'p1-t01',
        },
      ],
    },
    lessonsT01: {
      topicId: 'p1-t01',
      lessons: [
        makeLesson('p1-t01', 1, ['w-apple']),
        makeLesson('p1-t01', 2, ['w-ball']),
      ],
    },
    lessonsT02: { topicId: 'p1-t02', lessons: [makeLesson('p1-t02', 1)] },
    test: {
      id: 'p1-final',
      phaseId: 'p1',
      titleGu: 'પરીક્ષા',
      passPercent: 70,
      sections: [
        {
          id: 'grammar',
          titleGu: 'વ્યાકરણ',
          skill: 'grammar',
          exercises: [
            {
              id: 'p1-final-grammar-01',
              type: 'mcq',
              promptGu: 'પ્રશ્ન',
              explainGu: 'કારણ',
              options: ['A', 'B'],
              answer: 0,
            },
          ],
        },
      ],
    },
  };
}

export function toFiles(bundle: FixtureBundle): ContentFiles {
  return {
    'phases.json': bundle.phases,
    'videos.json': bundle.videos,
    'vocab/p1.json': bundle.vocab,
    'lessons/p1-t01.json': bundle.lessonsT01,
    'lessons/p1-t02.json': bundle.lessonsT02,
    'tests/p1-final.json': bundle.test,
  };
}
