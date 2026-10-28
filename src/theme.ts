// Light / dark theme. Follows the phone or computer setting until she picks one,
// then remembers her choice in this browser.
// index.html sets the theme before the page draws, so there is no white flash.
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const KEY = "guj-eng.theme.v1";
const metaColors: Record<Theme, string> = { light: "#f6f7fb", dark: "#0d1020" };

const darkQuery =
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

let theme: Theme = readStored() ?? (darkQuery?.matches ? "dark" : "light");
const listeners = new Set<() => void>();

function apply(next: Theme) {
  theme = next;
  document.documentElement.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", metaColors[next]);
  listeners.forEach((l) => l());
}

// Not when the build pre-renders pages (there is no document then).
if (typeof document !== "undefined") apply(theme);

// If she never picked a theme, keep following the device setting.
darkQuery?.addEventListener("change", (e) => {
  if (!readStored()) apply(e.matches ? "dark" : "light");
});

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, () => theme, () => "light" as Theme);
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

// Switch theme. When the browser supports it, the new theme grows as a circle
// from the toggle button.
export function setTheme(next: Theme, from?: { x: number; y: number }) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Storage blocked: the choice lasts for this visit only.
  }

  const doc = document as ViewTransitionDoc;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || !from || reduceMotion) {
    apply(next);
    return;
  }

  const radius = Math.hypot(
    Math.max(from.x, window.innerWidth - from.x),
    Math.max(from.y, window.innerHeight - from.y),
  );
  const transition = doc.startViewTransition(() => apply(next));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${from.x}px ${from.y}px)`,
            `circle(${radius}px at ${from.x}px ${from.y}px)`,
          ],
        },
        { duration: 480, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}
