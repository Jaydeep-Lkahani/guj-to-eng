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

3. Run `npm test` to catch mistakes in the file.

Progress (finished topics) is saved in the browser's localStorage under `guj-eng.completed.v1`.
