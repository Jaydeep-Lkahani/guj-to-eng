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

  learn: {
    lessonCount: (count: number) => `${count} ${glossary.lesson}`,
    lessonsComingSoon: 'ટૂંક સમયમાં',
    completedCount: (done: number, total: number) =>
      `${done}/${total} ${glossary.completed}`,
    phaseLocked: 'આ તબક્કો હજી લૉક છે. પહેલાં પાછલા તબક્કાની પરીક્ષા પાસ કરો.',
  },

  topic: {
    notFoundTitle: 'વિષય મળ્યો નથી',
    notFoundMessage:
      'આ વિષય અહીં નથી. ચિંતા ન કરો, શીખો પાનામાંથી બીજો વિષય પસંદ કરો.',
    noVideo: 'આ વિષયનો વિડિયો ટૂંક સમયમાં આવશે',
    noLessons: 'આ વિષયના પાઠ ટૂંક સમયમાં આવશે',
    minutes: (count: number) => `${count} મિનિટ`,
    statusInProgress: 'ચાલુ છે',
    lockReason: {
      previousLesson: 'પહેલાં પાછલો પાઠ પૂરો કરો.',
      previousPhaseTest: 'પહેલાં પાછલા તબક્કાની પરીક્ષા પાસ કરો.',
    },
  },

  lesson: {
    notFoundTitle: 'પાઠ મળ્યો નથી',
    notFoundMessage:
      'આ પાઠ અહીં નથી. ચિંતા ન કરો, શીખો પાનામાંથી બીજો પાઠ પસંદ કરો.',
    lockedTitle: 'આ પાઠ હજી લૉક છે',
    lockReason: {
      previousLesson: 'આ પાઠ ખોલવા માટે પહેલાં પાછલો પાઠ પૂરો કરો.',
      previousPhaseTest:
        'આ પાઠ ખોલવા માટે પહેલાં પાછલા તબક્કાની પરીક્ષા પાસ કરો.',
    },
    backToTopic: 'વિષય પર પાછા જાઓ',
    stepLabel: (step: number, total: number) => `પગલું ${step} / ${total}`,
    progressAria: 'પાઠની પ્રગતિ',
    stepNames: {
      1: 'ફરી યાદ કરો',
      2: 'વિડિયો જુઓ',
      3: 'સમજૂતી',
      4: 'ઉદાહરણો',
      5: glossary.practice,
      6: glossary.speak,
      7: glossary.write,
      8: glossary.quiz,
      9: 'આજે વાપરો',
    },
    translitShow: 'ઉચ્ચાર જુઓ',
    watchTopicVideosAgain: 'વિષયના વિડિયો ફરી જુઓ',
    warmup: {
      intro:
        'પહેલાં થોડું જૂનું યાદ કરીએ. આ ફક્ત યાદ કરવા માટે છે, તેના ગુણ ગણાતા નથી.',
      cardQuestion: 'આ શબ્દનો અર્થ યાદ છે?',
      showAnswer: 'જવાબ જુઓ',
    },
    video: {
      hint: 'પહેલાં વિડિયો જુઓ, પછી નીચેનો પાઠ વાંચો. વિડિયો ન જોઈ શકો તો પણ પાઠ ચાલુ રાખી શકો છો.',
    },
    examples: {
      intro: 'દરેક ઉદાહરણ સાંભળો અને મોટેથી બોલો.',
    },
    practice: {
      counter: (n: number, total: number) => `પ્રશ્ન ${n} / ${total}`,
    },
    speak: {
      intro:
        'દરેક વાક્ય સાંભળો, પછી મોટેથી બોલો. પહેલાં ધીમે સાંભળવું સારું પડે છે.',
    },
    write: {
      typeLabel: 'તમારો જવાબ લખો',
      submit: 'જમા કરો',
      modelTitle: 'નમૂનાનો જવાબ',
      minWords: (count: number) => `ઓછામાં ઓછા ${count} શબ્દ લખો.`,
      wordCount: (count: number) => `${count} શબ્દ લખ્યા`,
      saved: 'તમારું લખાણ સાચવાઈ ગયું છે. હવે નમૂના સાથે સરખાવો.',
      handwriteIntro:
        'આ અક્ષરો કાગળ પર લખવાનો અભ્યાસ કરો. દરેક અક્ષર ઓછામાં ઓછા 3 વાર લખો.',
    },
    quiz: {
      intro: 'હવે 5 પ્રશ્નોની ક્વિઝ. દરેક પ્રશ્ન એક જ વાર પૂછાશે.',
      counter: (n: number, total: number) => `પ્રશ્ન ${n} / ${total}`,
      score: (score: number, total: number) =>
        `તમારો સ્કોર: ${score} / ${total}`,
      passed: 'શાબાશ! તમે આ પાઠ પૂરો કર્યો.',
      failed:
        'વાંધો નહીં! થોડી વધુ મહેનતથી જરૂર આવડશે. પાઠ પૂરો કરવા માટે ઓછામાં ઓછા 3 જવાબ સાચા જોઈએ.',
      again: 'ક્વિઝ ફરી આપો',
      reread: 'પાઠ ફરી વાંચો',
    },
    useToday: {
      title: 'આજે ઘરે બોલો',
      completed: 'તમે આ પાઠ પૂરો કર્યો.',
      nextLesson: 'આગળનો પાઠ',
    },
  },

  exercise: {
    wrongPrefix: 'ખોટું, પણ વાંધો નહીં! સાચો જવાબ:',
    capitalTip: 'વાક્યની શરૂઆત કૅપિટલ અક્ષરથી કરો',
    trueLabel: 'સાચું',
    falseLabel: glossary.wrong,
    answerLabel: 'તમારો જવાબ',
    tilesAnswer: 'તમારું વાક્ય',
    tilesHint: 'નીચેના શબ્દો દબાવીને વાક્ય બનાવો.',
    tilesPool: glossary.words,
    matchHint: 'ડાબી બાજુનો એક શબ્દ દબાવો, પછી જમણી બાજુથી તેની જોડી દબાવો.',
    matchLeft: 'પહેલી યાદી',
    matchRight: 'બીજી યાદી',
    matchDone: 'બધી જોડી મળી ગઈ.',
    audioFallback: 'અવાજ ચાલતો નથી, એટલે શબ્દ અહીં લખેલો છે:',
  },

  audio: {
    listen: glossary.listen,
    listenSlowly: glossary.listenSlowly,
    noVoiceBefore:
      'આ ફોનમાં અંગ્રેજી અવાજ મળ્યો નથી, એટલે સાંભળવાના બટન છુપાવ્યા છે. અંગ્રેજી અવાજ ઉમેરવા માટે ફોનમાં',
    noVoiceAfter: 'ખોલીને અંગ્રેજી ભાષા ડાઉનલોડ કરો.',
  },

  video: {
    offline: 'વિડિયો જોવા માટે ઇન્ટરનેટ જોઈએ',
    offlineNote: 'પાઠ વાંચવાનું ચાલુ રાખી શકો છો.',
    loading: 'વિડિયો લોડ થઈ રહ્યો છે…',
    speedGroup: 'વિડિયોની ઝડપ',
    watched: glossary.watched,
    tryAgain: glossary.tryAgain,
  },

  progressSafety: {
    saveProblemTitle: 'તમારી પ્રગતિ સેવ થઈ શકતી નથી',
    saveProblemMessage:
      'બ્રાઉઝરમાં સ્ટોરેજ બંધ અથવા ભરેલું હોઈ શકે છે (જેમ કે પ્રાઇવેટ વિન્ડોમાં). આ પાનું બંધ કરશો તો પ્રગતિ જતી રહેશે.',
    brokenTitle: 'તમારી પ્રગતિ વાંચી શકાઈ નથી',
    brokenMessage:
      'ચિંતા ન કરો, તમારી જૂની માહિતી ભૂંસાઈ નથી. અમે તેની એક નકલ બ્રાઉઝરમાં સુરક્ષિત રાખી છે. પહેલાં બેકઅપ ડાઉનલોડ કરી લો, પછી જ નવેસરથી શરૂ કરો.',
    downloadBackup: `${glossary.backup} ડાઉનલોડ કરો`,
    startFresh: 'નવેસરથી શરૂ કરો',
    confirmTitle: 'ખરેખર નવેસરથી શરૂ કરવું છે?',
    confirmMessage:
      'નવી પ્રગતિ ખાલી હશે. જૂની માહિતી બ્રાઉઝરમાં સુરક્ષિત રહેશે, પણ તમે તેને આ સાઇટ પર જોઈ શકશો નહીં.',
    confirmYes: 'હા, નવેસરથી શરૂ કરો',
    confirmNo: 'ના, પાછા જાઓ',
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

/** Signs and device terms that are not Gujarati words. Shown inside the UI, never typed in components. */
export const symbols = {
  right: '✔',
  wrong: '✖',
  speedSlow: '0.75x',
  speedNormal: '1x',
} as const;

/** Names of settings on the learner's phone. They appear in English there, so they are shown in <En>. */
export const deviceTerms = {
  textToSpeechPath: 'Settings → Text-to-speech',
} as const;

export type Gu = typeof gu;
