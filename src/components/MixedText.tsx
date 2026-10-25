// Gujarati text that can contain English words marked like [[Water]].
// English parts get lang="en" and a slightly different style.
export function MixedText({ text }: { text: string }) {
  const pieces = text.split(/\[\[(.+?)\]\]/);
  return (
    <>
      {pieces.map((piece, i) =>
        i % 2 === 1 ? (
          <En key={i}>{piece}</En>
        ) : (
          piece
        ),
      )}
    </>
  );
}

export function En({ children }: { children: string }) {
  return (
    <span lang="en" className="en">
      {children}
    </span>
  );
}

const gujaratiLetters = /[઀-૿]/;

// For short strings like quiz options that are either all English or all Gujarati.
export function AutoText({ text }: { text: string }) {
  if (text.includes("[[")) return <MixedText text={text} />;
  return gujaratiLetters.test(text) ? <>{text}</> : <En>{text}</En>;
}
