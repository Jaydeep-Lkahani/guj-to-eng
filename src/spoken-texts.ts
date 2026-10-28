// Every piece of English the site can read aloud, as the voice will say it.
// The audio script (scripts/make-audio.mjs) makes one recording for each.
import { answerText, isEnglishText, lessons } from "./content";
import { demoWords } from "./components/WordDemo";
import { speakable } from "./speech";

export function spokenTexts(): string[] {
  const texts = new Set<string>();
  const add = (text: string) => {
    const spoken = speakable(text);
    if (spoken) texts.add(spoken);
  };

  demoWords.forEach((w) => add(w.en)); // home page sample card
  for (const lesson of lessons) {
    lesson.examples.forEach((ex) => add(ex.en)); // example cards
    for (const q of lesson.practice) {
      const answer = answerText(q); // "Listen" button after a practice answer
      if (isEnglishText(answer)) add(answer);
    }
  }
  return [...texts].sort();
}
