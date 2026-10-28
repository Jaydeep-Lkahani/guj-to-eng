// Checks the content files, so a mistake in a new topic shows up before she sees it.
// @ts-expect-error This project has no Node type definitions; the test runs in Node anyway.
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import audioManifest from "./audio-manifest.json";
import { allTopics, lessons, parts } from "./content";
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

      it("has practice questions with a valid answer", () => {
        expect(lesson.practice.length).toBeGreaterThan(0);
        for (const q of lesson.practice) {
          expect(["choice", "order"]).toContain(q.type);
          if (q.type === "choice") {
            expect(q.options.length).toBeGreaterThanOrEqual(2);
            expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length).toBe(true);
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
      });
    });
  }
});
