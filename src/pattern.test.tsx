import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Practice } from "./components/Practice";
import { PatternCard } from "./components/PatternCard";
import { answerText, type BuildQuestion, type Pattern } from "./content";

afterEach(cleanup);

const pattern: Pattern = {
  titleGu: "ક્રિયા બીજા નંબરે આવે",
  gu: [
    { text: "હું", role: "who" },
    { text: "ચા", role: "what" },
    { text: "પીઉં છું", role: "verb" },
  ],
  en: [
    { text: "I", role: "who" },
    { text: "drink", role: "verb" },
    { text: "tea", role: "what" },
  ],
  noteGu: "ગુજરાતીમાં ક્રિયા છેલ્લે, અંગ્રેજીમાં બીજા નંબરે.",
};

const question: BuildQuestion = {
  type: "build",
  questionGu: "\"હું રોજ ચા પીઉં છું.\" ખાનામાં ગોઠવો.",
  parts: [
    { text: "I", role: "who" },
    { text: "drink", role: "verb" },
    { text: "tea", role: "what" },
    { text: "every day", role: "when" },
  ],
};

describe("pattern picture", () => {
  it("shows both orders with each piece's job and place", () => {
    render(<PatternCard pattern={pattern} />);
    const [gu, en] = screen.getAllByRole("list");
    const pieces = (list: HTMLElement) => within(list).getAllByRole("listitem").map((li) => li.textContent);
    expect(pieces(gu)).toEqual(["1હુંકોણ?", "2ચાશું?", "3પીઉં છુંશું કરે?"]);
    expect(pieces(en)).toEqual(["1Iકોણ?", "2drinkશું કરે?", "3teaશું?"]);
    expect(screen.getByText("ક્રિયા બીજા નંબરે આવે")).toBeTruthy();
  });
});

const ifQuestion: BuildQuestion = {
  type: "build",
  questionGu: "\"જો તમે ભણશો તો પાસ થશો.\" ખાનામાં ગોઠવો.",
  parts: [
    { text: "If", role: "link" },
    { text: "you", role: "who" },
    { text: "study,", role: "verb" },
    { text: "you", role: "who" },
    { text: "will", role: "helper" },
    { text: "pass", role: "verb" },
  ],
};

describe("fill the labelled boxes", () => {
  function setup() {
    const onAnswer = vi.fn();
    render(<Practice questions={[question]} onFinish={() => {}} onAnswer={onAnswer} />);
    const bank = screen.getByRole("group", { name: "ટુકડા" });
    const tap = (text: string) => userEvent.click(within(bank).getByRole("button", { name: text }));
    return { onAnswer, tap };
  }

  it("labels every box and accepts the right order", async () => {
    const { onAnswer, tap } = setup();
    const boxes = screen.getByRole("list", { name: "ખાનાં" });
    expect(within(boxes).getAllByRole("listitem").map((li) => li.querySelector(".build-slot-label")!.textContent)).toEqual(
      ["કોણ?", "શું કરે?", "શું?", "ક્યારે?"],
    );
    const check = screen.getByRole("button", { name: /જવાબ તપાસો/ }) as HTMLButtonElement;
    expect(check.disabled).toBe(true);

    for (const p of question.parts) await tap(p.text);
    await userEvent.click(check);
    expect(onAnswer).toHaveBeenCalledWith(question, true);
    expect(screen.getByText("સરસ! સાચો જવાબ.")).toBeTruthy();
  });

  it("lets her take a piece back out of a box", async () => {
    const { tap } = setup();
    await tap("tea");
    const boxes = screen.getByRole("list", { name: "ખાનાં" });
    await userEvent.click(within(boxes).getByRole("button", { name: "tea" }));
    expect(within(boxes).queryByRole("button", { name: "tea" })).toBeNull();
  });

  it("says which box a wrongly placed piece belongs in", async () => {
    const { onAnswer, tap } = setup();
    for (const t of ["I", "tea", "drink", "every day"]) await tap(t);
    await userEvent.click(screen.getByRole("button", { name: /જવાબ તપાસો/ }));

    expect(onAnswer).toHaveBeenCalledWith(question, false);
    const msg = document.querySelector(".build-msg")!.textContent;
    expect(msg).toBe('tea "શું?" નો જવાબ છે, એટલે તે "શું?" વાળા ખાનામાં જાય.');
    const states = [...document.querySelectorAll(".build-slot")].map((s) =>
      s.classList.contains("right") ? "right" : "wrong",
    );
    expect(states).toEqual(["right", "wrong", "wrong", "right"]);
    expect(document.querySelector(".feedback.bad")!.textContent).toContain(answerText(question));
  });

  it("says 'right label, wrong place' when two boxes share a label", async () => {
    render(<Practice questions={[ifQuestion]} onFinish={() => {}} />);
    const bank = screen.getByRole("group", { name: "ટુકડા" });
    // Swap the two verbs: both are "શું કરે?" pieces, each in the other's box.
    for (const t of ["If", "you", "pass", "you", "will", "study,"]) {
      await userEvent.click(within(bank).getAllByRole("button", { name: t }).find((b) => !(b as HTMLButtonElement).disabled)!);
    }
    await userEvent.click(screen.getByRole("button", { name: /જવાબ તપાસો/ }));
    expect(document.querySelector(".build-msg")!.textContent).toBe(
      'pass "શું કરે?" જ છે, પણ આ જગ્યાએ નહીં. વાક્યનો ક્રમ ફરી જુઓ.',
    );
  });
});
