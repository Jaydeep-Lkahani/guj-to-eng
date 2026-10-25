import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { getLesson } from "./content";
import { resetProgress } from "./progress";

// jsdom has no scrolling.
window.scrollTo = () => {};

beforeEach(() => {
  window.location.hash = "#/";
  resetProgress();
});
afterEach(cleanup);

describe("navigation and lesson", () => {
  it("goes Home → Part → Topic, finishes the practice and saves progress", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "નમસ્તે!" })).toBeTruthy();

    const main = screen.getByRole("main");
    await user.click(within(main).getByRole("link", { name: /ભાગ 1/ }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("ભાગ 1");

    await user.click(within(main).getByRole("link", { name: /ABCD/ }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("ABCD");
    expect(screen.getByRole("heading", { name: "સમજીએ" })).toBeTruthy();

    // Answer every question with the right answer.
    const questions = getLesson("p1-t01")!.practice;
    for (const q of questions) {
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
    window.location.hash = "#/topic/p1-t01";
    render(<App />);
    const q = getLesson("p1-t01")!.practice[0];
    const wrong = q.options.findIndex((_, i) => i !== q.answer);
    await user.click(screen.getByRole("button", { name: q.options[wrong] }));
    expect(screen.getByText(/ના, સાચો જવાબ છે/)).toBeTruthy();
  });

  it("shows a coming-soon note for topics without a lesson file", () => {
    window.location.hash = "#/topic/p2-t01";
    render(<App />);
    expect(screen.getByText("આ પાઠ હજી તૈયાર થાય છે. જલ્દી આવશે.")).toBeTruthy();
  });
});
