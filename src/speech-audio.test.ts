// Checks that "Listen" plays the recorded MP3 when there is one, and falls back to the device voice when not.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./audio-manifest.json", () => ({
  default: { voice: "test", files: { "How are you?": "abc123.mp3" } },
}));

class FakeAudio {
  static made: FakeAudio[] = [];
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
  constructor(public src: string) {
    FakeAudio.made.push(this);
  }
}

const spoken: string[] = [];
class FakeUtterance {
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  voice = null;
  lang = "";
  rate = 1;
  constructor(public text: string) {}
}

async function loadSpeech() {
  vi.resetModules();
  const mod = await import("./speech");
  return mod;
}

beforeEach(() => {
  FakeAudio.made = [];
  spoken.length = 0;
  vi.stubGlobal("Audio", FakeAudio);
  vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
  vi.stubGlobal("speechSynthesis", {
    getVoices: () => [],
    cancel: vi.fn(),
    speak: (u: FakeUtterance) => spoken.push(u.text),
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("speak", () => {
  it("plays the recording when the sentence has one", async () => {
    const { speak } = await loadSpeech();
    const onEnd = vi.fn();
    speak("Neha: How are you?", onEnd);
    expect(FakeAudio.made.map((a) => a.src)).toEqual(["/audio/abc123.mp3"]);
    expect(spoken).toEqual([]);
    FakeAudio.made[0].onended?.();
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it("uses the device voice when there is no recording", async () => {
    const { speak } = await loadSpeech();
    speak("I drink tea.");
    expect(FakeAudio.made).toEqual([]);
    expect(spoken).toEqual(["I drink tea."]);
  });

  it("uses the device voice if the recording fails to load", async () => {
    const { speak } = await loadSpeech();
    speak("How are you?");
    FakeAudio.made[0].onerror?.();
    expect(spoken).toEqual(["How are you?"]);
  });

  it("stops the old sound and tells its button when a new one starts", async () => {
    const { speak } = await loadSpeech();
    const firstEnd = vi.fn();
    speak("How are you?", firstEnd);
    speak("I drink tea.");
    expect(FakeAudio.made[0].pause).toHaveBeenCalled();
    expect(firstEnd).toHaveBeenCalledOnce();
  });
});
