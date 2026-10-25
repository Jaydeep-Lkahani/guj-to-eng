/**
 * EVERY Gujarati UI string lives here (pending.md 7.10).
 * Address the learner with respectful "તમે" and plural verb forms.
 * Use English digits 0-9 everywhere.
 */

/** The exact terms from the glossary in pending.md 7.10. */
const glossary = {
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
} as const;

export const gu = {
  appName: 'અંગ્રેજી શીખો',
  glossary,

  nav: {
    ariaLabel: 'મુખ્ય મેનુ',
    home: glossary.home,
    learn: glossary.learn,
    review: glossary.review,
    progress: glossary.progress,
    more: glossary.more,
  },

  /** The Gujarati title shown at the top of each page (routes in pending.md 7.8). */
  pages: {
    dashboard: glossary.home,
    welcome: 'સ્વાગત',
    learn: glossary.learn,
    topic: glossary.topic,
    lesson: glossary.lesson,
    review: glossary.review,
    practice: glossary.practice,
    test: glossary.finalTest,
    progress: glossary.progress,
    more: glossary.more,
    videos: glossary.video,
    words: glossary.myWords,
    mistakes: glossary.mistakes,
    settings: glossary.settings,
    help: glossary.help,
    notFound: 'પાનું મળ્યું નથી',
  },

  placeholder: {
    comingSoon: 'આ પાનું ટૂંક સમયમાં તૈયાર થશે.',
  },

  /** Shared loading, empty and error states (pending.md 7.9). */
  states: {
    loading: 'લોડ થઈ રહ્યું છે…',
    empty: 'અહીં હજી કંઈ નથી.',
    errorTitle: 'કંઈક ગડબડ થઈ ગઈ',
    errorMessage: 'પણ વાંધો નહીં! હોમ પર જાઓ અને ફરી પ્રયત્ન કરો.',
  },

  notFound: {
    message:
      'તમે જે પાનું શોધી રહ્યા છો તે અહીં નથી. ચિંતા ન કરો, હોમ પર પાછા જઈએ.',
    homeButton: glossary.home,
  },
} as const;

export type Gu = typeof gu;
