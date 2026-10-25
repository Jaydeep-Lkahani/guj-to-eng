import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { nowIso, now } from '../lib/dates';
import { createEmptyProgress } from '../lib/progress';
import {
  browserStorage,
  loadProgress,
  saveProgress,
  type LoadResult,
  type StorageLike,
} from '../services/storage';
import { ProgressContext, type BrokenProgress } from './progressContext';
import { progressReducer } from './progressReducer';

/** Progress is saved this long after the last change (pending.md 7.5). */
export const SAVE_DELAY_MS = 500;

type Props = {
  children: ReactNode;
  /** Defaults to the browser's localStorage. Tests pass their own. */
  storage?: StorageLike;
};

function startupProgress(result: LoadResult) {
  return result.kind === 'broken'
    ? createEmptyProgress(nowIso())
    : result.progress;
}

export function ProgressProvider({ children, storage }: Props) {
  const [target] = useState(() => storage ?? browserStorage());
  const [loaded] = useState<LoadResult>(() => loadProgress(target, now()));
  const [progress, dispatch] = useReducer(
    progressReducer,
    loaded,
    startupProgress,
  );
  const [broken, setBroken] = useState<BrokenProgress | null>(
    loaded.kind === 'broken'
      ? { raw: loaded.raw, brokenKey: loaded.brokenKey, detail: loaded.detail }
      : null,
  );
  const [saveFailed, setSaveFailed] = useState(false);

  // What is already in storage (or nothing to save yet). Changes are saved when `progress` differs.
  const saved = useRef(progress);
  const latest = useRef(progress);
  const blocked = useRef(broken !== null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
    if (blocked.current || latest.current === saved.current) return;
    const ok = saveProgress(target, latest.current);
    if (ok) saved.current = latest.current;
    setSaveFailed(!ok);
  }, [target]);

  useEffect(() => {
    latest.current = progress;
    if (blocked.current || progress === saved.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, SAVE_DELAY_MS);
  }, [progress, flush]);

  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [flush]);

  const startFresh = useCallback(() => {
    if (!blocked.current) return;
    blocked.current = false;
    setBroken(null);
    dispatch({ type: 'replace', progress: createEmptyProgress(nowIso()) });
  }, []);

  const value = useMemo(
    () => ({
      progress,
      dispatch,
      broken,
      saveProblem: loaded.kind === 'unavailable' || saveFailed,
      startFresh,
    }),
    [progress, broken, loaded.kind, saveFailed, startFresh],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
