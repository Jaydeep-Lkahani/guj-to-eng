// Checks the content files, so a mistake in a new topic shows up before she sees it.
import { describe, expect, it } from "vitest";
import { allTopics, lessons, parts } from "./content";

describe("content", () => {
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
          expect(q.type).toBe("choice");
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length).toBe(true);
        }
      });
    });
  }
});
