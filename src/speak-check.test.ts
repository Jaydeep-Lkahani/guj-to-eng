import { describe, expect, it } from "vitest";
import { checkSpeech, numberWords, speechWords } from "./speak-check";

const heardFlags = (target: string, heard: string[]) => checkSpeech(target, heard).words.map((w) => w.heard);

describe("speechWords", () => {
  it("drops capitals and punctuation", () => {
    expect(speechWords("Hello, Meena! How are you?")).toEqual(["hello", "meena", "how", "are", "you"]);
  });

  it("opens up contractions the same way on both sides", () => {
    expect(speechWords("I'm happy. Don't go. It's late.")).toEqual(
      speechWords("I am happy. Do not go. It is late."),
    );
    expect(speechWords("I can't swim and I won't try")).toEqual(speechWords("I cannot swim and I will not try"));
    expect(speechWords("They’re here, we've eaten, you'll see, I'd like tea")).toEqual(
      speechWords("They are here, we have eaten, you will see, I would like tea"),
    );
  });

  it("keeps 's after a name, because there it shows who owns something", () => {
    expect(speechWords("Ravi's book")).toEqual(["ravis", "book"]);
    expect(speechWords("She's my sister")).toEqual(["she", "is", "my", "sister"]);
  });

  it("spells numbers, times and dates as words", () => {
    expect(speechWords("I have 4 books")).toEqual(speechWords("I have four books"));
    expect(speechWords("It is 4:30")).toEqual(speechWords("It is four thirty"));
    expect(speechWords("the 5th of May")).toEqual(speechWords("the fifth of May"));
    expect(speechWords("twenty-five")).toEqual(["twenty", "five"]);
    expect(numberWords(25)).toBe("twenty five");
    expect(numberWords(100)).toBe("one hundred");
    expect(numberWords(1947)).toBe("nineteen forty seven");
    expect(numberWords(2026)).toBe("twenty twenty six");
  });

  it("treats common spelling differences as the same word", () => {
    expect(speechWords("OK, my favorite color")).toEqual(speechWords("Okay, my favourite colour"));
  });
});

describe("checkSpeech", () => {
  it("passes when every word is heard", () => {
    const r = checkSpeech("I have a car.", ["I have a car"]);
    expect(r.pass).toBe(true);
    expect(r.score).toBe(1);
    expect(r.words.map((w) => w.text)).toEqual(["I", "have", "a", "car."]);
  });

  it("passes when the phone writes a contraction or a digit", () => {
    expect(checkSpeech("I am fine.", ["I'm fine"]).pass).toBe(true);
    expect(checkSpeech("I have four children.", ["I have 4 children"]).pass).toBe(true);
    expect(checkSpeech("It's on the table.", ["it is on the table"]).score).toBe(1);
  });

  it("does not mind extra words she said", () => {
    const r = checkSpeech("I drink tea.", ["yes I drink hot tea now"]);
    expect(r.score).toBe(1);
    expect(r.pass).toBe(true);
  });

  it("marks the missing words and fails when too many are missing", () => {
    expect(heardFlags("My name is Meena.", ["my name Meena"])).toEqual([true, true, false, true]);
    expect(checkSpeech("My name is Meena.", ["my name Meena"]).pass).toBe(false); // 3 of 4 = 75%
    expect(checkSpeech("I go to the market every day.", ["I go to the market every"]).pass).toBe(true); // 6 of 7
  });

  it("only counts words heard in the right order", () => {
    const r = checkSpeech("I have a car.", ["car a have I"]);
    expect(r.pass).toBe(false);
  });

  it("shows a contraction in the sentence as one chip, heard only if all of it was heard", () => {
    expect(heardFlags("I'm happy.", ["I happy"])).toEqual([false, true]);
    expect(heardFlags("I'm happy.", ["I am happy"])).toEqual([true, true]);
  });

  it("keeps the best of the phone's guesses", () => {
    const r = checkSpeech("I have a car.", ["I half a car", "eye have a car", "I have a car"]);
    expect(r.score).toBe(1);
    expect(r.heard).toBe("I have a car");
  });

  it("fails with nothing heard", () => {
    const r = checkSpeech("Good morning.", []);
    expect(r.pass).toBe(false);
    expect(r.score).toBe(0);
    expect(r.words.every((w) => !w.heard)).toBe(true);
  });
});
