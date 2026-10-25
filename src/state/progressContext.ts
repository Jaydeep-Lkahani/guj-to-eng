import { createContext, useContext, type Dispatch } from 'react';
import type { Progress } from '../schema/progress';
import type { ProgressAction } from './progressReducer';

export type BrokenProgress = { raw: string; brokenKey: string; detail: string };

export type ProgressContextValue = {
  progress: Progress;
  dispatch: Dispatch<ProgressAction>;
  /** The saved text could not be read. Nothing is saved until she chooses to start fresh. */
  broken: BrokenProgress | null;
  /** The browser has no storage, or refused the last save. */
  saveProblem: boolean;
  /** Only after she confirmed: starts with empty progress. The unreadable text stays under its broken key. */
  startFresh: () => void;
};

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress needs a <ProgressProvider>');
  return value;
}
