const GUJARATI = /[઀-૿]/;

/** True when the text contains Gujarati letters. */
export function hasGujarati(text: string): boolean {
  return GUJARATI.test(text);
}

/** Text that must be shown as Gujarati (with {{en:..}} markers) rather than as plain English. */
export function isGujaratiText(text: string): boolean {
  return hasGujarati(text) || text.includes('{{en:');
}
