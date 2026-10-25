import { isGujaratiText } from '../lib/script';
import { En } from './En';
import { GuText } from './GuText';

/** Text that may be English (shown in <En>) or Gujarati with {{en:..}} markers (shown with <GuText>). */
export function MixedText({ text }: { text: string }) {
  return isGujaratiText(text) ? <GuText text={text} /> : <En>{text}</En>;
}
