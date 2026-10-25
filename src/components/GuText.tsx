import { parseRichText } from '../lib/richText';
import { En } from './En';

/** Gujarati text where English written as {{en:word}} is shown with the <En> component. */
export function GuText({ text }: { text: string }) {
  return (
    <>
      {parseRichText(text).map((part, i) =>
        part.kind === 'en' ? <En key={i}>{part.text}</En> : part.text,
      )}
    </>
  );
}
