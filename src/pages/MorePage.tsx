import {
  CircleHelp,
  CirclePlay,
  Languages,
  Settings,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import { Page } from '../components/Page';
import { gu } from '../i18n/gu';

const ITEMS: readonly { to: string; label: string; Icon: LucideIcon }[] = [
  { to: '/videos', label: gu.glossary.video, Icon: CirclePlay },
  { to: '/words', label: gu.glossary.myWords, Icon: Languages },
  { to: '/mistakes', label: gu.glossary.mistakes, Icon: TriangleAlert },
  { to: '/settings', label: gu.glossary.settings, Icon: Settings },
  { to: '/help', label: gu.glossary.help, Icon: CircleHelp },
];

export function MorePage() {
  return (
    <Page title={gu.pages.more}>
      <ul className="flex flex-col gap-2">
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="bg-surface flex min-h-14 items-center gap-3 rounded-xl border border-black/10 px-4"
            >
              <Icon aria-hidden="true" size={24} className="text-primary" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
