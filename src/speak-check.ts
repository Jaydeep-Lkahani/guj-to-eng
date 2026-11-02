// Checks what the phone heard against the sentence she was asked to say.
// Both sides are cleaned up the same way (small letters, no punctuation, "I'm" → "i am",
// "4" → "four"), then we count how many of the sentence's words were heard, in order.

// She passes when at least this share of the words was heard.
export const PASS_SCORE = 0.8;

// Contractions with their own long form. The rest follow the general rules in `expand`.
const SPECIAL: Record<string, string> = {
  "won't": "will not",
  "can't": "can not",
  cannot: "can not",
  "shan't": "shall not",
  "let's": "let us",
  "ain't": "is not",
};

// "'s" means "is" only after these words. After a name it shows who owns something ("Ravi's").
const S_IS = new Set(["it", "he", "she", "that", "there", "what", "where", "who", "how", "here", "this"]);

// Speech engines and lessons don't always spell a word the same way.
const SAME_WORD: Record<string, string> = {
  ok: "okay",
  color: "colour",
  colors: "colours",
  favorite: "favourite",
  neighbor: "neighbour",
  neighbors: "neighbours",
  center: "centre",
  theater: "theatre",
  mom: "mum",
  mommy: "mummy",
};

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

// 0 to 9999 as words: 25 → "twenty five", 1947 → "nineteen forty seven".
export function numberWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000) {
    const rest = n % 100;
    return ONES[Math.floor(n / 100)] + " hundred" + (rest ? " " + numberWords(rest) : "");
  }
  // Years are said in two halves ("nineteen forty seven"); round thousands as "two thousand".
  if (n % 1000 === 0) return ONES[n / 1000] + " thousand";
  const high = Math.floor(n / 100);
  const low = n % 100;
  if (n < 2000 || n >= 2010) return numberWords(high) + " " + (low === 0 ? "hundred" : low < 10 ? "oh " + ONES[low] : numberWords(low));
  return "two thousand " + ONES[n % 1000];
}

const ORDINAL: Record<string, string> = {
  one: "first", two: "second", three: "third", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth",
};

// 5 → "fifth", 21 → "twenty first", 30 → "thirtieth".
function ordinalWords(n: number): string {
  const words = numberWords(n).split(" ");
  const last = words.pop()!;
  const ord = ORDINAL[last] ?? (last.endsWith("y") ? last.slice(0, -1) + "ieth" : last + "th");
  return [...words, ord].join(" ");
}

// One word (no spaces) → its long form, e.g. "don't" → "do not", "4:30" → "four thirty".
function expand(word: string): string {
  if (SPECIAL[word]) return SPECIAL[word];

  const time = /^(\d{1,2}):(\d{2})$/.exec(word);
  if (time) {
    const min = Number(time[2]);
    const minutes = min === 0 ? "" : min < 10 ? " oh " + ONES[min] : " " + numberWords(min);
    return numberWords(Number(time[1])) + minutes;
  }
  const ordinal = /^(\d{1,4})(st|nd|rd|th)$/.exec(word);
  if (ordinal) return ordinalWords(Number(ordinal[1]));
  if (/^\d{1,4}$/.test(word)) return numberWords(Number(word));

  let m = /^(.+)n't$/.exec(word);
  if (m) return m[1] + " not";
  m = /^(.+)'(m|re|ve|ll|d)$/.exec(word);
  if (m) return m[1] + " " + { m: "am", re: "are", ve: "have", ll: "will", d: "would" }[m[2]];
  m = /^(.+)'s$/.exec(word);
  if (m && S_IS.has(m[1])) return m[1] + " is";
  return word;
}

// A piece of text → its words, cleaned the same way for both sides.
export function speechWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[‘’`´]/g, "'")
    .replace(/&/g, " and ")
    .replace(/[-–—/]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, "")) // punctuation at the edges ("tea." → "tea")
    .flatMap((w) => expand(w).split(" "))
    .map((w) => w.replace(/[^a-z0-9]/g, "")) // what's left: "o'clock" → "oclock", "p.m" → "pm"
    .filter(Boolean)
    .map((w) => SAME_WORD[w] ?? w);
}

// Which of the target words also appear in `heard`, in the same order (longest common run of words).
function matchedPositions(target: string[], heard: string[]): boolean[] {
  const rows = target.length + 1;
  const cols = heard.length + 1;
  const len = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  for (let i = target.length - 1; i >= 0; i--) {
    for (let j = heard.length - 1; j >= 0; j--) {
      len[i][j] = target[i] === heard[j] ? len[i + 1][j + 1] + 1 : Math.max(len[i + 1][j], len[i][j + 1]);
    }
  }
  const matched = target.map(() => false);
  let i = 0;
  let j = 0;
  while (i < target.length && j < heard.length) {
    if (target[i] === heard[j]) {
      matched[i] = true;
      i++;
      j++;
    } else if (len[i + 1][j] >= len[i][j + 1]) i++;
    else j++;
  }
  return matched;
}

export type SpokenWord = { text: string; heard: boolean };

export type SpeechCheck = {
  // Share of the sentence's words that were heard, from 0 to 1.
  score: number;
  pass: boolean;
  // The sentence's own words as written ("I'm", "tea."), each marked heard or not.
  words: SpokenWord[];
  // What the phone heard (the best of its guesses), to show her in small text.
  heard: string;
};

function checkOne(target: string, heard: string): SpeechCheck {
  // Keep each written word together with its cleaned pieces, so "I'm" shows as one chip.
  const shown = target.split(/\s+/).filter(Boolean);
  const pieces = shown.map((w) => speechWords(w));
  const flat = pieces.flat();
  const matched = matchedPositions(flat, speechWords(heard));

  let k = 0;
  const words = shown.map((text, i) => {
    const mine = matched.slice(k, k + pieces[i].length);
    k += pieces[i].length;
    return { text, heard: mine.every(Boolean) };
  });
  const score = flat.length === 0 ? 0 : matched.filter(Boolean).length / flat.length;
  return { score, pass: score >= PASS_SCORE, words, heard };
}

// The phone gives a few guesses of what she said. Keep the one that fits the sentence best.
export function checkSpeech(target: string, alternatives: string[]): SpeechCheck {
  const guesses = alternatives.length > 0 ? alternatives : [""];
  return guesses
    .map((heard) => checkOne(target, heard))
    .reduce((best, next) => (next.score > best.score ? next : best));
}
