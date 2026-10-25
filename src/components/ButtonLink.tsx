import type { ReactNode } from 'react';
import { Link } from 'react-router';

/** A link that looks like the main button. */
export function ButtonLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="bg-primary inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl px-6 font-bold text-white"
    >
      {children}
    </Link>
  );
}
