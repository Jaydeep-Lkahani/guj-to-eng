# CLAUDE.md

A static website that teaches English to a Gujarati-speaking beginner (the owner's wife).
Every explanation is in simple, spoken Gujarati. English appears only as the thing being taught.
Live at https://gujarati-to-english.vercel.app (Vercel deploys `main` on push).

## Start of every conversation

1. Read `pending.md`. It holds every requirement, decision (section 5), open item (section 6) and the conversation log (section 9). Don't undo or contradict a decision listed there without asking.
2. Building something from the fluency plan? Read `docs/roadmap.md` and follow the step's spec exactly. Each step lists the decisions to ask about first.
3. The owner writes in simple English and isn't a native speaker. Reply in plain, short sentences without jargon.

## End of every conversation

Update `pending.md`. Tick finished checklist items, add a row to section 5 for any new decision, and add a row to the section 9 log. The log row says what was asked, what you did, what you checked, and what is **not** done. Use real dates (today's date, not "yesterday").

## Rules that never change

- **Static site, no backend, no login.** Progress is saved in her browser only. The only planned exception is roadmap step 9, and only after the owner says yes.
- **Content lives in `content/` as JSON**, never inside components.
- **All interface text is Gujarati.** Buttons, headings, messages and empty states are all Gujarati. English shows only as lesson material.
- **Commit or push only when the owner asks.** Never commit `.env.local`.
- **Ask before building anything** listed under "Ideas" or "not agreed yet" in `pending.md`.
- **Phone first.** She mostly uses a phone. When fixing the phone layout, desktop must not change, and the reverse.

## Commands

```bash
npm run dev      # http://localhost:5173 (or preview_start with name "dev")
npm test         # vitest; includes checks of every content file
npm run build    # always this, not plain `vite build`: it also pre-renders every page
npm run check    # typecheck + tests + build. Must pass before you say a step is done
npm run audio    # records new "Listen" sentences; needs `pip install edge-tts` once (free, no key)
```

If the test count looks too low after adding a lesson, run `rm -rf node_modules/.vitest-cache`.

## Where things are

- `content/parts.json`: the parts and their topics, in order. The order in this file is the order she sees.
- `content/lessons/<topicId>.json`: one lesson per topic. The format is in `README.md` and the types are in `src/content.ts`.
- `src/content.ts`: content types (`Lesson`, `Question` …) and loaders.
- `src/components/Practice.tsx`: the quiz (question types `choice` and `order`).
- `src/progress.ts`: finished lessons, saved in localStorage. **Copy this pattern for any new saved data** (see below).
- `src/review.ts`: daily review (boxes, due dates, streak) saved under `guj-eng.review.v1`; the pure rules are tested in `src/review.test.ts`.
- `src/pages/`: the Home, Part, Topic, Review and NotFound pages. Routes are in `src/App.tsx`.
- `src/seo.ts`: page titles, descriptions and the list of pages to pre-render (`allPaths`, `indexablePaths`, `pageMeta`).
- `scripts/prerender.mjs` + `src/entry-server.tsx`: write one HTML file per page at build time.
- `src/speech.ts`, `src/spoken-texts.ts`, `scripts/make-audio.mjs`: Listen audio. The recordings are in `public/audio/`, listed in `src/audio-manifest.json`.
- CSS: design tokens (light and dark colours) are at the top of `src/styles.css`. Each area has its own file: `home.css`, `lesson.css`, `sidebar.css`. A new area gets a new file.

## Writing lesson content (Gujarati)

Match the existing lessons. Read one or two (for example `content/lessons/p1-t16.json`) before writing.

- **Simple, spoken, everyday Gujarati,** the way you'd explain to a family member. No grammar jargon. Say "કામ બતાવતો શબ્દ", not "ક્રિયાપદ", unless the lesson already taught the term.
- **English inside Gujarati text is marked `[[like this]]`** so it's styled and can be tapped to hear it.
- **Every example has `en`, `translit` and `gu`.** `translit` is the English said in Gujarati letters, as an Indian speaker says it: `"have"` → `"હૅવ"`, `"I have a car."` → `"આઇ હૅવ અ કાર"`. On screen it shows as "Water – વૉટર – પાણી".
- **Start from Gujarati.** Show how a Gujarati sentence is built, then the English. Point out the word-order difference (Gujarati puts the verb last, English puts it second).
- **Name the common mistakes a Gujarati speaker makes:** "[[I am have a car.]] ખોટું છે, [[I have a car.]] સાચું છે."
- **Every lesson has a short "ક્રમ" (word order) tip paragraph** and 1–3 practice questions about it.
- **Size:** 7–11 short paragraphs, about 20–35 examples, 10–12 practice questions. At least 2 of them are `order` questions.
- **`explainGu`** looks like this: `"I have a car. – આઇ હૅવ અ કાર. \"મારી પાસે\" = I, અને I સાથે have."` (the English, a dash, the transliteration, then a one-line reason).
- **`choice` questions:** `answer` counts from 0. Vary where the right answer sits.
- **`order` questions:** one word per tile, no spaces inside a tile, and no full stop or question mark on the tiles. Put it in `end`.
- **Use Gujarati family life:** names like Meena, Raj, Ravi, Neha. Kitchen, market, school, temple, relatives, festivals.
- **Refer to the sentence-pattern lesson as "ભાગ 1 નો છેલ્લો પાઠ"**, never by number (numbers change as lessons are added).
- **New topic IDs are never renumbered.** Add the next free ID (for example `p1-t20`) and place it in `parts.json` where it fits.
- **Write one lesson at a time,** then stop. Mark it in `pending.md` section 4 as "Written <date>. Waiting for my review".
- **After writing a lesson:** run `npm run check`, open it in the browser at phone width, and run `npm run audio` (if `edge-tts` is not installed, note in the log that recordings are missing).

## Writing code

- React 19 + TypeScript + Vite 8, react-router 8, plain CSS. Icons come from `@phosphor-icons/react` (`duotone` for decoration, `bold` inside buttons, `fill` for status). No new packages without asking.
- **Saved data:** use one localStorage key per feature, named `guj-eng.<feature>.v1`. Wrap every read and write in try/catch (storage can be blocked). Use `useSyncExternalStore` with an **empty server snapshot**, so the pre-rendered HTML matches the browser's first draw. See `src/progress.ts`.
- **Pre-rendering:** pages are rendered in Node at build time. Don't touch `window`, `localStorage` or `speechSynthesis` while a module loads or during the first render. Read them in effects or in the client snapshot.
- **A new page needs four things:** a route in `src/App.tsx`, a `pageMeta` case in `src/seo.ts`, the path in `allPaths()` (so the build writes its HTML file and Vercel doesn't show 404), and the path in `indexablePaths()` only if it should appear in Google (personal pages like review use `noindex: true`).
- **A new practice question type needs five things:** a type in the `Question` union in `src/content.ts`, `answerText()` support, a body component in `Practice.tsx`, validation in `src/content.test.ts` (the list of allowed types), and an update to `README.md`. If it has English to play aloud, add it to `src/spoken-texts.ts`.
- **Styling:** use the colour tokens, never raw colours. Every colour must work in light and dark. The phone layout is `@media (max-width: 899px)`. Tap targets are at least 44px and text is large. Animations go inside `@media (prefers-reduced-motion: no-preference)`.
- **Comments:** short, plain English, and they say why.
- **Tests:** Vitest + Testing Library. Put pure logic (scheduling, answer checking, text matching) in plain functions with unit tests. `src/App.test.tsx` reads answers from the lesson files, so content edits don't break it.

## Checking your work (before saying "done")

1. `npm run check` passes.
2. Open the page in the browser pane (`preview_start` with name `dev`). Check it at 375px and 320px wide, in light and dark mode, with no sideways scrolling and no console errors. Check desktop too if you touched shared styles.
3. Try the feature the way she would: tap through it on the phone size.
4. In your reply and the `pending.md` log, say what you checked and what you could not check (for example, "microphone not testable in the browser pane").
