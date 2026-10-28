import { Check, Eye, SpeakerHigh } from "@phosphor-icons/react";
import type { Example } from "../content";

type Props = {
  ex: Example;
  index: number;
  // Interactive once the browser shows it can play sound (or in "hide meaning" mode).
  interactive: boolean;
  speakable: boolean;
  playing: boolean;
  heard: boolean;
  masked: boolean; // Gujarati meaning hidden until tapped
  onTap: () => void;
};

// One example: English, how to say it, and the Gujarati meaning.
// The whole card is a button: it reads the English aloud and, in self-test mode, shows the meaning.
export function ExampleCard({ ex, index, interactive, speakable, playing, heard, masked, onTap }: Props) {
  const content = (
    <>
      <span lang="en" className="example-en">
        {ex.en}
      </span>
      <span className="visually-hidden"> – </span>
      <span className="example-translit">
        {ex.translit}
        {speakable && (
          <span className="example-speaker" aria-hidden="true">
            {playing ? (
              <span className="eq">
                <i />
                <i />
                <i />
              </span>
            ) : (
              <SpeakerHigh weight="duotone" />
            )}
          </span>
        )}
      </span>
      <span className="visually-hidden"> – </span>
      <span className="example-gu-wrap">
        <span className="example-gu" aria-hidden={masked || undefined}>
          {ex.gu}
        </span>
        {masked && (
          <span className="example-mask">
            <Eye weight="bold" aria-hidden="true" />
            અર્થ જુઓ
          </span>
        )}
      </span>
      {heard && (
        <span className="example-heard" aria-hidden="true">
          <Check weight="bold" />
        </span>
      )}
    </>
  );

  const style = { "--i": index % 12 } as React.CSSProperties;
  if (!interactive) {
    return (
      <li className="example" style={style}>
        {content}
      </li>
    );
  }

  const cls = ["example", "example-speak", playing && "is-playing", masked && "is-masked", heard && "is-heard"]
    .filter(Boolean)
    .join(" ");
  return (
    <li className={cls} style={style} data-index={index}>
      <button type="button" className="example-play" onClick={onTap} onPointerMove={spotlight}>
        {content}
        {speakable && <span className="visually-hidden"> (સાંભળો)</span>}
      </button>
    </li>
  );
}

// A soft light that follows the pointer on the card.
export function spotlight(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}
