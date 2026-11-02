# ચાલો અંગ્રેજી શીખીએ

A simple static website that teaches English to a Gujarati speaker. All explanations are in Gujarati.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

To make the static site: `npm run build`. The `dist/` folder can be opened from any web host
(GitHub Pages, Netlify, a plain folder on a server). It needs no backend.

`npm run check` runs the type check, the tests (including a check of all content files) and the build.

## Content

Everything she reads lives in `content/`, not in the code.

- `content/parts.json` — the three parts and their topics, in order.
- `content/lessons/<topic id>.json` — one lesson per topic. A topic with no lesson file shows "જલ્દી આવશે" (coming soon).

### Add a topic

1. Add a line to the right part in `content/parts.json`, e.g.
   `{ "id": "p1-t11", "titleGu": "...", "titleEn": "..." }`.
2. Create `content/lessons/p1-t11.json`:

```json
{
  "topicId": "p1-t11",
  "explanationGu": ["Gujarati paragraph. Mark English words like [[Water]]."],
  "examples": [{ "en": "Water", "translit": "વૉટર", "gu": "પાણી" }],
  "practice": [
    {
      "type": "choice",
      "questionGu": "\"પાણી\" ને અંગ્રેજીમાં શું કહેવાય?",
      "options": ["Milk", "Water", "Tea"],
      "answer": 1,
      "explainGu": "Water – વૉટર – પાણી"
    }
  ]
}
```

`answer` is the position of the right option, counting from 0. `explainGu` is optional.

There is a second question type, "put the words in order". She taps shuffled word tiles to build the sentence:

```json
{
  "type": "order",
  "questionGu": "\"હું ચા પીઉં છું.\" ને અંગ્રેજીમાં ગોઠવો.",
  "words": ["I", "drink", "tea"],
  "end": ".",
  "explainGu": "I drink tea. – આઇ ડ્રિન્ક ટી."
}
```

`words` is the right order (the site shuffles them). Leave the full stop or question mark off the last word and put it in `end` (default `.`).

A third type, "say it aloud", asks her to say a sentence into the microphone. The site shows which words the phone heard; she passes when at least 80% were heard in order. On phones that can't listen she says it aloud and taps "done", which counts as right:

```json
{
  "type": "say",
  "questionGu": "\"મારી પાસે ગાડી છે.\" અંગ્રેજીમાં બોલો.",
  "text": "I have a car.",
  "translit": "આઇ હૅવ અ કાર.",
  "explainGu": "I have a car. – આઇ હૅવ અ કાર."
}
```

`text` is plain English (no Gujarati, no `[[ ]]`) and ends with `.`, `?` or `!`. `translit` is optional and shows under the sentence. Put 2–3 of these as the last questions of a lesson, picked from its examples.

A fourth type, "fill the labelled boxes", is word order with a label on every box (કોણ? શું કરે? શું? ક્યાં? ક્યારે? …). A piece can be a few words. If she puts a piece in the wrong box, the site says which box it belongs in:

```json
{
  "type": "build",
  "questionGu": "\"હું રોજ ચા પીઉં છું.\" ખાનામાં ગોઠવો.",
  "parts": [
    { "text": "I", "role": "who" },
    { "text": "drink", "role": "verb" },
    { "text": "tea", "role": "what" },
    { "text": "every day", "role": "when" }
  ],
  "end": ".",
  "explainGu": "I drink tea every day. – આઇ ડ્રિન્ક ટી એવરી ડે."
}
```

`role` is one of `who` (કોણ?), `verb` (શું કરે?), `helper` (મદદગાર: am, will, has, didn't …), `what` (શું?), `where` (ક્યાં?), `when` (ક્યારે?) and `link` (જોડતો શબ્દ: if, and, because …). Each has its own colour. Leave the end mark off the last piece and put it in `end`.

A lesson can also have `patterns`: colour pictures of a sentence shown at the end of "સમજીએ", with the Gujarati order above the English order. Each piece uses the same roles:

```json
"patterns": [
  {
    "titleGu": "ક્રિયા બીજા નંબરે આવે",
    "gu": [{ "text": "હું", "role": "who" }, { "text": "ચા", "role": "what" }, { "text": "પીઉં છું", "role": "verb" }],
    "en": [{ "text": "I", "role": "who" }, { "text": "drink", "role": "verb" }, { "text": "tea", "role": "what" }],
    "end": ".",
    "noteGu": "ગુજરાતીમાં ક્રિયા છેલ્લે, અંગ્રેજીમાં બીજા નંબરે."
  }
]
```
Every example card can be tapped to hear the English, using a recording from `public/audio/` (made with `npm run audio`, voice: Microsoft Neerja via the free `edge-tts` tool). A sentence with no recording falls back to the phone's built-in voice.

3. Run `npm test` to catch mistakes in the file.

Progress (finished topics) is saved in the browser's localStorage under `guj-eng.completed.v1`. The one-time microphone note is remembered under `guj-eng.mic-note.v1`.
