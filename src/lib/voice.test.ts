import { describe, expect, it } from 'vitest';
import { pickVoice, SLOW_RATE, speechRate } from './voice';

const v = (lang: string, name = lang) => ({ lang, name });

describe('pickVoice', () => {
  it('prefers the chosen language', () => {
    const voices = [v('en-US'), v('en-IN'), v('en-GB')];
    expect(pickVoice(voices, 'en-IN')?.lang).toBe('en-IN');
    expect(pickVoice(voices, 'en-GB')?.lang).toBe('en-GB');
  });

  it('treats en_IN and en-IN as the same', () => {
    expect(pickVoice([v('en_IN')], 'en-IN')?.lang).toBe('en_IN');
    expect(pickVoice([v('EN-in')], 'en-IN')?.lang).toBe('EN-in');
  });

  it('falls back to en-GB, then en-US, then any English voice', () => {
    expect(pickVoice([v('en-US'), v('en-GB')], 'en-IN')?.lang).toBe('en-GB');
    expect(pickVoice([v('hi-IN'), v('en-US')], 'en-IN')?.lang).toBe('en-US');
    expect(pickVoice([v('hi-IN'), v('en-AU')], 'en-IN')?.lang).toBe('en-AU');
    expect(pickVoice([v('en')], 'en-IN')?.lang).toBe('en');
  });

  it('takes the first voice of the language', () => {
    const voices = [v('en-IN', 'first'), v('en-IN', 'second')];
    expect(pickVoice(voices, 'en-IN')?.name).toBe('first');
  });

  it('returns nothing when there is no English voice', () => {
    expect(pickVoice([], 'en-IN')).toBeUndefined();
    expect(
      pickVoice([v('hi-IN'), v('gu-IN'), v('english')], 'en-IN'),
    ).toBeUndefined();
  });
});

describe('speechRate', () => {
  it('uses the setting normally and 0.6 when slow', () => {
    expect(speechRate(false, 0.9)).toBe(0.9);
    expect(speechRate(true, 0.9)).toBe(SLOW_RATE);
    expect(SLOW_RATE).toBe(0.6);
  });
});
