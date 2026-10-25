// Remembers which topics are finished, in this browser only (localStorage).
import { useSyncExternalStore } from "react";

const KEY = "guj-eng.completed.v1";

function read(): Set<string> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return new Set(Array.isArray(value) ? value.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

let completed = read();
const listeners = new Set<() => void>();

function save(next: Set<string>) {
  completed = next;
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // Storage can be blocked (private mode). Progress then lasts only for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      completed = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCompleted(): Set<string> {
  return useSyncExternalStore(subscribe, () => completed);
}

export function markComplete(topicId: string) {
  if (completed.has(topicId)) return;
  save(new Set([...completed, topicId]));
}

export function resetProgress() {
  save(new Set());
}
