// Daily review: old practice questions come back just before she would forget them.
// Every question she answers sits in a "box" from 0 to 4. A right answer moves it up
// (it comes back later), a wrong answer sends it back to box 0 (it comes back tomorrow).
// Saved in this browser only (localStorage), like src/progress.ts.
import { useSyncExternalStore } from "react";
import { answerText, getLesson, allTopics, type Question } from "./content";

const KEY = "guj-eng.review.v1";

// Days until a question comes back, by box.
const GAPS = [1, 3, 7, 14, 30];
const LAST_BOX = GAPS.length - 1;
export const DAILY_SIZE = 15;
const DAYS_KEPT = 60;

export type Item = { box: number; due: string };
export type ReviewState = {
  items: Record<string, Item>;
  // Days (YYYY-MM-DD) she finished a review set; the streak counts these.
  days: string[];
  // True once her lessons finished before this feature were added to the review.
  seeded?: boolean;
};

const empty: ReviewState = { items: {}, days: [] };

// ---------- Dates: local calendar days, never timestamps ----------

const pad = (n: number) => String(n).padStart(2, "0");

export function toDay(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return toDay(new Date(y, m - 1, d + n));
}

export const today = () => toDay(new Date());

// ---------- Pure rules (tested in review.test.ts) ----------

// A short fixed code for a question, made from its text and answer, not its place in the lesson.
// Editing or reordering a lesson then doesn't scramble her review.
export function questionId(q: Question): string {
  const text = `${q.questionGu}|${answerText(q)}`;
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(36);
}

export function nextBox(box: number, right: boolean): number {
  return right ? Math.min(box + 1, LAST_BOX) : 0;
}

export function dueDate(box: number, from: string): string {
  return addDays(from, GAPS[Math.min(Math.max(box, 0), LAST_BOX)]);
}

// Records one answer. A right answer only moves a question up when it was due, so doing the
// same lesson twice in a day doesn't push everything to the top box.
export function answered(items: ReviewState["items"], id: string, right: boolean, from: string) {
  const old = items[id];
  if (right && old && old.due > from) return items;
  const box = nextBox(old?.box ?? 0, right);
  return { ...items, [id]: { box, due: dueDate(box, from) } };
}

// Today's questions: those due today or before, lowest box first, then the oldest due date.
// The rest stay due for another day.
export function todaysSet(items: ReviewState["items"], from: string, limit = DAILY_SIZE): string[] {
  return Object.entries(items)
    .filter(([, item]) => item.due <= from)
    .sort(([ia, a], [ib, b]) => a.box - b.box || a.due.localeCompare(b.due) || ia.localeCompare(ib))
    .slice(0, limit)
    .map(([id]) => id);
}

// How many questions are due on that day or before.
export function dueCount(items: ReviewState["items"], day: string): number {
  return Object.values(items).filter((item) => item.due <= day).length;
}

// How many questions are waiting today: nothing once she has finished today's set.
export function waitingToday(state: ReviewState, from: string, limit = DAILY_SIZE): number {
  if (state.days.includes(from)) return 0;
  return Math.min(dueCount(state.items, from), limit);
}

// The run of days in a row, ending today or yesterday (so a day not yet done doesn't break it).
export function streak(days: string[], from: string): number {
  const set = new Set(days);
  let day = set.has(from) ? from : addDays(from, -1);
  let n = 0;
  while (set.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

export function addDay(days: string[], day: string): string[] {
  return [...new Set([...days, day])].sort().slice(-DAYS_KEPT);
}

// Questions from lessons she finished before this feature existed: box 1, with their due dates
// spread over the next 7 days (starting today), so day one is not a wall of 200 questions.
export function seedItems(ids: string[], items: ReviewState["items"], from: string): ReviewState["items"] {
  const next = { ...items };
  let n = 0;
  for (const id of ids) {
    if (next[id]) continue;
    next[id] = { box: 1, due: addDays(from, n % 7) };
    n++;
  }
  return n === 0 ? items : next;
}

// Forgets saved questions that no longer exist in the lessons.
export function dropUnknown(items: ReviewState["items"], known: Set<string>): ReviewState["items"] {
  return Object.fromEntries(Object.entries(items).filter(([id]) => known.has(id)));
}

// ---------- Every question in the lessons ----------

export type Entry = { id: string; question: Question; topicId: string };

let catalog: Map<string, Entry> | undefined;

// id → question and its lesson, in course order. If two lessons share a question, the first one wins.
export function questionCatalog(): Map<string, Entry> {
  if (!catalog) {
    catalog = new Map();
    for (const topic of allTopics) {
      for (const question of getLesson(topic.id)?.practice ?? []) {
        const id = questionId(question);
        if (!catalog.has(id)) catalog.set(id, { id, question, topicId: topic.id });
      }
    }
  }
  return catalog;
}

// ---------- Saved state ----------

function read(): ReviewState {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!value || typeof value !== "object") return empty;
    const { items, days, seeded } = value as Partial<ReviewState>;
    const good: ReviewState["items"] = {};
    for (const [id, item] of Object.entries(items && typeof items === "object" ? items : {})) {
      if (item && typeof item.box === "number" && typeof item.due === "string") {
        good[id] = { box: Math.min(Math.max(Math.round(item.box), 0), LAST_BOX), due: item.due };
      }
    }
    return {
      items: good,
      days: Array.isArray(days) ? days.filter((d) => typeof d === "string") : [],
      seeded: seeded === true,
    };
  } catch {
    return empty;
  }
}

let state = read();
const listeners = new Set<() => void>();

function save(next: ReviewState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be blocked (private mode). The review then lasts only for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// The pre-built HTML is made with an empty review, so the first draw in the browser matches it.
export function useReview(): ReviewState {
  return useSyncExternalStore(subscribe, () => state, () => empty);
}

// Called after every answer, in a lesson or in the review.
export function recordAnswer(question: Question, right: boolean) {
  const id = questionId(question);
  save({ ...state, items: answered(state.items, id, right, today()) });
}

// Called when she finishes a review set.
export function finishReviewDay() {
  save({ ...state, days: addDay(state.days, today()) });
}

// Adds the questions of lessons she finished before this feature. Safe to call again and again.
export function seedReview(completed: Set<string>) {
  const known = new Set(questionCatalog().keys());
  let items = state.items;
  if (Object.keys(items).some((id) => !known.has(id))) items = dropUnknown(items, known);
  let seeded = state.seeded;
  if (!seeded && completed.size > 0) {
    const ids = [...questionCatalog().values()].filter((e) => completed.has(e.topicId)).map((e) => e.id);
    items = seedItems(ids, items, today());
    seeded = true;
  }
  if (items !== state.items || seeded !== state.seeded) save({ ...state, items, seeded });
}

export function resetReview() {
  save(empty);
}
