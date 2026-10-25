import {
  BookOpen,
  ChartNoAxesColumn,
  Ellipsis,
  House,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { gu } from '../i18n/gu';
import { navSectionFor, type NavSection } from '../lib/nav';

const ITEMS: readonly {
  section: NavSection;
  to: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { section: 'home', to: '/', label: gu.nav.home, Icon: House },
  { section: 'learn', to: '/learn', label: gu.nav.learn, Icon: BookOpen },
  { section: 'review', to: '/review', label: gu.nav.review, Icon: RefreshCw },
  {
    section: 'progress',
    to: '/progress',
    label: gu.nav.progress,
    Icon: ChartNoAxesColumn,
  },
  { section: 'more', to: '/more', label: gu.nav.more, Icon: Ellipsis },
];

/** Bottom navigation, always visible (pending.md 7.8). */
export function BottomNav() {
  const active = navSectionFor(useLocation().pathname);

  return (
    <nav
      aria-label={gu.nav.ariaLabel}
      className="bg-surface fixed inset-x-0 bottom-0 z-10 border-t border-black/10 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-[640px] gap-2 px-2 py-1">
        {ITEMS.map(({ section, to, label, Icon }) => {
          const isActive = section === active;
          return (
            <li key={section} className="min-w-0 flex-1">
              <Link
                to={to}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-14 min-w-12 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 text-sm leading-tight ${
                  isActive ? 'text-primary font-bold' : 'text-muted'
                }`}
              >
                <Icon
                  aria-hidden="true"
                  size={24}
                  strokeWidth={isActive ? 2.75 : 2}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
