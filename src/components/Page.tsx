import { useEffect, type ReactNode } from 'react';
import { gu } from '../i18n/gu';
import { plainText } from '../lib/richText';
import { GuText } from './GuText';

type PageProps = {
  title: string;
  children?: ReactNode;
};

/** Common page frame: the Gujarati page title (h1), also used as the browser tab title. */
export function Page({ title, children }: PageProps) {
  useEffect(() => {
    document.title = `${plainText(title)} · ${gu.appName}`;
  }, [title]);

  return (
    <>
      <h1 className="mb-4 text-2xl leading-snug font-bold">
        <GuText text={title} />
      </h1>
      {children}
    </>
  );
}
