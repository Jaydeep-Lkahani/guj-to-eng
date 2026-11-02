import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Practice } from "./components/Practice";
import type { SayQuestion } from "./content";

const question: SayQuestion = {
  type: "say",
  questionGu: "\"મારી પાસે ગાડી છે.\" અંગ્રેજીમાં બોલો.",
  text: "I have a car.",
  translit: "આઇ હૅવ અ કાર.",
  explainGu: "I have a car. – આઇ હૅવ અ કાર.",
};

// What the fake microphone does when it starts: hear these guesses, or fail with this error.
type Plan = { heard: string[] } | { error: string };
let plans: Plan[] = [];

// Stands in for the browser's SpeechRecognition, so tests don't need a real microphone.
class FakeRecognizer {
  lang = "";
  interimResults = true;
  maxAlternatives = 1;
  continuous = true;
  onresult: ((e: unknown) => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  onend: (() => void) | null = null;
  start() {
    const plan = plans.shift() ?? { heard: [] };
    setTimeout(() => {
      if ("error" in plan) this.onerror?.({ error: plan.error });
      else if (plan.heard.length > 0) this.onresult?.({ results: [plan.heard.map((transcript) => ({ transcript }))] });
      this.onend?.();
    }, 0);
  }
  stop() {}
  abort() {}
}

const w = window as unknown as { SpeechRecognition?: unknown };

function renderQuestion() {
  const onAnswer = vi.fn();
  render(<Practice questions={[question]} onFinish={() => {}} onAnswer={onAnswer} />);
  return onAnswer;
}

beforeEach(() => {
  plans = [];
  localStorage.clear();
  w.SpeechRecognition = FakeRecognizer;
});
afterEach(() => {
  cleanup();
  delete w.SpeechRecognition;
});

describe("say it aloud", () => {
  it("shows the note once, then passes when the phone hears the sentence", async () => {
    const user = userEvent.setup();
    plans = [{ heard: ["I has a car", "I have a car"] }];
    const onAnswer = renderQuestion();

    expect(screen.getByText("I have a car.")).toBeTruthy();
    expect(screen.getByText("આઇ હૅવ અ કાર.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "બોલો" }));
    expect(screen.getByRole("note").textContent).toContain("Google");
    await user.click(screen.getByRole("button", { name: /સમજાયું/ }));

    expect(await screen.findByText("સરસ! બરાબર બોલ્યા.")).toBeTruthy();
    expect(onAnswer).toHaveBeenCalledWith(question, true);
    expect(localStorage.getItem("guj-eng.mic-note.v1")).toBe("1");
    expect(screen.getByRole("button", { name: /પરિણામ જુઓ/ })).toBeTruthy();
  });

  it("marks the missing words and lets her go on after 3 tries, counting it wrong", async () => {
    const user = userEvent.setup();
    localStorage.setItem("guj-eng.mic-note.v1", "1");
    plans = [{ heard: ["I car"] }, { heard: [] }, { heard: ["I have"] }];
    const onAnswer = renderQuestion();

    await user.click(screen.getByRole("button", { name: "બોલો" }));
    expect(await screen.findByText(/રાખોડી શબ્દો/)).toBeTruthy();
    const chips = screen.getByLabelText("સંભળાયેલા શબ્દો").querySelectorAll(".say-word");
    expect([...chips].map((c) => c.classList.contains("heard"))).toEqual([true, false, false, true]);
    expect(screen.queryByRole("button", { name: /આગળ વધો/ })).toBeNull();

    await user.click(screen.getByRole("button", { name: "ફરી બોલો" }));
    expect(await screen.findByText(/કંઈ સંભળાયું નહીં/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /આગળ વધો/ })).toBeNull();

    await user.click(screen.getByRole("button", { name: "ફરી બોલો" }));
    await user.click(await screen.findByRole("button", { name: /આગળ વધો/ }));

    expect(onAnswer).toHaveBeenCalledWith(question, false);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/વાંધો નહીં. વાક્ય ફરી સાંભળો/)).toBeTruthy();
  });

  it("asks her to say it and tap done when the browser can't listen", async () => {
    const user = userEvent.setup();
    delete w.SpeechRecognition;
    const onAnswer = renderQuestion();

    expect(screen.getByText("મોટેથી બોલો, પછી ✓ દબાવો.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "બોલો" })).toBeNull();
    await user.click(screen.getByRole("button", { name: /મેં બોલી લીધું/ }));
    expect(onAnswer).toHaveBeenCalledWith(question, true);
    expect(screen.getByText("સરસ! બરાબર બોલ્યા.")).toBeTruthy();
  });

  it("switches to the tap-done way when the microphone is not allowed", async () => {
    const user = userEvent.setup();
    localStorage.setItem("guj-eng.mic-note.v1", "1");
    plans = [{ error: "not-allowed" }];
    const onAnswer = renderQuestion();

    await user.click(screen.getByRole("button", { name: "બોલો" }));
    expect(await screen.findByText(/માઇક ચાલુ ન થયું/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /મેં બોલી લીધું/ }));
    expect(onAnswer).toHaveBeenCalledWith(question, true);
  });
});
