import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { getLesson, getTopicInfo } from "./content";
import { markComplete, resetProgress } from "./progress";
import { questionId, resetReview, todaysSet, today, type ReviewState } from "./review";

window.scrollTo = () => {};

const saved = (): ReviewState => JSON.parse(localStorage.getItem("guj-eng.review.v1")!);

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  resetProgress();
  resetReview();
});
afterEach(cleanup);

// Opens /review after finishing p1-t01 (its questions are added to the review on the first draw),
// taps start and answers every question of today's set correctly. Returns how many there were.
async function runTodaysSet(user: ReturnType<typeof userEvent.setup>): Promise<number> {
  act(() => markComplete("p1-t01"));
  window.history.replaceState(null, "", "/review");
  render(<App />);

  const due = todaysSet(saved().items, today());
  await user.click(screen.getByRole("button", { name: /શરૂ કરો/ }));
  const title = getTopicInfo("p1-t01")!.topic.titleGu;
  for (const id of due) {
    const q = getLesson("p1-t01")!.practice.find((p) => questionId(p) === id)!;
    if (q.type !== "choice") throw new Error("p1-t01 should only have choice questions");
    expect(screen.getByText(`પાઠ: ${title}`)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: q.options[q.answer] }));
    await user.click(screen.getByRole("button", { name: /આગળનો સવાલ|પરિણામ જુઓ/ }));
  }
  return due.length;
}

describe("daily review", () => {
  it("points to the first lesson when she has finished nothing", () => {
    window.history.replaceState(null, "", "/review");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "આજનું પુનરાવર્તન" })).toBeTruthy();
    expect(screen.getByText("હજી પુનરાવર્તન માટે કંઈ નથી.")).toBeTruthy();
  });

  it("remembers the answers she gives inside a lesson", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/topic/p1-t01");
    render(<App />);
    const q = getLesson("p1-t01")!.practice[0];
    if (q.type !== "choice") throw new Error("p1-t01 should only have choice questions");
    await user.click(screen.getByRole("button", { name: q.options[q.answer] }));
    expect(saved().items[questionId(q)].box).toBe(1);
  });

  it("brings back the questions of lessons she finished before, and runs a set", async () => {
    const user = userEvent.setup();
    const count = await runTodaysSet(user);

    expect(count).toBeGreaterThan(0);
    expect(screen.getByText(`${count} માંથી ${count} જવાબ સાચા.`)).toBeTruthy();
    expect(screen.getAllByText("1 દિવસ સળંગ").length).toBeGreaterThan(0);
    expect(saved().days).toEqual([today()]);
  });

  it("says the review is done for today once the set is finished", async () => {
    const user = userEvent.setup();
    await runTodaysSet(user);

    cleanup();
    window.history.replaceState(null, "", "/review");
    render(<App />);
    expect(screen.getByText("આજનું પુનરાવર્તન પૂરું! કાલે ફરી મળીએ.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /શરૂ કરો/ })).toBeNull();
  });
});
