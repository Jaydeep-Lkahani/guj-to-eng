import { gu } from '../i18n/gu';
import { Page } from './Page';

/** A page that is not built yet. Shows its Gujarati title and a gentle note. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Page title={title}>
      <p className="text-muted">{gu.placeholder.comingSoon}</p>
    </Page>
  );
}
