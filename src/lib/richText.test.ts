import { describe, expect, it } from 'vitest';
import {
  englishTokens,
  parseRichText,
  plainText,
  withoutEnglishTokens,
} from './richText';

describe('parseRichText', () => {
  it('returns one Gujarati part for plain text', () => {
    expect(parseRichText('નમસ્તે')).toEqual([{ kind: 'gu', text: 'નમસ્તે' }]);
  });

  it('splits English markers out of Gujarati text', () => {
    expect(parseRichText('આ {{en:Apple}} છે.')).toEqual([
      { kind: 'gu', text: 'આ ' },
      { kind: 'en', text: 'Apple' },
      { kind: 'gu', text: ' છે.' },
    ]);
  });

  it('handles markers at the start, the end and side by side', () => {
    expect(parseRichText('{{en:A}}{{en:B}}')).toEqual([
      { kind: 'en', text: 'A' },
      { kind: 'en', text: 'B' },
    ]);
  });

  it('keeps an unclosed marker as Gujarati text', () => {
    expect(parseRichText('ખોટું {{en:Apple')).toEqual([
      { kind: 'gu', text: 'ખોટું {{en:Apple' },
    ]);
  });

  it('returns nothing for an empty string', () => {
    expect(parseRichText('')).toEqual([]);
  });
});

describe('englishTokens', () => {
  it('lists the English words', () => {
    expect(englishTokens('{{en:A}} અને {{en:a}}')).toEqual(['A', 'a']);
  });

  it('returns an empty list when there are none', () => {
    expect(englishTokens('કંઈ નથી')).toEqual([]);
  });
});

describe('plainText and withoutEnglishTokens', () => {
  it('plainText keeps the English words', () => {
    expect(plainText('આ {{en:Apple}} છે')).toBe('આ Apple છે');
  });

  it('withoutEnglishTokens removes them', () => {
    expect(withoutEnglishTokens('આ {{en:Apple}} છે')).toBe('આ  છે');
  });
});
