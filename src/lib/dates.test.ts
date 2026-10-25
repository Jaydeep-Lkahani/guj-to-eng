import { afterEach, describe, expect, it } from 'vitest';
import {
  addDays,
  now,
  nowIso,
  resetClock,
  setClock,
  today,
  toDateString,
} from './dates';

afterEach(() => resetClock());

describe('toDateString', () => {
  it('uses the local date with zero padding', () => {
    expect(toDateString(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    expect(toDateString(new Date(2026, 11, 31, 0, 0))).toBe('2026-12-31');
  });
});

describe('clock', () => {
  it('today() and now() follow the injected clock', () => {
    setClock(() => new Date(2026, 9, 25, 8, 30));
    expect(today()).toBe('2026-10-25');
    expect(now().getHours()).toBe(8);
    expect(nowIso()).toBe(new Date(2026, 9, 25, 8, 30).toISOString());
  });

  it('resetClock goes back to the real time', () => {
    setClock(() => new Date(2000, 0, 1));
    resetClock();
    expect(Math.abs(now().getTime() - Date.now())).toBeLessThan(5000);
  });
});

describe('addDays', () => {
  it('adds days inside a month', () => {
    expect(addDays('2026-10-25', 1)).toBe('2026-10-26');
    expect(addDays('2026-10-25', 30)).toBe('2026-11-24');
  });

  it('crosses month ends', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-04-30', 1)).toBe('2026-05-01');
  });

  it('crosses the end of February in a normal and in a leap year', () => {
    expect(addDays('2027-02-28', 1)).toBe('2027-03-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01');
  });

  it('crosses year ends in both directions', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31');
  });

  it('adds zero and goes back', () => {
    expect(addDays('2026-03-01', 0)).toBe('2026-03-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
});
