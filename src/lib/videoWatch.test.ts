import { describe, expect, it } from 'vitest';
import { isWatched, playableLength, resumeSeconds } from './videoWatch';

describe('playableLength', () => {
  it('is the duration for a whole video', () => {
    expect(playableLength(600)).toBe(600);
  });

  it('uses start and end of a cut video', () => {
    expect(playableLength(600, 60, 360)).toBe(300);
    expect(playableLength(600, 60)).toBe(540);
    expect(playableLength(600, undefined, 100)).toBe(100);
  });
});

describe('isWatched', () => {
  it('is true at 90 % and after', () => {
    expect(isWatched(540, 600)).toBe(true);
    expect(isWatched(600, 600)).toBe(true);
  });

  it('is false before 90 %', () => {
    expect(isWatched(539, 600)).toBe(false);
    expect(isWatched(0, 600)).toBe(false);
  });

  it('measures a cut video from its start', () => {
    // Length 300, from 60 to 360: 90 % = 270 seconds in, so position 330.
    expect(isWatched(329, 600, 60, 360)).toBe(false);
    expect(isWatched(330, 600, 60, 360)).toBe(true);
  });

  it('is false when the length is not known yet', () => {
    expect(isWatched(10, 0)).toBe(false);
    expect(isWatched(10, Number.NaN)).toBe(false);
  });
});

describe('resumeSeconds', () => {
  const saved = (lastPosition: number, watched = false) => ({
    lastPosition,
    duration: 600,
    watched,
  });

  it('starts at the beginning with no saved position', () => {
    expect(resumeSeconds({}, undefined)).toBe(0);
    expect(resumeSeconds({ startSeconds: 30 }, undefined)).toBe(30);
  });

  it('resumes at the saved position, rounded down', () => {
    expect(resumeSeconds({}, saved(123.8))).toBe(123);
  });

  it('starts again when the video was already watched', () => {
    expect(resumeSeconds({}, saved(590, true))).toBe(0);
    expect(resumeSeconds({ startSeconds: 30 }, saved(590, true))).toBe(30);
  });

  it('never starts before the cut start, or after the cut end', () => {
    expect(resumeSeconds({ startSeconds: 60 }, saved(10))).toBe(60);
    expect(
      resumeSeconds({ startSeconds: 60, endSeconds: 360 }, saved(400)),
    ).toBe(60);
  });
});
