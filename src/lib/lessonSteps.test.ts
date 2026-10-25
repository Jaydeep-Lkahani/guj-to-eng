import { describe, expect, it } from 'vitest';
import type { LessonProgress } from '../schema/progress';
import {
  nextStep,
  previousStep,
  startStep,
  STEP,
  visibleSteps,
} from './lessonSteps';

const saved = (
  status: LessonProgress['status'],
  step: number,
): LessonProgress => ({
  status,
  step,
  bestQuiz: 0,
  quizAttempts: 0,
});

describe('visibleSteps', () => {
  it('shows all 9 steps when there is a warm-up and a video step', () => {
    expect(visibleSteps({ hasWarmup: true, hasVideoStep: true })).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  it('skips the warm-up when there is nothing to review', () => {
    expect(visibleSteps({ hasWarmup: false, hasVideoStep: true })).toEqual([
      2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  it('skips the video step', () => {
    expect(visibleSteps({ hasWarmup: true, hasVideoStep: false })).toEqual([
      1, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  it('can skip both', () => {
    expect(visibleSteps({ hasWarmup: false, hasVideoStep: false })).toEqual([
      3, 4, 5, 6, 7, 8, 9,
    ]);
  });
});

describe('startStep', () => {
  const all = visibleSteps({ hasWarmup: false, hasVideoStep: true });

  it('starts at the first visible step for a new lesson', () => {
    expect(startStep(all, undefined)).toBe(2);
  });

  it('resumes at the saved step', () => {
    expect(startStep(all, saved('in_progress', 5))).toBe(5);
  });

  it('moves forward when the saved step is not shown now', () => {
    expect(startStep(all, saved('in_progress', 1))).toBe(2);
    const noVideo = visibleSteps({ hasWarmup: false, hasVideoStep: false });
    expect(startStep(noVideo, saved('in_progress', 2))).toBe(3);
  });

  it('opens a completed lesson from the beginning', () => {
    expect(startStep(all, saved('completed', 9))).toBe(2);
  });

  it('never resumes an unfinished lesson at step 9', () => {
    expect(startStep(all, saved('in_progress', 9))).toBe(STEP.quiz);
  });
});

describe('nextStep and previousStep', () => {
  const visible = [1, 3, 4, 5, 6, 7, 8, 9];

  it('skip hidden steps', () => {
    expect(nextStep(1, visible)).toBe(3);
    expect(previousStep(3, visible)).toBe(1);
  });

  it('end at the first and last step', () => {
    expect(nextStep(9, visible)).toBeUndefined();
    expect(previousStep(1, visible)).toBeUndefined();
  });
});
