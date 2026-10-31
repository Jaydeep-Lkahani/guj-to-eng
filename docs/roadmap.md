# Fluency roadmap: detailed specs

**Goal:** she can speak, read and write English fluently. The 35 lessons take her to about A2, simple everyday English. These steps aim for B1–B2.

**How to use this file:** do one step (or one sub-step) per conversation. Before starting, read `CLAUDE.md` and `pending.md`. Then ask the owner the questions under **Ask first**. Each one has a default you can suggest. Build the step and check it as described under **Done when**. Then tick it in `pending.md` (section 6, "Fluency roadmap") and add a log row.

Nothing here is agreed until the owner says so. The status of each step lives in `pending.md`, not here.

## Overview

| # | Step | Where it lives | Needs |
|---|---|---|---|
| 1 | Daily review | New page `/review`, plus a link in the sidebar and on the home page | — |
| 2 | Speaking practice | New question type `say`, used **inside every lesson** | — |
| 3 | Role-play conversations | **Inside lessons** (new `roleplay` field) | Step 2 |
| 4 | Everyday vocabulary + "My words" | **New lessons** (content) + new page `/words` | Step 1 for word cards |
| 5 | Writing practice | New question type `type` **inside lessons** + new page `/write` | — |
| 6 | Story library | New pages `/stories` and `/story/:id` | — |
| 7 | Missing grammar + Part 4 | **New lessons** (content) | — |
| 8 | Tests | New pages `/part/:id/test` and `/level` | — |
| 9 | AI speaking partner | New page `/talk` + a small server function | Owner's yes (breaks "no backend") |

Suggested order: 1 → 2 → 4 → 5 → 6 → 7 → 3 → 8. Step 9 whenever the owner decides.

The content-heavy steps (4, 6, 7, and adding `say`/`type` questions to lessons) go **one lesson or one batch at a time**, with the owner's review in between, as all lessons have so far.

---

## Step 1: Daily review ("આજનું પુનરાવર્તન")

**Why:** without review, most new words are forgotten within weeks. Ten minutes a day brings back old questions and mistakes just before she'd forget them.

**Ask first**
- How many questions in a day's set? *Default: up to 15.*
- Should a streak count show? *Default: yes, "🔥 N દિવસ", with no punishment for missing a day. The count just starts again.*

**What she sees**
- A link "આજનું પુનરાવર્તન" in the sidebar (under the progress card) and a card on the home page. Both show how many questions are waiting today. If nothing is due: "આજનું પુનરાવર્તન પૂરું! કાલે ફરી મળીએ."
- The page `/review` shows today's set using the existing quiz (`Practice`), one question at a time with the same feedback, Listen button and score ring at the end. Each question shows a small tag naming the lesson it came from.
- At the end: the score, the streak, and "કાલે N સવાલ" (how many are due tomorrow).
- If she has finished no lessons yet: a friendly empty state pointing to lesson 1.

**How it works (spaced review with boxes)**
- Every practice question she answers inside a lesson becomes a review item.
- An item has a box from 0 to 4. The gap until it comes back, by box: 0 → 1 day, 1 → 3 days, 2 → 7 days, 3 → 14 days, 4 → 30 days.
- In a lesson or a review: right answer → box + 1 (max 4) and the new due date. Wrong answer → box 0, due tomorrow.
- Today's set: items due today or earlier, those with the lowest box first, then the oldest due date. Cap the set at the daily size. Items left over stay due.
- **Stable item ID:** a short hash of `questionGu + "|" + answerText(q)`, not the lesson's question index. Editing or reordering a lesson then doesn't scramble her review. If an ID no longer matches any question in the content, drop it quietly.
- **First run** (she has finished lessons from before this feature): add every question from her finished lessons at box 1. Spread their due dates over the next 7 days so day one isn't a wall of 200 questions.
- Dates are local calendar days (`YYYY-MM-DD`), not timestamps.

**Saved data:** `guj-eng.review.v1`
```json
{ "items": { "<id>": { "box": 1, "due": "2026-11-03" } }, "days": ["2026-10-31", "2026-11-01"] }
```
`days` lists the days she finished a review set. The streak is the run of consecutive days ending today or yesterday. Keep only the last 60 days.

**Files**
- New `src/review.ts`: pure functions (`questionId`, `nextBox`, `dueDate`, `todaysSet`, `streak`, `seedFromCompleted`) that take today's date as an argument, plus a store in the `src/progress.ts` style.
- `src/components/Practice.tsx`: add an optional prop `onAnswer?(question: Question, correct: boolean)`, called once per answer. Use it in `TopicPage` and on the review page to update boxes.
- New `src/pages/ReviewPage.tsx` and `src/review.css`. Add the route, `pageMeta` (with `noindex: true`) and the path to `allPaths()` only (not `indexablePaths`).
- Sidebar and home page: add the link and card with the due count. On the first draw the count is 0 (empty server snapshot).

**Done when**
- Unit tests cover: box moves, due dates, set ordering and cap, streak across a missed day, seeding spread, and dropping unknown IDs.
- Finishing a lesson adds its questions. Answering wrong in review brings the question back tomorrow (test it by moving the date in a test, not by waiting).
- `npm run check` passes. The page works at 375px and 320px in light and dark mode, and the empty state shows when nothing is due.

---

## Step 2: Speaking practice ("બોલીને જુઓ")

**Why:** she has never said anything aloud on the site. This is her biggest gap for speaking.

**Ask first**
- Should spoken questions count toward the lesson score? *Default: yes. If her phone can't listen, the question becomes "say it, then tap done" and counts as right.*
- How many per lesson? *Default: 2–3, the last questions of each lesson.*

**New question type `say`**
```json
{
  "type": "say",
  "questionGu": "\"મારી પાસે ગાડી છે.\" અંગ્રેજીમાં બોલો.",
  "text": "I have a car.",
  "explainGu": "I have a car. – આઇ હૅવ અ કાર."
}
```
`text` is plain English (no Gujarati, no `[[ ]]`).

**What she sees**
1. The Gujarati prompt, then the English sentence with its transliteration, and a Listen button (she should hear it first).
2. A big round mic button "બોલો". While listening, the button pulses and shows "સાંભળું છું…".
3. Then each word of `text` is shown green if it was heard and grey if not, plus what the phone heard, in small text.
4. Pass (≥ 80% of the words heard, in order): ✅ "સરસ! બરાબર બોલ્યા." Otherwise: "ફરી બોલો" and the grey words. After 3 tries, a "આગળ વધો" button appears and the answer counts as wrong.

**How it works**
- Use the browser's `SpeechRecognition` (or `webkitSpeechRecognition`) with `lang = "en-IN"`, `interimResults = false` and `maxAlternatives = 3`. Score every alternative and keep the best.
- **Matching** is a pure function in a new `src/speak-check.ts`: lowercase, remove punctuation, and expand contractions on both sides (I'm → i am, don't → do not, it's → it is, …). Spell numbers so "4" = "four". Then find the longest common subsequence of words. Score = matched words ÷ target words.
- **No recognition support** (Firefox, some iPhones) **or mic permission denied:** show the sentence and Listen, the text "મોટેથી બોલો, પછી ✓ દબાવો", and a button "મેં બોલી લીધું". Tapping it counts as right. Never block the lesson.
- **Privacy:** Chrome sends the voice to Google to turn it into text. Show a one-time Gujarati note the first time she taps the mic, and remember it in `guj-eng.mic-note.v1`.
- Microphone access only works on https or localhost, which is already the case.

**Files**
- `src/content.ts`: `SayQuestion` type, add it to the `Question` union, and `answerText` returns `text`.
- `src/components/Practice.tsx`: a `SayBody` component. Keep recognition code in a small hook (`src/use-listen.ts`) so it can be mocked in tests.
- `src/content.test.ts`: allow `"say"`, and check `text` is non-empty English with an end mark.
- `src/spoken-texts.ts`: add `text` (it's already covered if it goes through `answerText`). Update `README.md`.
- `src/lesson.css`: mic button and word chips, with phone sizes.

**Content (separate step, one part at a time):** add 2–3 `say` questions to the end of each Part 1 lesson, picked from that lesson's examples. Short sentences first. Owner reviews, then Part 2, then Part 3.

**Done when**
- Unit tests for matching cover contractions, numbers, extra words, missing words, and the best of several alternatives.
- A component test with a mocked recognizer covers pass, fail, the 3-tries skip, and the no-support fallback.
- In the browser pane (no real mic), the fallback path works. Say in the log that the real mic must be tried on her phone in Chrome.

---

## Step 3: Role-play conversations ("વાતચીત કરીએ")

**Needs step 2.**

**Ask first**
- Separate new lessons (for example "દુકાનમાં વાતચીત") or added to existing lessons? *Default: an optional `roleplay` field on lessons, starting with the Conversations lesson `p2-t07`, then new short lessons for situations not covered.*

**Data (inside a lesson file)**
```json
"roleplay": {
  "titleGu": "શાક માર્કેટમાં",
  "her": "Meena",
  "lines": [
    { "speaker": "Seller", "en": "Good morning! What do you want?", "translit": "ગુડ મૉર્નિંગ! વૉટ ડુ યુ વૉન્ટ?", "gu": "સુપ્રભાત! શું જોઈએ છે?" },
    { "speaker": "Meena", "en": "One kilo of tomatoes, please.", "translit": "વન કિલો ઑફ ટમેટોઝ, પ્લીઝ.", "gu": "એક કિલો ટામેટાં આપો." }
  ]
}
```

**What she sees:** a chat-style screen. The other person's line appears and plays automatically. On her line she sees the Gujarati meaning and a "જુઓ" button that reveals the English. Then she speaks (step 2 matcher, same fallback). After the last line comes "ફરી કરો, આ વખતે English છુપાવીને". The second round hides the English hint until she taps it. It shows as its own section between the examples and the practice. The sticky step bar keeps its 3 steps: role-play counts under "ઉદાહરણ".

**Situations to cover:** vegetable market, grocery shop, doctor, child's school teacher, auto-rickshaw/taxi, phone call to a relative, neighbour, bank, train station, restaurant.

**Done when:** `content.test.ts` validates `roleplay` (both speakers, `her` matches a speaker, every line has en/translit/gu). Lines are in `spoken-texts.ts`. It works at phone width and in the fallback path.

---

## Step 4: Everyday vocabulary + "My words"

### 4a: Vocabulary lessons (content)

**Ask first**
- Where do they go? *Default: a new part "રોજના શબ્દો" (Everyday Words), `id: "p4"`, `number: 4`, with an intro saying it can be studied alongside Parts 1–2. The Part 4 grammar of step 7 then becomes `p5`.* Don't renumber existing parts.

**Lessons (one per conversation, owner reviews each):**
1. Kitchen and cooking (utensils, actions like cut, boil, fry)
2. Vegetables and fruits
3. Food, drinks and meals
4. Clothes and colours in use
5. House, rooms and furniture
6. Body, health and the doctor ("I have a fever")
7. Places in town and directions (turn left/right, go straight)
8. Transport and travel
9. Shopping and money (prices, "How much is this?")
10. Jobs and work
11. Common action verbs, part 1 (30 verbs)
12. Common action verbs, part 2 (30 verbs)
13. Feelings (happy, tired, worried …)
14. Opposites (big/small, hot/cold …)
15. Weather and seasons
16. School and children (for talking with teachers)

**Shape of a vocab lesson** (differs from grammar lessons): 4–6 short paragraphs, 40–60 word examples in groups, plus 8–10 sentence examples using them. 12 practice questions: 2 `order`, plus 2 `say` once step 2 exists. Don't repeat words already taught in `p1-t03` (First Words); check with a search.

### 4b: "My words" page `/words`

- Lists every example whose `en` is a word or short phrase (1–3 words, no sentence end mark) from lessons she has **finished**, grouped by lesson. Each one has a Listen button and its transliteration and meaning.
- Search box at the top (reuse the logic in `src/search.ts`).
- Tab "અઘરા શબ્દો" (hard words): words from review items in box 0 or 1 (needs step 1).
- Top line: "તમે N શબ્દો શીખ્યા". This is motivating, so make the number prominent.
- `noindex: true`, in `allPaths()` only.

### 4c: Word cards in the daily review (needs step 1)

- Add a review item kind `word`: it shows the Gujarati meaning, she says or thinks of the English, taps "જવાબ જુઓ", hears it, then taps "આવડ્યું" or "ન આવડ્યું". The box moves the same way as for questions.
- Words enter review when she finishes a lesson. At most 10 new words a day.

---

## Step 5: Writing practice

### 5a: Question type `type` (inside lessons)

```json
{
  "type": "type",
  "questionGu": "\"હું ચા પીઉં છું.\" અંગ્રેજીમાં લખો.",
  "answers": ["I drink tea."],
  "explainGu": "I drink tea. – આઇ ડ્રિન્ક ટી."
}
```
`answers` lists every accepted answer. The first one is shown as the right answer.

- A text box with a large font and `autoCapitalize="off" autoCorrect="off" spellCheck={false}`, so the phone doesn't fix her mistakes. Below it, a "જવાબ તપાસો" button.
- **Checking** is a pure function in `src/type-check.ts`. Compare after lowercasing, collapsing spaces, removing the end mark and expanding contractions (same list as step 2).
  - Match, and the capital letter and end mark are right: ✅ correct.
  - Match, but the first capital or end mark is missing: ✅ counts as right, with a gentle tip: "સાચું! વાક્ય મોટા અક્ષરથી શરૂ કરો અને અંતે . મૂકો."
  - No match: ❌. Show her words with the wrong or missing ones marked (a word diff against the closest accepted answer), then the right answer.
- Update `content.ts`, `Practice.tsx`, `content.test.ts` (non-empty `answers`, each with an end mark), `README.md`, and `answerText` (returns `answers[0]`).
- **Content (separate steps):** add 2 `type` questions per lesson, one part at a time, owner reviews.

### 5b: Daily writing page `/write`

- `content/writing.json`: about 60 prompts. Each has an `id`, an `afterTopic` (only shown once that lesson is finished), `promptGu` ("આજે તમે શું રાંધ્યું? 3 વાક્ય લખો."), `hintWords` (en/translit/gu) and a `sample` answer.
- The page shows one prompt a day (the first unseen one she has unlocked), a textarea, and the hint words. After "પૂરું" she sees the sample answer and a simple checklist done in the browser: each sentence starts with a capital letter, each ends with . or ?, and "I" is always capital. These are friendly ticks, not a grade.
- Her writing is saved as a diary in `guj-eng.diary.v1` (`[{ date, promptId, text }]`). There's a "મારી ડાયરી" list of past entries.
- Real correction of free writing needs step 9. Until then the page says so honestly: "નમૂના સાથે સરખાવો".
- `noindex: true`.

---

## Step 6: Story library

**Ask first**
- Should stories be visible to Google (good for search ranking)? *Default: yes, indexed.*

**Content:** `content/stories/<id>.json`
```json
{
  "id": "s1-market",
  "level": 1,
  "titleGu": "મીના બજારમાં",
  "titleEn": "Meena at the Market",
  "afterTopic": "p1-t16",
  "lines": [{ "en": "Meena goes to the market.", "translit": "મીના ગોઝ ટુ ધ માર્કેટ.", "gu": "મીના બજારમાં જાય છે." }],
  "words": [{ "en": "market", "translit": "માર્કેટ", "gu": "બજાર" }],
  "questions": []
}
```
`questions` uses the normal `Question` types, about 5 per story.

**Levels** (each one only uses grammar taught by then):
- Level 1: after Part 1. 5–8 lines, present tense with am/is/are and have.
- Level 2: after Part 2 lesson 3. 8–12 lines, past simple.
- Level 3: after Part 2. 12–16 lines, all of Part 2.
- Level 4: after Part 3. 15–20 lines.
- Level 5: B1. 20–30 lines.

Aim for 4–6 stories per level, about Gujarati family life: market, Diwali, school meeting, doctor, train trip, wedding, cooking for guests, a phone call from abroad.

**What she sees**
- `/stories`: cards grouped by level, with a lock hint (not a lock) if `afterTopic` isn't finished: "પહેલાં પાઠ X કરો તો સહેલું પડશે". Finished stories are ticked.
- `/story/:id`: the English lines, large. Tap a line to hear it and show its Gujarati meaning under it. Tap a single word to see its meaning (from `words`, or else from all lesson examples). A "બધું સાંભળો" button plays every line in turn. The transliteration is shown at levels 1–2 and hidden behind a toggle from level 3. The questions come at the end, and finishing them marks the story done (`guj-eng.stories.v1`).

**Files:** `src/stories.ts` (loader like `content.ts`), pages, `src/stories.css`, routes and `seo.ts` (indexed, with titles containing "Gujarati to English"), `content.test.ts` checks, and story lines in `spoken-texts.ts`.

---

## Step 7: Missing grammar and Part 4

Content only. Use the existing lesson format and all the writing rules in `CLAUDE.md`. One lesson per conversation, with the owner's review in between.

**Missing from Parts 1–2** (new IDs, placed in `parts.json` where they fit):
- `p1-t20` some / any (after `p1-t15` There is/are)
- `p1-t21` much / many / a lot of (after `p1-t20`)
- `p1-t22` Dates: the 5th of May, ordinal numbers, in/on/at for time (after `p1-t18` Telling the Time)
- `p2-t09` Past Continuous: was/were + -ing (after `p2-t03` Past Simple)
- `p2-t10` used to (after `p2-t09`)

**Part 4, "આત્મવિશ્વાસ" (Confidence, B1).** The ID is `p5` if step 4a created `p4`. Ask the owner for the final title.
1. Present Perfect Continuous (I have been waiting)
2. Passive voice (The food is cooked)
3. Reported speech (She said that…)
4. Phrasal verbs, part 1 (get up, switch off, look for …)
5. Phrasal verbs, part 2
6. who / which / that (joining describing words)
7. like doing / want to do
8. Second conditional, more (If I had…, I would…)
9. Question tags (…, isn't it?)
10. Polite and formal English (emails, phone calls, offices)

---

## Step 8: Tests

### 8a: End-of-part test `/part/:id/test`
- 20 questions drawn from that part's lessons, mixed types. They're picked with a seeded shuffle, so a new attempt gets a new mix.
- The result shows the score, pass at 70% ("ભાગ 1 પાસ!"), and **which lessons to revisit**: group the wrong questions by lesson and link to each.
- Best score saved in `guj-eng.tests.v1` (`{ "p1": { "best": 17, "of": 20, "date": "…" } }`). Shown on the part page and in the sidebar part heading.
- The part page shows the test card after its last lesson. It's always open, never locked.

### 8b: Level check `/level`
- 30 questions: 10 from Part 1 (A1), 10 from Part 2 (A2), 10 from Part 3 (B1). They're ordered easy to hard, and she can stop any time.
- Result: the highest band where she scored 7/10 or more. A Gujarati explanation of what that level means and which part to study next.
- Can be indexed (people search for "English level test in Gujarati").

---

## Step 9: AI speaking partner (needs the owner's decision)

**This changes the "no backend" rule.** Record the decision in `pending.md` section 5 before building.

**Ask first**
- Yes or no? Which provider? *Default: a Claude model through the Anthropic API. Check current models and prices when building. Use the cheapest model that talks naturally at a simple level.*
- A monthly spending limit. *Set it in the provider's console.*

**What she sees** at `/talk`: pick a situation (same list as step 3) or "ફ્રી વાતચીત". It's a chat where she speaks (step 2 recognition) or types. The partner replies in short, simple English (A2 level, one or two sentences), which is played aloud. After each of her messages, if there was a mistake, a small Gujarati box shows: "આમ કહેવાય: …" and a one-line reason. There's also a "લખાણ સુધારો" mode for her step 5b diary entries.

**How it works**
- A Vercel serverless function `api/talk.ts` holds the API key in a Vercel environment variable. The key is **never** in the browser or the repo.
- **Abuse protection** (the site is public): she enters a short access code once (env var `TALK_CODE`), stored in `guj-eng.talk.v1`. The function rejects requests without it. Cap message length, and cap messages per day in the function.
- The system prompt states her level, the lessons she has finished (sent from the browser), the reply length, the correction format in Gujarati, and that it must stay kind and encouraging.
- Voice for replies: the device voice (`speechSynthesis`), since replies aren't pre-recorded.
- Local development: `vercel dev`, or a Vite proxy. Document it in `CLAUDE.md` once built.
- The page is `noindex` and isn't linked for visitors without the code (show the code box instead).

**Done when:** the function is tested with a mocked API, there's no key in the client bundle (search `dist/` for it), wrong or missing codes are rejected, and the owner has tried it on her phone.
