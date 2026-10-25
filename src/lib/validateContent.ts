import { GS_IDS, type Exercise, type Lesson } from '../schema/content.ts';
import {
  parseContentFiles,
  type ContentFiles,
  type Issue,
  type ParsedContent,
} from './contentFiles.ts';
import { normalizeAnswer } from './normalize.ts';
import { englishTokens, withoutEnglishTokens } from './richText.ts';

/** Rules that fail the build (pending.md 7.12). Every rule has a broken fixture in the tests. */
export const ERROR_RULES = [
  'unknown-file',
  'missing-file',
  'schema',
  'file-name',
  'id-format',
  'id-unique',
  'ref-missing',
  'order-complete',
  'order-sequence',
  'lesson-minutes',
  'count-examples',
  'count-practice',
  'count-speak',
  'count-write',
  'count-quiz',
  'count-check-questions',
  'mcq-options',
  'mcq-answer',
  'match-pairs',
  'fill-blank',
  'order-tiles',
  'empty-string',
  'gujarati-missing',
  'english-has-gujarati',
  'youtube-id',
  'review-fields',
] as const;
export type ErrorRule = (typeof ERROR_RULES)[number];

/** Rules that are only printed (pending.md 7.12). */
export const WARNING_RULES = [
  'unreviewed-gu',
  'no-approved-video',
  'gs-uncovered',
  'vocab-unused',
  'new-words-limit',
  'test-empty',
  'latin-outside-en',
] as const;
export type WarningRule = (typeof WARNING_RULES)[number];

export type ValidationResult = { errors: Issue[]; warnings: Issue[] };

const GUJARATI_LETTER = /[઀-૿]/;
const LATIN_LETTER = /[A-Za-z]/;

/** Fields that must hold English only (pending.md 7.12), plus the English side of a mistake box. */
const ENGLISH_KEYS = new Set([
  'en',
  'titleEn',
  'statementEn',
  'promptEn',
  'audio',
  'answers',
  'tiles',
  'sentence',
  'model',
  'passageEn',
  'exampleEn',
]);

const ID = {
  phase: /^p[1-9]$/,
  topic: /^p[1-9]-t\d{2}$/,
  lesson: /^p[1-9]-t\d{2}-l\d{2}$/,
  word: /^w-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  video: /^v-[A-Za-z0-9_-]{11}$/,
  test: /^p[1-9]-final$/,
  youtube: /^[A-Za-z0-9_-]{11}$/,
};

const MAX_NEW_WORDS: Record<string, number> = { p1: 8, p2: 12, p3: 15 };

function isGujaratiField(key: string): boolean {
  return key === 'gu' || key.endsWith('Gu');
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateContent(files: ContentFiles): ValidationResult {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const { parsed, issues } = parseContentFiles(files);
  errors.push(...issues);

  const error = (
    rule: ErrorRule,
    file: string,
    path: string,
    message: string,
  ) => {
    errors.push({ rule, file, path, message });
  };

  for (const required of ['phases.json', 'videos.json']) {
    if (!(required in files)) {
      error(
        'missing-file',
        required,
        '',
        `Required file ${required} is missing.`,
      );
    }
  }

  checkStrings(files, parsed, error, warnings);
  checkIds(parsed, error);
  checkReferences(parsed, error);
  checkPhases(parsed, error);
  checkLessons(parsed, error, warnings);
  checkVideos(parsed, error);
  checkTests(parsed, error);
  addWarnings(parsed, warnings);

  return { errors, warnings };
}

type ReportError = (
  rule: ErrorRule,
  file: string,
  path: string,
  message: string,
) => void;

// ------------------------------------------------------------ strings

/** Empty strings, Gujarati fields without Gujarati, English fields with Gujarati. */
function checkStrings(
  files: ContentFiles,
  parsed: ParsedContent,
  error: ReportError,
  warnings: Issue[],
): void {
  const parsedFiles = new Set<string>();
  if (parsed.phases) parsedFiles.add(parsed.phases.file);
  if (parsed.videos) parsedFiles.add(parsed.videos.file);
  for (const entry of [...parsed.vocab, ...parsed.lessons, ...parsed.tests]) {
    parsedFiles.add(entry.file);
  }

  for (const file of Array.from(parsedFiles).sort()) {
    const strayLatin: string[] = [];

    const visit = (
      value: unknown,
      path: string,
      key: string | null,
      parent: Record<string, unknown> | null,
    ) => {
      if (typeof value === 'string') {
        checkOneString(value, path, key, parent);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item, i) => visit(item, `${path}.${i}`, key, parent));
        return;
      }
      if (isObject(value)) {
        for (const [childKey, child] of Object.entries(value)) {
          visit(
            child,
            path ? `${path}.${childKey}` : childKey,
            childKey,
            value,
          );
        }
      }
    };

    const checkOneString = (
      text: string,
      path: string,
      key: string | null,
      parent: Record<string, unknown> | null,
    ) => {
      if (text.trim() === '') {
        error('empty-string', file, path, 'Empty string.');
        return;
      }
      for (const token of englishTokens(text)) {
        if (GUJARATI_LETTER.test(token)) {
          error(
            'english-has-gujarati',
            file,
            path,
            `Gujarati letters inside an {{en:...}} marker: "${token}".`,
          );
        }
      }
      if (key === null) return;
      if (isGujaratiField(key)) {
        if (!GUJARATI_LETTER.test(text)) {
          error(
            'gujarati-missing',
            file,
            path,
            `Gujarati field "${key}" has no Gujarati letters: "${text}".`,
          );
        }
        if (LATIN_LETTER.test(withoutEnglishTokens(text)))
          strayLatin.push(path);
        return;
      }
      const englishMistakeSide =
        parent?.['type'] === 'mistake' && (key === 'wrong' || key === 'right');
      if (
        (ENGLISH_KEYS.has(key) || englishMistakeSide) &&
        GUJARATI_LETTER.test(text)
      ) {
        error(
          'english-has-gujarati',
          file,
          path,
          `English field "${key}" has Gujarati letters: "${text}".`,
        );
      }
    };

    visit(files[file], '', null, null);

    if (strayLatin.length > 0) {
      warnings.push({
        rule: 'latin-outside-en',
        file,
        path: strayLatin[0] ?? '',
        message: `${strayLatin.length} Gujarati field(s) have English letters outside {{en:...}} markers, e.g. at ${strayLatin.slice(0, 5).join(', ')}.`,
      });
    }
  }
}

// ---------------------------------------------------------------- IDs

function topicCode(topicId: string): string {
  const match = /^p(\d)-t(\d{2})$/.exec(topicId);
  return match ? `P${match[1]}.${Number(match[2])}` : '';
}

/** ID formats (7.3) and uniqueness across all files. */
function checkIds(parsed: ParsedContent, error: ReportError): void {
  const seen = new Map<string, string>();
  const unique = (id: string, file: string, path: string) => {
    const first = seen.get(id);
    if (first) {
      error(
        'id-unique',
        file,
        path,
        `Duplicate id "${id}" (first used at ${first}).`,
      );
    } else {
      seen.set(id, `${file}:${path}`);
    }
  };
  const format = (
    ok: boolean,
    id: string,
    file: string,
    path: string,
    expected: string,
  ) => {
    if (!ok)
      error(
        'id-format',
        file,
        path,
        `Id "${id}" is wrong. Expected ${expected}.`,
      );
  };

  if (parsed.phases) {
    const { file, data } = parsed.phases;
    data.phases.forEach((phase, pi) => {
      const pp = `phases.${pi}`;
      format(ID.phase.test(phase.id), phase.id, file, `${pp}.id`, 'p{n}');
      unique(phase.id, file, `${pp}.id`);
      format(
        phase.finalTestId === `${phase.id}-final`,
        phase.finalTestId,
        file,
        `${pp}.finalTestId`,
        `${phase.id}-final`,
      );
      phase.topics.forEach((topic, ti) => {
        const tp = `${pp}.topics.${ti}`;
        format(
          ID.topic.test(topic.id),
          topic.id,
          file,
          `${tp}.id`,
          'p{n}-t{nn}',
        );
        format(
          topic.id.startsWith(`${phase.id}-`),
          topic.id,
          file,
          `${tp}.id`,
          `an id starting with ${phase.id}-`,
        );
        unique(topic.id, file, `${tp}.id`);
        format(
          topic.code === topicCode(topic.id),
          topic.code,
          file,
          `${tp}.code`,
          `the code ${topicCode(topic.id)} (matching ${topic.id})`,
        );
      });
    });
  }

  for (const { file, data, topicId } of parsed.lessons) {
    if (data.topicId !== topicId) {
      error(
        'file-name',
        file,
        'topicId',
        `topicId "${data.topicId}" does not match the file name (${topicId}).`,
      );
    }
    data.lessons.forEach((lesson, li) => {
      const lp = `lessons.${li}`;
      format(
        ID.lesson.test(lesson.id),
        lesson.id,
        file,
        `${lp}.id`,
        '{topicId}-l{nn}',
      );
      format(
        lesson.id.startsWith(`${lesson.topicId}-l`),
        lesson.id,
        file,
        `${lp}.id`,
        `an id starting with ${lesson.topicId}-l`,
      );
      unique(lesson.id, file, `${lp}.id`);
      if (lesson.topicId !== topicId) {
        error(
          'file-name',
          file,
          `${lp}.topicId`,
          `Lesson topicId "${lesson.topicId}" does not match the file name (${topicId}).`,
        );
      }
      const items: [string, string, string][] = [
        ...lesson.practice.map((e, i): [string, string, string] => [
          e.id,
          'practice',
          `${lp}.practice.${i}.id`,
        ]),
        ...lesson.speak.map((e, i): [string, string, string] => [
          e.id,
          'speak',
          `${lp}.speak.${i}.id`,
        ]),
        ...lesson.write.map((e, i): [string, string, string] => [
          e.id,
          'write',
          `${lp}.write.${i}.id`,
        ]),
        ...lesson.quiz.map((e, i): [string, string, string] => [
          e.id,
          'quiz',
          `${lp}.quiz.${i}.id`,
        ]),
      ];
      for (const [id, section, path] of items) {
        format(
          new RegExp(`^${escapeRegExp(lesson.id)}-${section}-\\d{2}$`).test(id),
          id,
          file,
          path,
          `${lesson.id}-${section}-{nn}`,
        );
        unique(id, file, path);
      }
    });
  }

  for (const { file, data, phaseId } of parsed.vocab) {
    data.words.forEach((word, wi) => {
      const wp = `words.${wi}`;
      format(
        ID.word.test(word.id),
        word.id,
        file,
        `${wp}.id`,
        'w-{english-kebab}',
      );
      unique(word.id, file, `${wp}.id`);
      if (word.phaseId !== phaseId) {
        error(
          'file-name',
          file,
          `${wp}.phaseId`,
          `Word phaseId "${word.phaseId}" does not match the file name (${phaseId}).`,
        );
      }
    });
  }

  if (parsed.videos) {
    const { file, data } = parsed.videos;
    data.videos.forEach((video, vi) => {
      const vp = `videos.${vi}`;
      format(
        ID.video.test(video.id),
        video.id,
        file,
        `${vp}.id`,
        'v-{11-character YouTube ID}',
      );
      format(
        video.id === `v-${video.youtubeId}`,
        video.id,
        file,
        `${vp}.id`,
        `v-${video.youtubeId}`,
      );
      unique(video.id, file, `${vp}.id`);
      video.checkQuestions.forEach((q, qi) =>
        unique(q.id, file, `${vp}.checkQuestions.${qi}.id`),
      );
    });
  }

  for (const { file, data, testId } of parsed.tests) {
    if (data.id !== testId) {
      error(
        'file-name',
        file,
        'id',
        `Test id "${data.id}" does not match the file name (${testId}).`,
      );
    }
    format(ID.test.test(data.id), data.id, file, 'id', 'p{n}-final');
    unique(data.id, file, 'id');
    const sectionIds = new Set<string>();
    data.sections.forEach((section, si) => {
      const sp = `sections.${si}`;
      if (sectionIds.has(section.id)) {
        error(
          'id-unique',
          file,
          `${sp}.id`,
          `Duplicate section id "${section.id}" in this test.`,
        );
      }
      sectionIds.add(section.id);
      const items: [string, string][] = [
        ...(section.exercises ?? []).map((e, i): [string, string] => [
          e.id,
          `${sp}.exercises.${i}.id`,
        ]),
        ...(section.write ?? []).map((e, i): [string, string] => [
          e.id,
          `${sp}.write.${i}.id`,
        ]),
        ...(section.speak ?? []).map((e, i): [string, string] => [
          e.id,
          `${sp}.speak.${i}.id`,
        ]),
      ];
      for (const [id, path] of items) {
        format(
          new RegExp(
            `^${escapeRegExp(data.id)}-${escapeRegExp(section.id)}-\\d{2}$`,
          ).test(id),
          id,
          file,
          path,
          `${data.id}-${section.id}-{nn}`,
        );
        unique(id, file, path);
      }
    });
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --------------------------------------------------------- references

function checkReferences(parsed: ParsedContent, error: ReportError): void {
  const phaseIds = new Set(parsed.phases?.data.phases.map((p) => p.id) ?? []);
  const topicIds = new Set(
    parsed.phases?.data.phases.flatMap((p) => p.topics.map((t) => t.id)) ?? [],
  );
  const wordIds = new Set(
    parsed.vocab.flatMap((v) => v.data.words.map((w) => w.id)),
  );
  const videoIds = new Set(parsed.videos?.data.videos.map((v) => v.id) ?? []);
  const testIds = new Set(parsed.tests.map((t) => t.data.id));
  const gsIds = new Set(GS_IDS);

  const ref = (
    set: Set<string>,
    what: string,
    id: string,
    file: string,
    path: string,
  ) => {
    if (!set.has(id)) {
      error('ref-missing', file, path, `${what} "${id}" does not exist.`);
    }
  };

  if (parsed.phases) {
    const { file, data } = parsed.phases;
    data.phases.forEach((phase, pi) => {
      ref(
        testIds,
        'finalTestId',
        phase.finalTestId,
        file,
        `phases.${pi}.finalTestId`,
      );
      phase.topics.forEach((topic, ti) => {
        topic.videoIds.forEach((id, i) =>
          ref(
            videoIds,
            'videoId',
            id,
            file,
            `phases.${pi}.topics.${ti}.videoIds.${i}`,
          ),
        );
      });
    });
  }

  for (const { file, data } of parsed.lessons) {
    data.lessons.forEach((lesson, li) => {
      const lp = `lessons.${li}`;
      ref(topicIds, 'topicId', lesson.topicId, file, `${lp}.topicId`);
      lesson.videoIds.forEach((id, i) =>
        ref(videoIds, 'videoId', id, file, `${lp}.videoIds.${i}`),
      );
      lesson.newWordIds.forEach((id, i) =>
        ref(wordIds, 'newWordId', id, file, `${lp}.newWordIds.${i}`),
      );
      lesson.targetsMistakes.forEach((id, i) =>
        ref(
          gsIds,
          'targetsMistakes id',
          id,
          file,
          `${lp}.targetsMistakes.${i}`,
        ),
      );
      lesson.explanation.forEach((block, bi) => {
        if (block.type === 'mistake' && block.gsId !== undefined) {
          ref(gsIds, 'gsId', block.gsId, file, `${lp}.explanation.${bi}.gsId`);
        }
      });
    });
  }

  for (const { file, data } of parsed.vocab) {
    data.words.forEach((word, wi) => {
      ref(phaseIds, 'phaseId', word.phaseId, file, `words.${wi}.phaseId`);
      ref(topicIds, 'topicId', word.topicId, file, `words.${wi}.topicId`);
    });
  }

  if (parsed.videos) {
    const { file, data } = parsed.videos;
    data.videos.forEach((video, vi) => {
      video.topicIds.forEach((id, i) =>
        ref(topicIds, 'topicId', id, file, `videos.${vi}.topicIds.${i}`),
      );
      video.keyWordIds.forEach((id, i) =>
        ref(wordIds, 'keyWordId', id, file, `videos.${vi}.keyWordIds.${i}`),
      );
    });
  }

  for (const { file, data } of parsed.tests) {
    ref(phaseIds, 'phaseId', data.phaseId, file, 'phaseId');
  }
}

// ------------------------------------------------------------- phases

/** recommendedOrder holds every lesson of the phase exactly once, keeping each topic's order. */
function checkPhases(parsed: ParsedContent, error: ReportError): void {
  if (!parsed.phases) return;
  const { file, data } = parsed.phases;
  const lessons = parsed.lessons.flatMap((entry) => entry.data.lessons);

  data.phases.forEach((phase, pi) => {
    const path = `phases.${pi}.recommendedOrder`;
    const topicIds = new Set(phase.topics.map((t) => t.id));
    const phaseLessons = lessons.filter((l) => topicIds.has(l.topicId));
    const phaseLessonIds = new Set(phaseLessons.map((l) => l.id));

    const seen = new Set<string>();
    for (const id of phase.recommendedOrder) {
      if (seen.has(id)) {
        error(
          'order-complete',
          file,
          path,
          `Lesson "${id}" appears more than once.`,
        );
      }
      seen.add(id);
      if (!phaseLessonIds.has(id)) {
        error(
          'order-complete',
          file,
          path,
          `"${id}" is not a lesson of phase ${phase.id}.`,
        );
      }
    }
    for (const id of phaseLessonIds) {
      if (!seen.has(id)) {
        error(
          'order-complete',
          file,
          path,
          `Lesson "${id}" is missing from the order.`,
        );
      }
    }

    for (const topicId of topicIds) {
      const inOrder = phaseLessons
        .filter((l) => l.topicId === topicId)
        .sort((a, b) => a.order - b.order)
        .map((l) => phase.recommendedOrder.indexOf(l.id))
        .filter((index) => index >= 0);
      const sorted = [...inOrder].sort((a, b) => a - b);
      if (inOrder.some((index, i) => index !== sorted[i])) {
        error(
          'order-sequence',
          file,
          path,
          `Lessons of topic ${topicId} are not in their own order.`,
        );
      }
    }
  });
}

// ------------------------------------------------------------ lessons

function checkLessons(
  parsed: ParsedContent,
  error: ReportError,
  warnings: Issue[],
): void {
  for (const { file, data } of parsed.lessons) {
    data.lessons.forEach((lesson, li) => {
      const lp = `lessons.${li}`;
      checkLessonCounts(lesson, file, lp, error);
      lesson.practice.forEach((e, i) =>
        checkExercise(e, file, `${lp}.practice.${i}`, error),
      );
      lesson.quiz.forEach((e, i) =>
        checkExercise(e, file, `${lp}.quiz.${i}`, error),
      );

      const phaseId = lesson.topicId.slice(0, 2);
      const limit = MAX_NEW_WORDS[phaseId];
      if (limit !== undefined && lesson.newWordIds.length > limit) {
        warnings.push({
          rule: 'new-words-limit',
          file,
          path: `${lp}.newWordIds`,
          message: `Lesson ${lesson.id} has ${lesson.newWordIds.length} new words. The limit for ${phaseId} is ${limit}.`,
        });
      }
    });
  }
}

function checkLessonCounts(
  lesson: Lesson,
  file: string,
  lp: string,
  error: ReportError,
): void {
  if (lesson.estimatedMinutes < 15 || lesson.estimatedMinutes > 35) {
    error(
      'lesson-minutes',
      file,
      `${lp}.estimatedMinutes`,
      `estimatedMinutes must be 15 to 35, got ${lesson.estimatedMinutes}.`,
    );
  }
  if (lesson.examples.length < 5) {
    error(
      'count-examples',
      file,
      `${lp}.examples`,
      `At least 5 examples needed, got ${lesson.examples.length}.`,
    );
  }
  if (lesson.practice.length < 6 || lesson.practice.length > 12) {
    error(
      'count-practice',
      file,
      `${lp}.practice`,
      `6 to 12 practice exercises needed, got ${lesson.practice.length}.`,
    );
  }
  if (lesson.speak.length < 3 || lesson.speak.length > 6) {
    error(
      'count-speak',
      file,
      `${lp}.speak`,
      `3 to 6 speak items needed, got ${lesson.speak.length}.`,
    );
  }
  if (lesson.write.length < 1 || lesson.write.length > 3) {
    error(
      'count-write',
      file,
      `${lp}.write`,
      `1 to 3 write tasks needed, got ${lesson.write.length}.`,
    );
  }
  if (lesson.quiz.length !== 5) {
    error(
      'count-quiz',
      file,
      `${lp}.quiz`,
      `Exactly 5 quiz questions needed, got ${lesson.quiz.length}.`,
    );
  }
}

function checkExercise(
  exercise: Exercise,
  file: string,
  path: string,
  error: ReportError,
): void {
  switch (exercise.type) {
    case 'mcq':
    case 'listenChoose': {
      if (exercise.options.length < 2 || exercise.options.length > 4) {
        error(
          'mcq-options',
          file,
          `${path}.options`,
          `2 to 4 options needed, got ${exercise.options.length}.`,
        );
      }
      if (exercise.answer < 0 || exercise.answer >= exercise.options.length) {
        error(
          'mcq-answer',
          file,
          `${path}.answer`,
          `Answer index ${exercise.answer} is not one of the ${exercise.options.length} options.`,
        );
      }
      break;
    }
    case 'match': {
      if (exercise.pairs.length < 3 || exercise.pairs.length > 6) {
        error(
          'match-pairs',
          file,
          `${path}.pairs`,
          `3 to 6 pairs needed, got ${exercise.pairs.length}.`,
        );
      }
      break;
    }
    case 'fill': {
      const blanks = exercise.sentence.split('___').length - 1;
      if (blanks !== 1) {
        error(
          'fill-blank',
          file,
          `${path}.sentence`,
          `The sentence needs exactly one "___", found ${blanks}.`,
        );
      }
      break;
    }
    case 'order': {
      const joined = normalizeAnswer(exercise.tiles.join(' '));
      if (
        !exercise.answers.some((answer) => normalizeAnswer(answer) === joined)
      ) {
        error(
          'order-tiles',
          file,
          `${path}.tiles`,
          `The tiles joined with spaces ("${joined}") match none of the accepted answers.`,
        );
      }
      break;
    }
    default:
      break;
  }
}

// ------------------------------------------------------------- videos

function checkVideos(parsed: ParsedContent, error: ReportError): void {
  if (!parsed.videos) return;
  const { file, data } = parsed.videos;
  data.videos.forEach((video, vi) => {
    const vp = `videos.${vi}`;
    if (!ID.youtube.test(video.youtubeId)) {
      error(
        'youtube-id',
        file,
        `${vp}.youtubeId`,
        `"${video.youtubeId}" is not an 11-character YouTube ID.`,
      );
    }
    if (video.status !== 'candidate') {
      if (!video.reviewedBy || !video.reviewedAt) {
        error(
          'review-fields',
          file,
          vp,
          `A ${video.status} video needs reviewedBy and reviewedAt.`,
        );
      }
    }
    if (video.checkQuestions.length > 3) {
      error(
        'count-check-questions',
        file,
        `${vp}.checkQuestions`,
        `0 to 3 check questions allowed, got ${video.checkQuestions.length}.`,
      );
    }
    video.checkQuestions.forEach((q, qi) =>
      checkExercise(q, file, `${vp}.checkQuestions.${qi}`, error),
    );
  });
}

// -------------------------------------------------------------- tests

function checkTests(parsed: ParsedContent, error: ReportError): void {
  for (const { file, data } of parsed.tests) {
    data.sections.forEach((section, si) => {
      (section.exercises ?? []).forEach((e, i) =>
        checkExercise(e, file, `sections.${si}.exercises.${i}`, error),
      );
    });
  }
}

// ----------------------------------------------------------- warnings

function addWarnings(parsed: ParsedContent, warnings: Issue[]): void {
  const lessons = parsed.lessons.flatMap((entry) => entry.data.lessons);

  const unreviewed = lessons.filter((l) => !l.reviewedGu).map((l) => l.id);
  if (unreviewed.length > 0) {
    warnings.push({
      rule: 'unreviewed-gu',
      file: '',
      path: '',
      message: `${unreviewed.length} lesson(s) have reviewedGu: false (Gujarati not checked by a native speaker yet): ${unreviewed.join(', ')}.`,
    });
  }

  if (parsed.phases) {
    const approved = new Set(
      (parsed.videos?.data.videos ?? [])
        .filter((v) => v.status === 'approved')
        .map((v) => v.id),
    );
    const topics = parsed.phases.data.phases.flatMap((p) => p.topics);
    const without = topics
      .filter((t) => !t.videoIds.some((id) => approved.has(id)))
      .map((t) => t.id);
    if (without.length > 0) {
      warnings.push({
        rule: 'no-approved-video',
        file: '',
        path: '',
        message: `${without.length} topic(s) have no approved video: ${without.join(', ')}.`,
      });
    }
  }

  const covered = new Set(lessons.flatMap((l) => l.targetsMistakes));
  const uncovered = GS_IDS.filter((id) => !covered.has(id));
  if (uncovered.length > 0) {
    warnings.push({
      rule: 'gs-uncovered',
      file: '',
      path: '',
      message: `${uncovered.length} Gujarati-speaker problem(s) are not covered by any lesson yet: ${uncovered.join(', ')}.`,
    });
  }

  const used = new Set(lessons.flatMap((l) => l.newWordIds));
  const unused = parsed.vocab
    .flatMap((v) => v.data.words)
    .filter((w) => !used.has(w.id))
    .map((w) => w.id);
  if (unused.length > 0) {
    warnings.push({
      rule: 'vocab-unused',
      file: '',
      path: '',
      message: `${unused.length} vocab word(s) are not used in any lesson: ${unused.join(', ')}.`,
    });
  }

  const emptyTests = parsed.tests
    .filter((t) => t.data.sections.length === 0)
    .map((t) => t.data.id);
  if (emptyTests.length > 0) {
    warnings.push({
      rule: 'test-empty',
      file: '',
      path: '',
      message: `${emptyTests.length} test file(s) have no sections yet: ${emptyTests.join(', ')}.`,
    });
  }
}
