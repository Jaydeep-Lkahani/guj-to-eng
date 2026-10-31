import { beforeEach, describe, expect, it } from "vitest";
import { getLesson } from "./content";
import type { Question } from "./content";
import {
  addDay,
  addDays,
  answered,
  dropUnknown,
  dueCount,
  dueDate,
  nextBox,
  questionCatalog,
  questionId,
  recordAnswer,
  resetReview,
  seedItems,
  seedReview,
  streak,
  todaysSet,
  type ReviewState,
} from "./review";

const q = (questionGu: string, answer = 0): Question => ({
  type: "choice",
  questionGu,
  options: ["I have a car.", "I has a car."],
  answer,
});

describe("dates", () => {
  it("adds days across months and years", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("question id", () => {
  it("depends on the question and its answer, not on where it sits", () => {
    expect(questionId(q("એક"))).toBe(questionId(q("એક")));
    expect(questionId(q("એક"))).not.toBe(questionId(q("બે")));
    expect(questionId(q("એક", 0))).not.toBe(questionId(q("એક", 1)));
  });
});

describe("boxes", () => {
  it("moves up on a right answer, to the last box at most", () => {
    expect(nextBox(0, true)).toBe(1);
    expect(nextBox(3, true)).toBe(4);
    expect(nextBox(4, true)).toBe(4);
  });

  it("goes back to box 0 on a wrong answer", () => {
    expect(nextBox(4, false)).toBe(0);
  });

  it("comes back after 1, 3, 7, 14 and 30 days", () => {
    expect([0, 1, 2, 3, 4].map((box) => dueDate(box, "2026-11-01"))).toEqual([
      "2026-11-02",
      "2026-11-04",
      "2026-11-08",
      "2026-11-15",
      "2026-12-01",
    ]);
  });
});

describe("answering", () => {
  it("puts a new question that is answered right in box 1, due in 3 days", () => {
    expect(answered({}, "a", true, "2026-11-01").a).toEqual({ box: 1, due: "2026-11-04" });
  });

  it("brings a wrong answer back tomorrow", () => {
    const items = { a: { box: 3, due: "2026-11-01" } };
    expect(answered(items, "a", false, "2026-11-01").a).toEqual({ box: 0, due: "2026-11-02" });
    // A day later it is in the set again.
    const after = answered(items, "a", false, "2026-11-01");
    expect(todaysSet(after, "2026-11-01")).toEqual([]);
    expect(todaysSet(after, "2026-11-02")).toEqual(["a"]);
  });

  it("moves a due question up", () => {
    const items = { a: { box: 1, due: "2026-11-01" } };
    expect(answered(items, "a", true, "2026-11-01").a).toEqual({ box: 2, due: "2026-11-08" });
  });

  it("does not move a question up again when it is not due yet", () => {
    const items = { a: { box: 1, due: "2026-11-04" } };
    expect(answered(items, "a", true, "2026-11-01")).toBe(items);
  });
});

describe("today's set", () => {
  const items = {
    late: { box: 2, due: "2026-10-20" },
    new0: { box: 0, due: "2026-11-01" },
    old0: { box: 0, due: "2026-10-25" },
    future: { box: 0, due: "2026-11-02" },
    top: { box: 4, due: "2026-11-01" },
  };

  it("takes what is due, lowest box first, then the oldest", () => {
    expect(todaysSet(items, "2026-11-01")).toEqual(["old0", "new0", "late", "top"]);
  });

  it("stops at the daily size and leaves the rest due", () => {
    expect(todaysSet(items, "2026-11-01", 2)).toEqual(["old0", "new0"]);
    expect(dueCount(items, "2026-11-01")).toBe(4);
  });

  it("counts what is due tomorrow too", () => {
    expect(dueCount(items, "2026-11-02")).toBe(5);
  });
});

describe("streak", () => {
  it("counts the days in a row up to today", () => {
    expect(streak(["2026-10-30", "2026-10-31", "2026-11-01"], "2026-11-01")).toBe(3);
  });

  it("still counts when today is not done yet", () => {
    expect(streak(["2026-10-30", "2026-10-31"], "2026-11-01")).toBe(2);
  });

  it("starts again after a missed day", () => {
    expect(streak(["2026-10-28", "2026-10-29", "2026-11-01"], "2026-11-01")).toBe(1);
    expect(streak(["2026-10-28", "2026-10-29"], "2026-11-01")).toBe(0);
  });

  it("keeps only the last 60 days, in order, with no repeats", () => {
    let days: string[] = [];
    for (let i = 0; i < 70; i++) days = addDay(days, addDays("2026-01-01", i));
    days = addDay(days, "2026-03-11");
    expect(days).toHaveLength(60);
    expect(days[0]).toBe(addDays("2026-01-01", 10));
  });
});

describe("first run", () => {
  it("adds finished questions at box 1, spread over 7 days", () => {
    const ids = Array.from({ length: 15 }, (_, i) => `q${i}`);
    const items = seedItems(ids, {}, "2026-11-01");
    expect(Object.values(items).every((item) => item.box === 1)).toBe(true);
    const dues = Object.values(items).map((item) => item.due);
    expect(new Set(dues).size).toBe(7);
    expect(dues.every((d) => d >= "2026-11-01" && d <= "2026-11-07")).toBe(true);
  });

  it("keeps the questions she already has", () => {
    const have = { q0: { box: 3, due: "2026-12-01" } };
    expect(seedItems(["q0"], have, "2026-11-01")).toBe(have);
    expect(seedItems(["q0", "q1"], have, "2026-11-01").q0).toEqual(have.q0);
  });
});

describe("unknown questions", () => {
  it("are dropped quietly", () => {
    const items = { a: { box: 1, due: "2026-11-01" }, gone: { box: 2, due: "2026-11-01" } };
    expect(dropUnknown(items, new Set(["a"]))).toEqual({ a: items.a });
  });
});

describe("saved review", () => {
  const saved = (): ReviewState => JSON.parse(localStorage.getItem("guj-eng.review.v1")!);
  beforeEach(() => resetReview());

  it("saves an answer from a lesson", () => {
    const question = getLesson("p1-t01")!.practice[0];
    recordAnswer(question, true);
    expect(saved().items[questionId(question)].box).toBe(1);
  });

  it("adds every question of her finished lessons once, and only those", () => {
    seedReview(new Set(["p1-t01"]));
    const lesson = getLesson("p1-t01")!.practice;
    expect(Object.keys(saved().items).length).toBeGreaterThan(0);
    expect(Object.keys(saved().items).length).toBeLessThanOrEqual(lesson.length);
    expect(saved().seeded).toBe(true);

    // A second lesson finished later is not added by a second seeding; its answers do that.
    seedReview(new Set(["p1-t01", "p1-t02"]));
    expect(Object.keys(saved().items).length).toBeLessThanOrEqual(lesson.length);
  });

  it("does not mark itself seeded while she has finished nothing", () => {
    seedReview(new Set());
    expect(saved().seeded).not.toBe(true);
  });

  it("finds each question in the lessons by its id", () => {
    const question = getLesson("p1-t01")!.practice[0];
    expect(questionCatalog().get(questionId(question))?.topicId).toBe("p1-t01");
  });
});
