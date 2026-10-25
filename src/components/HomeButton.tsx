import { gu } from '../i18n/gu';
import { ButtonLink } from './ButtonLink';

export function HomeButton() {
  return <ButtonLink to="/">{gu.notFound.homeButton}</ButtonLink>;
}
