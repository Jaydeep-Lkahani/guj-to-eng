import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gu } from '../i18n/gu';
import { createEmptyProgress } from '../lib/progress';
import { ProgressProvider } from '../state/ProgressProvider';
import { MemoryStorage } from '../test/memoryStorage';
import { AudioButton } from './AudioButton';
import { TtsNotice } from './TtsNotice';

const mocks = vi.hoisted(() => ({
  status: 'ready',
  speak: vi.fn(),
}));

vi.mock('../services/tts', () => ({
  tts: {
    getStatus: () => mocks.status,
    subscribe: () => () => undefined,
    speak: mocks.speak,
  },
}));

beforeEach(() => {
  mocks.status = 'ready';
  mocks.speak.mockClear();
});

afterEach(() => vi.restoreAllMocks());

function renderWith(ui: React.ReactNode, storage = new MemoryStorage()) {
  return render(<ProgressProvider storage={storage}>{ui}</ProgressProvider>);
}

describe('AudioButton', () => {
  it('speaks at the voice speed of the settings, and slowly at 0.6', async () => {
    const user = userEvent.setup();
    renderWith(<AudioButton text="Apple" />);
    await user.click(screen.getByRole('button', { name: gu.audio.listen }));
    expect(mocks.speak).toHaveBeenLastCalledWith('Apple', {
      lang: 'en-IN',
      rate: 0.9,
    });
    await user.click(
      screen.getByRole('button', { name: gu.audio.listenSlowly }),
    );
    expect(mocks.speak).toHaveBeenLastCalledWith('Apple', {
      lang: 'en-IN',
      rate: 0.6,
    });
  });

  it('uses the voice language and speed from the saved settings', async () => {
    const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
    progress.settings.voiceLang = 'en-GB';
    progress.settings.voiceRate = 0.8;
    const user = userEvent.setup();
    renderWith(
      <AudioButton text="Apple" />,
      new MemoryStorage().seed(progress),
    );
    await user.click(screen.getByRole('button', { name: gu.audio.listen }));
    expect(mocks.speak).toHaveBeenLastCalledWith('Apple', {
      lang: 'en-GB',
      rate: 0.8,
    });
  });

  it('never puts the spoken text in the labels (listening exercises must not give the answer)', () => {
    renderWith(<AudioButton text="Secret" />);
    for (const button of screen.getAllByRole('button')) {
      expect(button.getAttribute('aria-label')).not.toContain('Secret');
    }
  });

  it('is at least 48 x 48 px', () => {
    renderWith(<AudioButton text="Apple" />);
    for (const button of screen.getAllByRole('button')) {
      expect(button.className).toContain('size-12');
    }
  });

  it('is shown while voices are still loading', () => {
    mocks.status = 'loading';
    renderWith(<AudioButton text="Apple" />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('is hidden when there is no English voice', () => {
    mocks.status = 'none';
    renderWith(<AudioButton text="Apple" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('TtsNotice', () => {
  it('explains how to add an English voice, only when there is none', () => {
    mocks.status = 'none';
    const { unmount } = renderWith(<TtsNotice />);
    expect(screen.getByRole('note')).toHaveTextContent(gu.audio.noVoiceBefore);
    expect(
      screen.getByRole('note').querySelector('[lang="en"]'),
    ).toHaveTextContent('Text-to-speech');
    unmount();
    mocks.status = 'ready';
    renderWith(<TtsNotice />);
    expect(screen.queryByRole('note')).toBeNull();
  });
});
