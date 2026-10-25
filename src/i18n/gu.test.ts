import { describe, expect, it } from 'vitest';
import { gu } from './gu';

/** The glossary table from pending.md 7.10, typed out independently of gu.ts. */
const SPEC_GLOSSARY: Record<keyof typeof gu.glossary, string> = {
  home: 'હોમ',
  learn: 'શીખો',
  review: 'પુનરાવર્તન',
  progress: 'પ્રગતિ',
  more: 'વધુ',
  phase: 'તબક્કો',
  topic: 'વિષય',
  lesson: 'પાઠ',
  todaysLesson: 'આજનો પાઠ',
  video: 'વિડિયો',
  practice: 'અભ્યાસ',
  quiz: 'ક્વિઝ',
  finalTest: 'પરીક્ષા',
  words: 'શબ્દો',
  myWords: 'મારા શબ્દો',
  mistakes: 'ભૂલો',
  notes: 'નોંધ',
  settings: 'સેટિંગ્સ',
  help: 'મદદ',
  backup: 'બેકઅપ',
  commonMistake: 'સામાન્ય ભૂલ',
  next: 'આગળ',
  back: 'પાછળ',
  check: 'તપાસો',
  continue: 'ચાલુ રાખો',
  start: 'શરૂ કરો',
  moveOn: 'આગળ વધો',
  listen: 'સાંભળો',
  listenSlowly: 'ધીમે સાંભળો',
  speak: 'બોલો',
  write: 'લખો',
  record: 'રેકોર્ડ કરો',
  correct: 'સાચું!',
  wrong: 'ખોટું',
  tryAgain: 'ફરી પ્રયત્ન કરો',
  wellDone: 'શાબાશ!',
  completed: 'પૂર્ણ',
  locked: 'લૉક',
  watched: 'જોયેલું',
  streak: 'સળંગ દિવસ',
  iKnewIt: 'મને આવડ્યું',
  showAgain: 'ફરી બતાવો',
};

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (typeof value === 'object' && value !== null)
    return Object.values(value).flatMap(collectStrings);
  return [];
}

describe('gu glossary', () => {
  it('has all 42 terms from pending.md 7.10, spelled exactly', () => {
    expect(Object.keys(SPEC_GLOSSARY)).toHaveLength(42);
    expect(gu.glossary).toEqual(SPEC_GLOSSARY);
  });
});

describe('gu strings', () => {
  const strings = collectStrings(gu);

  it('are never empty', () => {
    for (const text of strings) expect(text.trim()).not.toBe('');
  });

  it('contain Gujarati letters and no Latin letters', () => {
    for (const text of strings) {
      expect(text, text).toMatch(/[઀-૿]/);
      expect(text, text).not.toMatch(/[A-Za-z]/);
    }
  });

  it('use English digits only', () => {
    for (const text of strings) expect(text, text).not.toMatch(/[૦-૯]/);
  });

  it('give every route page a title', () => {
    expect(Object.keys(gu.pages)).toHaveLength(16);
  });
});
