import { Link } from 'react-router';
import { gu } from '../i18n/gu';

export function HomeButton() {
  return (
    <Link
      to="/"
      className="bg-primary inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl px-6 font-bold text-white"
    >
      {gu.notFound.homeButton}
    </Link>
  );
}
