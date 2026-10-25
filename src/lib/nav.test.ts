import { describe, expect, it } from 'vitest';
import { navSectionFor } from './nav';

describe('navSectionFor', () => {
  it.each([
    ['/', 'home'],
    ['/learn', 'learn'],
    ['/topic/p1-t01', 'learn'],
    ['/lesson/p1-t01-l01', 'learn'],
    ['/test/p1-final', 'learn'],
    ['/review', 'review'],
    ['/practice', 'review'],
    ['/progress', 'progress'],
    ['/more', 'more'],
    ['/videos', 'more'],
    ['/words', 'more'],
    ['/mistakes', 'more'],
    ['/settings', 'more'],
    ['/help', 'more'],
  ] as const)('%s highlights %s', (path, section) => {
    expect(navSectionFor(path)).toBe(section);
  });

  it('highlights nothing on the welcome page or an unknown page', () => {
    expect(navSectionFor('/welcome')).toBeNull();
    expect(navSectionFor('/nothing-here')).toBeNull();
  });

  it('does not match a path that only shares a prefix', () => {
    expect(navSectionFor('/learnings')).toBeNull();
    expect(navSectionFor('/helpers/x')).toBeNull();
  });
});
