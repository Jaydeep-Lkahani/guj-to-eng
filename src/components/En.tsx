import type { ReactNode } from 'react';

type EnProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Every piece of English on the site goes through this component (pending.md 7.9).
 * It marks the language for screen readers and text-to-speech, and uses the English font.
 */
export function En({ children, className }: EnProps) {
  return (
    <span lang="en" className={`font-en text-learn ${className ?? ''}`.trim()}>
      {children}
    </span>
  );
}
