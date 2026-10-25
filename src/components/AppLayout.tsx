import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <>
      <main className="mx-auto min-h-dvh max-w-[640px] px-4 pt-6 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
