import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { gu } from '../i18n/gu';
import { BROKEN_KEY_PREFIX, PROGRESS_KEY } from '../services/storage';
import { MemoryStorage } from '../test/memoryStorage';
import { renderAt } from '../test/renderRoutes';

const BAD = '{"schemaVersion":1,"lessons":';

afterEach(() => vi.restoreAllMocks());

function brokenStorage() {
  const storage = new MemoryStorage();
  storage.data.set(PROGRESS_KEY, BAD);
  return storage;
}

describe('unreadable saved progress', () => {
  it('shows only the Gujarati message: no lessons, no bottom navigation', () => {
    renderAt('/learn', brokenStorage());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      gu.progressSafety.brokenTitle,
    );
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(
      screen.getByText(gu.progressSafety.brokenMessage),
    ).toBeInTheDocument();
  });

  it('keeps a copy and leaves the saved text alone', () => {
    const storage = brokenStorage();
    renderAt('/learn', storage);
    const keys = [...storage.data.keys()];
    const copy = keys.find((k) => k.startsWith(BROKEN_KEY_PREFIX));
    expect(copy).toBeDefined();
    expect(storage.data.get(copy as string)).toBe(BAD);
    expect(storage.data.get(PROGRESS_KEY)).toBe(BAD);
  });

  it('offers the unreadable text as a download', async () => {
    const created: Blob[] = [];
    URL.createObjectURL = vi.fn((blob: Blob) => {
      created.push(blob);
      return 'blob:test';
    });
    URL.revokeObjectURL = vi.fn();
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    renderAt('/', brokenStorage());
    await userEvent.click(
      screen.getByRole('button', { name: gu.progressSafety.downloadBackup }),
    );
    expect(click).toHaveBeenCalledTimes(1);
    expect(created).toHaveLength(1);
    expect(await created[0]!.text()).toBe(BAD);
  });

  it('asks twice before starting fresh, and can go back', async () => {
    const user = userEvent.setup();
    renderAt('/', brokenStorage());
    await user.click(
      screen.getByRole('button', { name: gu.progressSafety.startFresh }),
    );
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveTextContent(gu.progressSafety.confirmTitle);
    await user.click(
      within(dialog).getByRole('button', { name: gu.progressSafety.confirmNo }),
    );
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      gu.progressSafety.brokenTitle,
    );
  });

  it('starts fresh only after the second confirmation, and keeps the broken copy', async () => {
    const user = userEvent.setup();
    const storage = brokenStorage();
    renderAt('/', storage);
    await user.click(
      screen.getByRole('button', { name: gu.progressSafety.startFresh }),
    );
    await user.click(
      screen.getByRole('button', { name: gu.progressSafety.confirmYes }),
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      gu.pages.dashboard,
    );
    await waitFor(() => expect(storage.data.get(PROGRESS_KEY)).not.toBe(BAD));
    const copy = [...storage.data.keys()].find((k) =>
      k.startsWith(BROKEN_KEY_PREFIX),
    );
    expect(storage.data.get(copy as string)).toBe(BAD);
  });
});

describe('save problems', () => {
  it('tells her when the browser has no storage', () => {
    const storage = new MemoryStorage();
    storage.getItem = () => {
      throw new Error('blocked');
    };
    renderAt('/learn', storage);
    expect(screen.getByRole('alert')).toHaveTextContent(
      gu.progressSafety.saveProblemTitle,
    );
  });

  it('says nothing when saving works', () => {
    renderAt('/learn');
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
