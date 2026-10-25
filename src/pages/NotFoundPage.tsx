import { HomeButton } from '../components/HomeButton';
import { Page } from '../components/Page';
import { gu } from '../i18n/gu';

export function NotFoundPage() {
  return (
    <Page title={gu.pages.notFound}>
      <p className="mb-6">{gu.notFound.message}</p>
      <HomeButton />
    </Page>
  );
}
