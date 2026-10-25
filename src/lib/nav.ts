export type NavSection = 'home' | 'learn' | 'review' | 'progress' | 'more';

const SECTION_PREFIXES: readonly (readonly [NavSection, readonly string[]])[] =
  [
    ['learn', ['/learn', '/topic', '/lesson', '/test']],
    ['review', ['/review', '/practice']],
    ['progress', ['/progress']],
    ['more', ['/more', '/videos', '/words', '/mistakes', '/settings', '/help']],
  ];

function startsWithSegment(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Which bottom-navigation item is highlighted for a given URL path. */
export function navSectionFor(pathname: string): NavSection | null {
  if (pathname === '/') return 'home';
  for (const [section, prefixes] of SECTION_PREFIXES) {
    if (prefixes.some((prefix) => startsWithSegment(pathname, prefix)))
      return section;
  }
  return null;
}
