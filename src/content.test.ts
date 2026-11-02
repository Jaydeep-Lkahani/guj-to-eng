// Checks the content files, so a mistake in a new topic shows up before she sees it.
// @ts-expect-error This project has no Node type definitions; the test runs in Node anyway.
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import audioManifest from "./audio-manifest.json";
import { allTopics, getLesson, guide, isEnglishText, lessons, parts, ROLES, type Question, type SentencePart } from "./content";
import { shuffled } from "./components/Practice";

describe("content", () => {
  it("has every recorded audio file the audio list points to", () => {
    for (const [text, file] of Object.entries(audioManifest.files as Record<string, string>)) {
      expect(existsSync(`public/audio/${file}`), text).toBe(true);
    }
  });

  it("has unique part and topic ids", () => {
    const partIds = parts.map((p) => p.id);
    const topicIds = allTopics.map((t) => t.id);
    expect(new Set(partIds).size).toBe(partIds.length);
    expect(new Set(topicIds).size).toBe(topicIds.length);
  });

  it("gives every part and topic a Gujarati and English title", () => {
    for (const part of parts) {
      expect(part.titleGu && part.titleEn && part.introGu, part.id).toBeTruthy();
      for (const t of part.topics) expect(t.titleGu && t.titleEn, t.id).toBeTruthy();
    }
  });

  describe("sentence guide", () => {
    it("has a basic pattern and one card per kind of sentence", () => {
      checkParts(guide.basic.gu, false, "basic");
      checkParts(guide.basic.en, true, "basic");
      const ids = guide.items.map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(guide.checksGu.length).toBeGreaterThan(0);
    });

    for (const item of guide.items) {
      it(`card "${item.id}" has a pattern, an example, a tip and a lesson`, () => {
        expect(item.labelGu && item.whenGu && item.tipGu, item.id).toBeTruthy();
        checkParts(item.formula, true, item.id);
        expect(isEnglishText(item.example.en) && /[.?!]$/.test(item.example.en), item.example.en).toBe(true);
        expect(/[\u0A80-\u0AFF]/.test(item.example.gu), item.id).toBe(true);
        // A mistake always comes with its right version, both plain English.
        expect(Boolean(item.wrong), item.id).toBe(Boolean(item.right));
        if (item.wrong && item.right) {
          expect(isEnglishText(item.wrong) && isEnglishText(item.right), item.id).toBe(true);
          expect(item.wrong, item.id).not.toBe(item.right);
        }
        expect(getLesson(item.topicId), item.topicId).toBeTruthy();
        for (const q of item.practice ?? []) checkQuestion(q);
      });
    }

    it("has a full tense chart whose cells open real cards", () => {
      const chart = guide.tenseChart;
      const cardIds = new Set(guide.items.map((i) => i.id));
      for (const r of chart.rows) {
        for (const c of chart.columns) {
          const cells = chart.cells.filter((x) => x.row === r.id && x.column === c.id);
          expect(cells.length, `${r.id} ${c.id}`).toBe(1);
          const cell = cells[0];
          expect(isEnglishText(cell.en) && /[\u0A80-\u0AFF]/.test(cell.gu), cell.en).toBe(true);
          if (cell.itemId) expect(cardIds.has(cell.itemId), cell.itemId).toBe(true);
        }
      }
    });

    it("has a mixed tense quiz", () => {
      expect(guide.mixed.questions.length).toBeGreaterThan(0);
      for (const q of guide.mixed.questions) checkQuestion(q);
    });
  });

  for (const lesson of lessons) {
    describe(`lesson ${lesson.topicId}`, () => {
      it("belongs to a topic in parts.json", () => {
        expect(allTopics.some((t) => t.id === lesson.topicId)).toBe(true);
      });

      it("has an explanation and examples with English, transliteration and meaning", () => {
        expect(lesson.explanationGu.length).toBeGreaterThan(0);
        expect(lesson.examples.length).toBeGreaterThan(0);
        for (const ex of lesson.examples) {
          expect(ex.en && ex.translit && ex.gu, JSON.stringify(ex)).toBeTruthy();
        }
      });

      it("has pattern pictures with labelled Gujarati and English pieces", () => {
        for (const p of lesson.patterns ?? []) {
          const name = p.en.map((x) => x.text).join(" ");
          checkParts(p.gu, false, name);
          checkParts(p.en, true, name);
          // Both rows show the verb, since the verb moving is the whole point.
          expect(p.gu.some((x) => x.role === "verb") && p.en.some((x) => x.role === "verb"), name).toBe(true);
        }
      });

      it("has practice questions with a valid answer", () => {
        expect(lesson.practice.length).toBeGreaterThan(0);
        for (const q of lesson.practice) checkQuestion(q);
      });
    });
  }
});

// Every piece has text and a known part; English pieces are plain English, Gujarati pieces are Gujarati.
function checkParts(parts: SentencePart[], english: boolean, name: string) {
  expect(parts.length, name).toBeGreaterThanOrEqual(2);
  for (const p of parts) {
    expect(p.text.trim() === p.text && p.text.length > 0, name).toBe(true);
    expect(ROLES as readonly string[], name).toContain(p.role);
    expect(english ? isEnglishText(p.text) : /[\u0A80-\u0AFF]/.test(p.text), `${name}: ${p.text}`).toBe(true);
  }
}

// The same checks for every practice question, in lessons and on the guide page.
function checkQuestion(q: Question) {
  expect(["choice", "order", "say", "build"]).toContain(q.type);
  if (q.type === "choice") {
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length).toBe(true);
  } else if (q.type === "say") {
    // Plain English she can say aloud, ending with . ? or !
    expect(q.text.trim().length > 0 && isEnglishText(q.text), q.questionGu).toBe(true);
    expect(/[a-z]/i.test(q.text) && /[.?!]$/.test(q.text), q.text).toBe(true);
    if (q.translit !== undefined) expect(/[\u0A80-\u0AFF]/.test(q.translit), q.text).toBe(true);
  } else if (q.type === "build") {
    const texts = q.parts.map((p) => p.text);
    expect(q.parts.length, q.questionGu).toBeGreaterThanOrEqual(2);
    checkParts(q.parts, true, q.questionGu);
    // The end mark lives in `end`, and the pieces never start out in the right order.
    expect(/[.?!]$/.test(texts[texts.length - 1]), q.questionGu).toBe(false);
    expect(shuffled(texts).map((i) => texts[i]).join(" "), q.questionGu).not.toBe(texts.join(" "));
  } else {
    // At least two words, none empty, and no extra spaces inside a tile.
    expect(q.words.length, q.questionGu).toBeGreaterThanOrEqual(2);
    for (const w of q.words) expect(w.trim() === w && w.length > 0 && !w.includes(" "), w).toBe(true);
    // The full stop or question mark lives in `end`, not on the last tile.
    expect(/[.?!]$/.test(q.words[q.words.length - 1]), q.questionGu).toBe(false);
    // The tiles never start out already in the right order.
    expect(shuffled(q.words).map((i) => q.words[i]).join(" "), q.questionGu).not.toBe(q.words.join(" "));
  }
}
