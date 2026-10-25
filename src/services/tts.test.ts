import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTts } from './tts';

type FakeVoice = { lang: string; name: string };

class FakeSynth extends EventTarget {
  voices: FakeVoice[] = [];
  spoken: { text: string; rate: number; lang: string; voice: string }[] = [];
  cancelled = 0;
  getVoices() {
    return this.voices;
  }
  cancel() {
    this.cancelled += 1;
  }
  speak(u: { text: string; rate: number; lang: string; voice: FakeVoice }) {
    this.spoken.push({
      text: u.text,
      rate: u.rate,
      lang: u.lang,
      voice: u.voice.name,
    });
  }
}

class FakeUtterance {
  voice: FakeVoice | null = null;
  lang = '';
  rate = 1;
  text: string;
  constructor(text: string) {
    this.text = text;
  }
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function setup(voices: FakeVoice[] = []) {
  const synth = new FakeSynth();
  synth.voices = voices;
  const tts = createTts({
    synth: () => synth as unknown as SpeechSynthesis,
    waitMs: 3000,
  });
  return { synth, tts };
}

describe('status', () => {
  it('is none when the browser has no speech synthesis', () => {
    expect(createTts({ synth: () => undefined }).getStatus()).toBe('none');
  });

  it('is ready when an English voice is there from the start', () => {
    expect(setup([{ lang: 'en-IN', name: 'a' }]).tts.getStatus()).toBe('ready');
  });

  it('is none when voices exist but none is English', () => {
    expect(setup([{ lang: 'hi-IN', name: 'a' }]).tts.getStatus()).toBe('none');
  });

  it('waits for voices, then becomes ready on voiceschanged', () => {
    const { synth, tts } = setup();
    const listener = vi.fn();
    tts.subscribe(listener);
    expect(tts.getStatus()).toBe('loading');
    synth.voices = [{ lang: 'en_IN', name: 'a' }];
    synth.dispatchEvent(new Event('voiceschanged'));
    expect(tts.getStatus()).toBe('ready');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('becomes none when no voice arrives in time', () => {
    const { tts } = setup();
    const listener = vi.fn();
    tts.subscribe(listener);
    vi.advanceTimersByTime(2999);
    expect(tts.getStatus()).toBe('loading');
    vi.advanceTimersByTime(2);
    expect(tts.getStatus()).toBe('none');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('can still become ready after the wait', () => {
    const { synth, tts } = setup();
    tts.subscribe(() => undefined);
    vi.advanceTimersByTime(4000);
    synth.voices = [{ lang: 'en-GB', name: 'late' }];
    synth.dispatchEvent(new Event('voiceschanged'));
    expect(tts.getStatus()).toBe('ready');
  });

  it('stops telling a listener that unsubscribed', () => {
    const { synth, tts } = setup();
    const listener = vi.fn();
    const unsubscribe = tts.subscribe(listener);
    unsubscribe();
    synth.voices = [{ lang: 'en-IN', name: 'a' }];
    synth.dispatchEvent(new Event('voiceschanged'));
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('speak', () => {
  const voices = [
    { lang: 'en-US', name: 'us' },
    { lang: 'en-IN', name: 'india' },
  ];

  it('cancels earlier speech, then speaks with the chosen voice and rate', () => {
    const { synth, tts } = setup(voices);
    tts.speak('Apple', { lang: 'en-IN', rate: 0.9 });
    expect(synth.cancelled).toBe(1);
    expect(synth.spoken).toEqual([
      { text: 'Apple', rate: 0.9, lang: 'en-IN', voice: 'india' },
    ]);
  });

  it('speaks slowly when asked for the slow rate', () => {
    const { synth, tts } = setup(voices);
    tts.speak('Apple', { lang: 'en-US', rate: 0.6 });
    expect(synth.spoken[0]).toMatchObject({ rate: 0.6, voice: 'us' });
  });

  it('says nothing when there is no English voice', () => {
    const { synth, tts } = setup([{ lang: 'hi-IN', name: 'a' }]);
    tts.speak('Apple', { lang: 'en-IN', rate: 0.9 });
    expect(synth.spoken).toEqual([]);
    expect(synth.cancelled).toBe(0);
  });

  it('does nothing without speech synthesis', () => {
    expect(() =>
      createTts({ synth: () => undefined }).speak('Apple', {
        lang: 'en-IN',
        rate: 0.9,
      }),
    ).not.toThrow();
  });
});
