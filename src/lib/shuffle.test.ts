import { describe, expect, it } from 'vitest';
import type { Exercise } from '../schema/content';
import { reshuffleOptions, shuffle, shuffleDifferent } from './shuffle';

function sequence(values: number[]) {
  let i = 0;
  return () => values[i++ % values.length] as number;
}

describe('shuffle', () => {
  it('returns a new array with the same items', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).not.toBe(input);
    expect([...result].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles empty and single-item lists', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(['a'])).toEqual(['a']);
  });
});

describe('shuffleDifferent', () => {
  it('does not return the first order when items differ', () => {
    // random() = 0.999 keeps every item in place (j = i), so the first try equals the input.
    const result = shuffleDifferent(
      ['a', 'b', 'c'],
      sequence([0.999, 0.999, 0, 0]),
    );
    expect(result).not.toEqual(['a', 'b', 'c']);
  });

  it('stops for lists that cannot change', () => {
    expect(shuffleDifferent(['a', 'a'], () => 0.5)).toEqual(['a', 'a']);
    expect(shuffleDifferent(['a'])).toEqual(['a']);
  });
});

describe('reshuffleOptions', () => {
  const base = { id: 'x', promptGu: 'પ્રશ્ન', explainGu: 'કારણ' };

  it('keeps the answer on the right option', () => {
    const exercise: Exercise = {
      ...base,
      type: 'mcq',
      options: ['a', 'b', 'C', 'd'],
      answer: 2,
    };
    for (let i = 0; i < 30; i++) {
      const result = reshuffleOptions(exercise);
      if (result.type !== 'mcq') throw new Error('type changed');
      expect([...result.options].sort()).toEqual(['C', 'a', 'b', 'd']);
      expect(result.options[result.answer]).toBe('C');
    }
  });

  it('works for listenChoose', () => {
    const exercise: Exercise = {
      ...base,
      type: 'listenChoose',
      audio: 'Ball',
      options: ['Ball', 'Cat', 'Dog'],
      answer: 0,
    };
    const result = reshuffleOptions(exercise);
    if (result.type !== 'listenChoose') throw new Error('type changed');
    expect(result.options[result.answer]).toBe('Ball');
  });

  it('leaves other types unchanged', () => {
    const exercise: Exercise = {
      ...base,
      type: 'trueFalse',
      statementEn: 'b = d',
      answer: false,
    };
    expect(reshuffleOptions(exercise)).toBe(exercise);
  });
});
