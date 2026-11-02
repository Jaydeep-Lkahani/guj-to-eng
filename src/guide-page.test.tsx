import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { getTopicInfo, guide } from "./content";
import { allPaths, indexablePaths, pageMeta } from "./seo";

window.scrollTo = () => {};

beforeEach(() => window.history.replaceState(null, "", "/guide"));
afterEach(cleanup);

describe("sentence guide page", () => {
  it("shows the basic order, a card for every kind of sentence and the checks", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "વાક્ય બનાવવાની ચાવી" })).toBeTruthy();
    expect(screen.getByText("દરેક વાક્યનો મૂળ ક્રમ")).toBeTruthy();
    for (const item of guide.items) {
      const card = document.getElementById(`guide-${item.id}`)!;
      expect(within(card).getByRole("heading", { level: 3 }).textContent).toBe(item.labelGu);
      expect(card.textContent).toContain(item.example.en);
      const lesson = getTopicInfo(item.topicId)!.topic;
      expect(within(card).getByRole("link", { name: /પાઠ જુઓ/ }).getAttribute("href")).toBe(`/topic/${lesson.id}`);
    }
    expect(screen.getByRole("heading", { name: /બોલતાં પહેલાં ચકાસો/ })).toBeTruthy();
  });

  it("jumps to a card when she picks what she wants to say", async () => {
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    render(<App />);
    const past = guide.items.find((i) => i.id === "past")!;
    await userEvent.click(screen.getByRole("button", { name: past.labelGu }));
    expect(scroll).toHaveBeenCalledTimes(1);
    const card = document.getElementById("guide-past")!;
    expect(card.classList.contains("picked")).toBe(true);
    expect(document.activeElement).toBe(within(card).getByRole("heading", { level: 3 }));
  });

  it("shows the tense chart; taught tenses open their card, the rest say 'later'", async () => {
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    render(<App />);
    const table = screen.getByRole("table");
    const later = guide.tenseChart.cells.filter((c) => !c.itemId);
    expect(within(table).getAllByText("આગળ શીખીશું")).toHaveLength(later.length);
    for (const c of later) expect(within(table).queryByRole("button", { name: new RegExp(c.en) })).toBeNull();

    await userEvent.click(within(table).getByRole("button", { name: /I will drink/ }));
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(document.getElementById("guide-future")!.classList.contains("picked")).toBe(true);
  });

  it("opens one practice set at a time and checks the answers", async () => {
    const user = userEvent.setup();
    render(<App />);
    const pastCard = document.getElementById("guide-past")!;
    const futureCard = document.getElementById("guide-future")!;
    await user.click(within(pastCard).getByRole("button", { name: /પ્રેક્ટિસ કરો/ }));
    expect(within(pastCard).getByText(/સવાલ 1 \//)).toBeTruthy();

    // Answer the first question right.
    const q = guide.items.find((i) => i.id === "past")!.practice![0];
    if (q.type !== "build") throw new Error("expected a labelled-boxes question");
    const bank = within(pastCard).getByRole("group", { name: "ટુકડા" });
    for (const p of q.parts) await user.click(within(bank).getByRole("button", { name: p.text }));
    await user.click(within(pastCard).getByRole("button", { name: /જવાબ તપાસો/ }));
    expect(within(pastCard).getByText("સરસ! સાચો જવાબ.")).toBeTruthy();

    // Opening another set closes this one.
    await user.click(within(futureCard).getByRole("button", { name: /પ્રેક્ટિસ કરો/ }));
    expect(within(pastCard).queryByText(/સવાલ 1 \//)).toBeNull();
    expect(within(futureCard).getByText(/સવાલ 1 \//)).toBeTruthy();
  });

  it("has a mixed 'which tense?' quiz", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /શરૂ કરો/ }));
    const first = guide.mixed.questions[0];
    if (first.type !== "choice") throw new Error("expected a choice question");
    await user.click(screen.getByRole("button", { name: first.options[first.answer] }));
    expect(screen.getByText("સરસ! સાચો જવાબ.")).toBeTruthy();
    expect(screen.getByText(new RegExp(`સવાલ 1 / ${guide.mixed.questions.length}`))).toBeTruthy();
  });

  it("is linked from the sidebar and listed for search engines", () => {
    render(<App />);
    expect(screen.getAllByRole("link", { name: /વાક્ય બનાવવાની ચાવી/ }).length).toBeGreaterThan(0);
    expect(allPaths()).toContain("/guide");
    expect(indexablePaths()).toContain("/guide");
    expect(pageMeta("/guide").noindex).toBeFalsy();
    expect(pageMeta("/guide").title).toContain("વાક્ય બનાવવાની ચાવી");
  });
});
