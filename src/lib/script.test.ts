import { describe, expect, it } from 'vitest';
import { hasGujarati, isGujaratiText } from './script';

describe('script helpers', () => {
  it('finds Gujarati letters', () => {
    expect(hasGujarati('સફરજન')).toBe(true);
    expect(hasGujarati('Apple')).toBe(false);
    expect(hasGujarati('')).toBe(false);
  });

  it('treats text with English markers as Gujarati text', () => {
    expect(isGujaratiText('{{en:Apple}}')).toBe(true);
    expect(isGujaratiText('a, b, c')).toBe(false);
    expect(isGujaratiText('સાચું')).toBe(true);
  });
});
