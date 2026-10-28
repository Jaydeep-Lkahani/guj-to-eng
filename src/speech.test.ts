import { describe, expect, it } from "vitest";
import { speakable } from "./speech";

describe("speakable", () => {
  it("leaves normal sentences alone", () => {
    expect(speakable("I drink tea.")).toBe("I drink tea.");
  });

  it("reads arrows, plus signs and slashes as short pauses", () => {
    expect(speakable("book → books")).toBe("book, books");
    expect(speakable("I + have + a car")).toBe("I, have, a car");
    expect(speakable("a book / an apple")).toBe("a book, an apple");
    expect(speakable("5:10 – five ten")).toBe("5:10, five ten");
  });

  it("drops the speaker's name in a dialogue line", () => {
    expect(speakable("Neha: Hello, Anita! How are you?")).toBe("Hello, Anita! How are you?");
  });

  it("drops blanks and trailing dots from patterns", () => {
    expect(speakable("Can you…?")).toBe("Can you?");
    expect(speakable("___ is my bag.")).toBe("is my bag.");
  });
});

describe("speakable notes", () => {
  it("drops a note at the end but keeps a lone symbol's name", () => {
    expect(speakable("Are you coming? (voice goes up)")).toBe("Are you coming?");
    expect(speakable("? (question mark)")).toBe("? (question mark)");
  });
});
