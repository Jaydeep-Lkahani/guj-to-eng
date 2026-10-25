import { gu } from '../i18n/gu';
import { HomeButton } from './HomeButton';
import { Page } from './Page';

/** Shown when a page crashes, so the learner never sees an English error screen. */
export function RouteError() {
  return (
    <Page title={gu.states.errorTitle}>
      <p className="mb-6">{gu.states.errorMessage}</p>
      <HomeButton />
    </Page>
  );
}
