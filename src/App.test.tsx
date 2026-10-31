import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { getLesson } from "./content";
import { resetProgress } from "./progress";
import { resetReview } from "./review";

// Every topic now has a lesson, so one test hides a lesson to see the "coming soon" note.
const hidden = vi.hoisted(() => ({ topicId: "" }));
vi.mock("./content", async (importOriginal) => {
  const real = await importOriginal<typeof import("./content")>();
  return { ...real, getLesson: (id: string) => (id === hidden.topicId ? undefined : real.getLesson(id)) };
});

// jsdom has no scrolling.
window.scrollTo = () => {};

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  resetProgress();
  resetReview();
});
afterEach(() => {
  cleanup();
  hidden.topicId = "";
});

describe("navigation and lesson", () => {
  it("goes Home → Part → Topic, finishes the practice and saves progress", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /^નમસ્તે!/ })).toBeTruthy();

    const main = screen.getByRole("main");
    await user.click(within(main).getByRole("link", { name: /ભાગ 1/ }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("ભાગ 1");

    await user.click(within(main).getByRole("link", { name: /ABCD/ }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("ABCD");
    expect(screen.getByRole("heading", { name: "સમજીએ" })).toBeTruthy();

    // Answer every question with the right answer.
    const questions = getLesson("p1-t01")!.practice;
    for (const q of questions) {
      if (q.type !== "choice") throw new Error("p1-t01 should only have choice questions");
      await user.click(screen.getByRole("button", { name: q.options[q.answer] }));
      expect(screen.getByText("સરસ! સાચો જવાબ.")).toBeTruthy();
      await user.click(screen.getByRole("button", { name: /આગળનો સવાલ|પરિણામ જુઓ/ }));
    }

    expect(screen.getByText(`${questions.length} માંથી ${questions.length} જવાબ સાચા.`)).toBeTruthy();
    expect(screen.getByText(/આ પાઠ પૂરો થઈ ગયો છે/)).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("guj-eng.completed.v1")!)).toEqual(["p1-t01"]);
  });

  it("shows the right answer after a wrong pick", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/topic/p1-t01");
    render(<App />);
    const q = getLesson("p1-t01")!.practice[0];
    if (q.type !== "choice") throw new Error("expected a choice question");
    const wrong = q.options.findIndex((_, i) => i !== q.answer);
    await user.click(screen.getByRole("button", { name: q.options[wrong] }));
    expect(screen.getByText(/ના, સાચો જવાબ છે/)).toBeTruthy();
  });

  it("lets her build a sentence from word tiles in a word-order question", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/topic/p1-t11");
    render(<App />);
    const practice = getLesson("p1-t11")!.practice;
    const first = practice.findIndex((q) => q.type === "order");

    // Get to the first word-order question by answering the ones before it.
    for (const q of practice.slice(0, first)) {
      if (q.type !== "choice") throw new Error("expected a choice question");
      await user.click(screen.getByRole("button", { name: q.options[q.answer] }));
      await user.click(screen.getByRole("button", { name: "આગળનો સવાલ" }));
    }

    const q = practice[first];
    if (q.type !== "order") throw new Error("expected an order question");
    const check = screen.getByRole("button", { name: "જવાબ તપાસો" }) as HTMLButtonElement;
    expect(check.disabled).toBe(true);

    // Tap the tiles in the right order.
    const bank = screen.getByRole("group", { name: "શબ્દો" });
    for (const word of q.words) {
      const tile = within(bank)
        .getAllByRole("button", { name: word })
        .find((b) => !(b as HTMLButtonElement).disabled)!;
      await user.click(tile);
    }
    expect(within(screen.getByRole("group", { name: "તમારું વાક્ય" })).getAllByRole("button")).toHaveLength(
      q.words.length,
    );
    await user.click(check);
    expect(screen.getByText("સરસ! સાચો જવાબ.")).toBeTruthy();
  });

  it("shows the right sentence when the words are in the wrong order", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/topic/p1-t11");
    render(<App />);
    const practice = getLesson("p1-t11")!.practice;
    const first = practice.findIndex((q) => q.type === "order");
    for (const q of practice.slice(0, first)) {
      if (q.type !== "choice") throw new Error("expected a choice question");
      await user.click(screen.getByRole("button", { name: q.options[q.answer] }));
      await user.click(screen.getByRole("button", { name: "આગળનો સવાલ" }));
    }
    const q = practice[first];
    if (q.type !== "order") throw new Error("expected an order question");

    // Tap them back to front, then take the last one off and put it back (tapping a placed word removes it).
    const bank = screen.getByRole("group", { name: "શબ્દો" });
    for (const word of [...q.words].reverse()) {
      const tile = within(bank)
        .getAllByRole("button", { name: word })
        .find((b) => !(b as HTMLButtonElement).disabled)!;
      await user.click(tile);
    }
    const line = screen.getByRole("group", { name: "તમારું વાક્ય" });
    await user.click(within(line).getAllByRole("button").at(-1)!);
    expect(within(line).getAllByRole("button")).toHaveLength(q.words.length - 1);
    await user.click(within(bank).getByRole("button", { name: q.words[0] }));

    await user.click(screen.getByRole("button", { name: "જવાબ તપાસો" }));
    expect(screen.getByText(/ના, સાચો જવાબ છે/)).toBeTruthy();
    // The right sentence shows in the feedback box (it is also on an example card above).
    expect(document.querySelector(".feedback.bad")!.textContent).toContain(q.words.join(" ") + (q.end ?? "."));
  });

  it("shows a coming-soon note for topics without a lesson file", () => {
    hidden.topicId = "p3-t08";
    window.history.replaceState(null, "", "/topic/p3-t08");
    render(<App />);
    expect(screen.getByText("આ પાઠ હજી તૈયાર થાય છે. જલ્દી આવશે.")).toBeTruthy();
  });
});
