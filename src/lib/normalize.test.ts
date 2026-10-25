import { describe, expect, it } from 'vitest';
import { normalizeAnswer } from './normalize';

describe('normalizeAnswer', () => {
  it('trims and collapses spaces', () => {
    expect(normalizeAnswer('  I   am   Hetal ')).toBe('i am hetal');
  });

  it('collapses tabs and new lines', () => {
    expect(normalizeAnswer('I\tam\nhere')).toBe('i am here');
  });

  it('lower-cases', () => {
    expect(normalizeAnswer('APPLE')).toBe('apple');
  });

  it('turns curly quotes and apostrophes into straight ones', () => {
    expect(normalizeAnswer('I’m “home”')).toBe('i\'m "home"');
    expect(normalizeAnswer('don‘t')).toBe("don't");
  });

  it.each(['Hello.', 'Hello!', 'Hello?'])(
    'removes a final mark from %s',
    (text) => {
      expect(normalizeAnswer(text)).toBe('hello');
    },
  );

  it('removes only one final mark', () => {
    expect(normalizeAnswer('Really?!')).toBe('really?');
  });

  it('keeps marks inside the sentence', () => {
    expect(normalizeAnswer('Yes. No.')).toBe('yes. no');
  });

  it('removes a final mark even when spaces follow it', () => {
    expect(normalizeAnswer('Hello.  ')).toBe('hello');
  });

  it('returns an empty string for empty or blank input', () => {
    expect(normalizeAnswer('')).toBe('');
    expect(normalizeAnswer('   ')).toBe('');
  });

  it('leaves Gujarati text unchanged', () => {
    expect(normalizeAnswer('સફરજન')).toBe('સફરજન');
  });
});
