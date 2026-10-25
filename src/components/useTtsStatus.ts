import { useSyncExternalStore } from 'react';
import { tts, type TtsStatus } from '../services/tts';

export function useTtsStatus(): TtsStatus {
  return useSyncExternalStore(tts.subscribe, tts.getStatus);
}
