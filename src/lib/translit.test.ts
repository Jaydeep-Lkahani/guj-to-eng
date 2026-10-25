import { describe, expect, it } from 'vitest';
import { translitMode } from './translit';

describe('translitMode', () => {
  it('auto follows the phase', () => {
    expect(translitMode('auto', 'p1')).toBe('always');
    expect(translitMode('auto', 'p2')).toBe('tap');
    expect(translitMode('auto', 'p3')).toBe('never');
  });

  it('auto with an unknown phase shows nothing', () => {
    expect(translitMode('auto', undefined)).toBe('never');
  });

  it('a fixed setting wins in every phase', () => {
    for (const phase of ['p1', 'p2', 'p3']) {
      expect(translitMode('always', phase)).toBe('always');
      expect(translitMode('tap', phase)).toBe('tap');
      expect(translitMode('never', phase)).toBe('never');
    }
  });
});
