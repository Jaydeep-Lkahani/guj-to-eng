/**
 * Dates are the device's local date as YYYY-MM-DD (pending.md 7.6).
 * Everything that needs "now" goes through here, so tests can inject a clock.
 */

let clock: () => Date = () => new Date();

/** Replaces the clock (tests only). */
export function setClock(next: () => Date): void {
  clock = next;
}

export function resetClock(): void {
  clock = () => new Date();
}

export function now(): Date {
  return clock();
}

export function nowIso(): string {
  return now().toISOString();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today's local date as YYYY-MM-DD. */
export function today(): string {
  return toDateString(now());
}

/** Adds whole days to a YYYY-MM-DD date (negative days go back). Handles month and year ends. */
export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number) as [
    number,
    number,
    number,
  ];
  return toDateString(new Date(year, month - 1, day + days));
}
