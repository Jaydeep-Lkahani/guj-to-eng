import { Outlet } from 'react-router';
import { useProgress } from '../state/progressContext';
import { BottomNav } from './BottomNav';
import { BrokenProgress } from './BrokenProgress';
import { SaveNotice } from './SaveNotice';

export function AppLayout() {
  const { broken } = useProgress();

  // Unreadable progress: nothing else is shown until she has decided (pending.md 7.5).
  if (broken) {
    return (
      <main className="mx-auto min-h-dvh max-w-[640px] px-4 pt-6 pb-8">
        <BrokenProgress />
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto min-h-dvh max-w-[640px] px-4 pt-6 pb-28">
        <SaveNotice />
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
