# pending.md — Project tracker

The single record of this project: what was asked, what was decided, what is done, and what is still pending.

**Rule:** update this file at the end of every conversation in this folder. Add a line to the conversation log (section 9) and update the checklists.

Last updated: 2026-10-31

---

## 1. What this project is

A simple website that helps my wife learn English.

- She speaks Gujarati natively and is a beginner.
- Every explanation is in simple, spoken Gujarati. English appears only as the thing being taught.
- It's a static site: no backend and no login. Progress is saved in her browser.

## 2. Requirements (from the original request)

### Learning structure
- [x] Three parts (phases), each split into ordered topics
- [x] Each topic page has a Gujarati explanation, English examples with Gujarati meanings, and a practice quiz at the end (the page layout is built and works)
- [x] Real lesson content for every topic (see section 4)

### Language rules
- [x] All UI text, headings and explanations are in simple, everyday Gujarati
- [x] New English words have a Gujarati transliteration, shown like "Water – વૉટર – પાણી"
- [x] Noto Sans Gujarati font, bundled with the site so it works offline

### Layout
- [x] Header: site title and a link to home
- [x] Sidebar: Home, then the three parts, each opening to its topics
- [x] Main content area shows the selected page
- [x] Home page: short Gujarati welcome and the three parts as cards
- [x] Each part page lists its topics
- [x] On mobile, the sidebar is hidden behind a menu button

### Technical
- [x] Static site, no backend, no login
- [x] Content lives in separate files (`content/`), not in components
- [x] Completed topics are saved in the browser
- [x] Large readable text, high contrast, big tap targets

### "Done" means
- [x] I can open the site, go Home → Part → Topic, read a complete Gujarati-taught lesson, and finish its practice questions. *(Checked by me 2026-10-26.)*

## 3. Process (agreed order of work)

1. [x] Propose the part and topic list in Gujarati and English, and wait for approval. *(Approved 2026-10-26)*
2. [x] Build the layout and navigation with placeholder content. *(Done 2026-10-26)*
3. [x] Write the content for Part 1 only, then I review it.
4. [x] After my review: write Part 2, then Part 3 (each reviewed before moving on).

## 4. Approved topic list

Tick a topic when its real lesson is written **and** I've reviewed it.

### ભાગ 1 — શરૂઆત (Basic)
| ✓ | ID | ગુજરાતી | English | Lesson status |
|---|---|---|---|---|
| [x] | p1-t01 | ABCD — અંગ્રેજી અક્ષરો | The Alphabet | Written and reviewed 2026-10-26 |
| [x] | p1-t02 | અક્ષરોના અવાજ | Letter Sounds | Written and reviewed 2026-10-26 |
| [x] | p1-t03 | આપણા પહેલા શબ્દો | First Words | Written and reviewed 2026-10-26 |
| [x] | p1-t04 | આંકડા 1 થી 100 | Numbers 1–100 | Written and reviewed 2026-10-26 |
| [x] | p1-t05 | નમસ્તે અને ઓળખાણ | Greetings & Introducing Yourself | Written and reviewed 2026-10-26 |
| [x] | p1-t06 | કુટુંબ અને લોકો | Family & People | Written and reviewed 2026-10-26 |
| [x] | p1-t07 | હું, તમે, તે | Pronouns | Written and reviewed 2026-10-26 |
| [ ] | p1-t17 | મને, તેને અને રવિનું (me / him / Ravi's) | me, him, her & Ravi's | Written 2026-10-28 (shows as lesson 8). Waiting for my review |
| [x] | p1-t08 | am / is / are વાળાં સાદાં વાક્યો | Simple Sentences with am/is/are | Written and reviewed 2026-10-26 |
| [ ] | p1-t12 | a / an / the ક્યારે વાપરવા | a, an and the | Written 2026-10-28 (shows as lesson 9). Waiting for my review |
| [ ] | p1-t13 | this / these — એક અને ઘણી વસ્તુઓ | this, that, these, those & Plurals | Written 2026-10-28 (shows as lesson 10). Waiting for my review |
| [ ] | p1-t14 | in / on / under — વસ્તુ ક્યાં છે? | Place Words: in, on, under, near | Written 2026-10-28 (shows as lesson 11). Waiting for my review |
| [ ] | p1-t15 | There is / There are — ક્યાં શું છે? | There is / There are | Written 2026-10-28 (shows as lesson 12). Waiting for my review |
| [ ] | p1-t16 | have / has — મારી પાસે છે | have / has (Owning Things) | Written 2026-10-28 (shows as lesson 13). Waiting for my review |
| [x] | p1-t09 | રંગ, વાર અને મહિના | Colours, Days & Months | Written and reviewed 2026-10-26 |
| [ ] | p1-t18 | કેટલા વાગ્યા? — સમય કહેતાં શીખો | Telling the Time | Written 2026-10-28 (shows as lesson 16). Waiting for my review |
| [x] | p1-t10 | રોજબરોજનાં વાક્યો | Daily-Life Phrases | Written and reviewed 2026-10-26 |
| [ ] | p1-t19 | નમ્રતાથી માગો — Can I / Could you | Polite Requests: Can I / Could you | Written 2026-10-28 (shows as lesson 18). Waiting for my review |
| [x] | p1-t11 | ગુજરાતી વાક્યને અંગ્રેજીમાં ફેરવો | Sentence Patterns: Gujarati to English | Written 2026-10-26 (added on request). Part 1 lessons 5–10 got matching word-order tips. Done |

### ભાગ 2 — આગળ વધીએ (Intermediate)
| ✓ | ID | ગુજરાતી | English | Lesson status |
|---|---|---|---|---|
| [x] | p2-t01 | રોજ શું કરો છો? | Present Simple | Written and reviewed 2026-10-26 |
| [x] | p2-t02 | અત્યારે શું ચાલે છે? | Present Continuous | Written and reviewed 2026-10-26 |
| [x] | p2-t03 | ગઈકાલે શું કર્યું? | Past Simple | Written and reviewed 2026-10-26 |
| [x] | p2-t04 | કાલે શું કરશો? | Future (will / going to) | Written and reviewed 2026-10-26 |
| [x] | p2-t05 | "ના" વાળાં વાક્યો | Negative Sentences | Written and reviewed 2026-10-26 |
| [x] | p2-t06 | સવાલ પૂછતાં શીખો | Questions | Written and reviewed 2026-10-26 |
| [x] | p2-t07 | વાતચીત | Conversations | Written and reviewed 2026-10-26 |
| [x] | p2-t08 | નાના પાઠ વાંચીએ | Reading Short Passages | Written and reviewed 2026-10-26 |

### ભાગ 3 — પાકું કરીએ (Advanced)
| ✓ | ID | ગુજરાતી | English | Lesson status |
|---|---|---|---|---|
| [x] | p3-t01 | કામ પૂરું થયું | Present Perfect | Written and reviewed 2026-10-26 |
| [x] | p3-t02 | can, should, must | Modal Verbs | Written and reviewed 2026-10-26 |
| [x] | p3-t03 | જો… તો… | If Sentences | Written and reviewed 2026-10-26 |
| [x] | p3-t04 | સરખામણી | Comparisons | Written and reviewed 2026-10-26 |
| [x] | p3-t05 | વાક્યો જોડીએ | Joining Sentences | Written and reviewed 2026-10-26 |
| [x] | p3-t06 | લખતાં શીખો | Writing | Written and reviewed 2026-10-26 |
| [x] | p3-t07 | રૂઢિપ્રયોગો | Idioms & Common Expressions | Written and reviewed 2026-10-26 |
| [x] | p3-t08 | સાંભળો અને છૂટથી બોલો | Fluent Listening & Speaking | Written and reviewed 2026-10-26 |

## 5. Decisions made

| Date | Decision | Why |
|---|---|---|
| 2026-10-26 | Start fresh instead of continuing the previous project | The new request is simpler and plain (see section 8) |
| 2026-10-26 | Call phases **ભાગ** ("part") on the site, not તબક્કો | Simpler everyday word |
| 2026-10-26 | Stack: Vite + React + TypeScript, plain CSS | Builds to a static site that can be hosted anywhere |
| 2026-10-26 | Hash URLs (`#/topic/p1-t01`) | Works on any static host with no server setup. *Replaced 2026-10-28, see below* |
| 2026-10-26 | Content as JSON: `content/parts.json` plus one file per lesson in `content/lessons/` | New topics can be added without touching code |
| 2026-10-26 | English words inside Gujarati text are marked `[[Water]]` | So they are styled and tagged as English |
| 2026-10-26 | Practice is multiple choice, one question at a time, with instant right/wrong feedback | Simple on a phone |
| 2026-10-26 | Finishing a topic's practice marks it complete, whatever the score; "ફરીથી કરો" lets her retry | Encouraging for a beginner |
| 2026-10-26 | Topics are not locked; she can open any topic, but "next topic" buttons guide the order | Keeps it simple |
| 2026-10-26 | Topics without a lesson file show "જલ્દી આવશે" (coming soon) | Whole topic list is visible from day one |
| 2026-10-26 | Progress is saved in localStorage under `guj-eng.completed.v1` | No backend |
| 2026-10-26 | Replaced the old project's `.gitignore` with a fresh short one; removed `.prettierignore` | Leftovers from the previous project |
| 2026-10-26 | New look: indigo + green + saffron colours, rounded cards, Phosphor duotone icons, Baloo Bhai 2 headings, Plus Jakarta Sans for English | I said the site looked too plain to want to open |
| 2026-10-26 | Light and dark mode. Follows the phone setting until she taps the sun/moon button; her choice is saved under `guj-eng.theme.v1` | Requested |
| 2026-10-26 | Search in the header finds topics and the example words inside lessons (English or Gujarati). `/` or Ctrl+K jumps to it | Requested |
| 2026-10-26 | Custom logo: two speech bubbles, Gujarati "અ" and English "A". In header, footer and favicon | Requested |
| 2026-10-28 | Listen uses the browser's built-in voice (Indian English voice first, then British, then any English), a little slower than normal. No audio files | Free, works offline, nothing to record |
| 2026-10-28 | The whole example card is the Listen button, with a small speaker icon after the pronunciation | Cards are narrow on a phone (2 columns); a separate button squeezed the English onto extra lines |
| 2026-10-28 | New practice type "order": tap shuffled word tiles, tap a placed word to send it back, then "જવાબ તપાસો". Full stop/question mark kept off the tiles | Lets her build English sentences, not only recognise them |
| 2026-10-28 | New grammar lessons go inside Part 1 where they fit, with new IDs (p1-t12, p1-t13, …), so no file is renamed | Chosen by me from three options |
| 2026-10-28 | Lessons refer to the sentence-pattern lesson as "ભાગ 1 નો છેલ્લો પાઠ", not by number | Its number changes as lessons are added |
| 2026-10-26 | Small animations (hover lift, arrow nudge, right/wrong answer pop and shake, progress fill). All turned off when the device asks for reduced motion | Requested "micro interactions" |
| 2026-10-28 | Site lives at https://gujarati-to-english.vercel.app (Vercel, root) | Told by me |
| 2026-10-28 | Clean URLs (`/topic/p1-t01`) instead of hash URLs; old `#/` links redirect | Google treats hash URLs as one page, so lessons could never rank |
| 2026-10-28 | The build pre-renders every page to its own HTML file with the full lesson text, title, description and structured data | Search engines read each lesson without running JavaScript |
| 2026-10-28 | Main search phrase "Gujarati to English": in every title, the header tagline, the home heading and a Gujarati FAQ on the home page | Requested: rank for "gujarati to english" |
| 2026-10-28 | Home page redesign: light hero (no big purple box) with a soft moving colour glow, a live sample word card on the right, numbered "how it works" steps, part cards with a glow that follows the mouse, a two-column FAQ, and a closing "start" band. Home styles live in `src/home.css`. Moving parts (word card, glow, slide-in on scroll) stop when the device asks for reduced motion | Requested: more professional look with animations and micro-interactions |
| 2026-10-28 | Lesson and part page redesign (styles in `src/lesson.css`). Lesson page: coloured top with lesson facts (points, examples, questions, minutes) and a strip showing where the lesson sits in its part; a bar that sticks under the header with the 3 steps (સમજીએ, ઉદાહરણ, પ્રેક્ટિસ), each filling as it is done, a reading line and a "next" button that lights up when the lesson is finished; explanation as numbered points that tick off once read; English words in the explanation can be tapped to hear them; example toolbar with "બધા સાંભળો" (plays every card in turn), "અર્થ છુપાવો" (self-test: meanings hidden until tapped) and a heard counter; quiz streak chip, score ring with a small burst for 70%+, "ખોટા N સવાલ ફરી કરો"; big next-lesson card at the end with part progress. Part page: progress card with ring and a continue button, lessons as a path with a "અહીંથી આગળ" marker (indigo, so it never looks like green "done"), facts on every lesson, and the other parts with their progress. Read/heard counts last only for the visit | Requested: inner pages more professional and interactive, with small interactions that make her want to read everything and open the next lesson |
| 2026-10-29 | Lesson page on phones (below 900px, where the sidebar hides) has its own layout; desktop is untouched. Sticky bar is one slim row: segmented tabs with icon and label side by side, the active tab raised, a short progress line under each, and a matching square "next" button. Lesson facts are one 4-column strip. The three sections are not boxed (full width, a thin line between them). Examples are one per row: English on top, pronunciation and meaning beside each other underneath | Requested: the sticky bar and the three parts looked clunky on mobile; desktop must stay as it is |
| 2026-10-30 | Sidebar redesign (styles in a new `src/sidebar.css`; old sidebar styles removed from `src/styles.css`). Top: a progress card with a small ring (% of all lessons done) and a "આગળ ભણો" button to the next unfinished lesson ("બધા પાઠ પૂરા! શાબાશ!" when all are done). Each part heading shows its colour tile, "ભાગ 1 · Basic", the title and a thin progress bar with 3/19; it sticks to the top while its lessons scroll. Lessons are a timeline: numbered dots that turn into green ticks with a green line as she finishes them, the English title under the Gujarati one, the open lesson highlighted with a softly pulsing dot, and a "હવે" tag on her next lesson. Parts open and close smoothly, and the sidebar scrolls itself to the open lesson | Requested: sidebar more interactive, professional and good looking |
| 2026-10-31 | "Listen" recordings use the free `edge-tts` tool with the voice en-IN-NeerjaNeural, 10% slower, instead of paid OpenAI. Files are MP3 in `public/audio/` | Chosen by me after hearing samples; free, no key. Not an official Microsoft product, so it could stop working, but the recordings are kept in the site so nothing breaks |
| 2026-10-31 | Daily review (roadmap step 1): 15 questions a day, streak "🔥 N દિવસ સળંગ" with no punishment for a missed day. Page `/review` (not in Google). A question answered right moves up a box only when it is due, so redoing a lesson the same day doesn't rush it to the top. A page opened shows a "શરૂ કરો" button first, so today's set is picked once and doesn't change while she answers. Once she finishes a set, the review says "પૂરું" until tomorrow and leftover questions wait. Lessons she finished before are added at box 1, spread over 7 days starting today | Defaults I agreed to; details are Claude's choices |

## 6. Pending / next steps

1. [x] **Write the real lessons for Part 1** (10 topics): explanation, examples with transliteration, and practice questions. *(All 10 written 2026-10-26, waiting for review.)*
2. [x] I review the Part 1 lessons and send changes. *(Reviewed 2026-10-26: all fine, no changes. I will send any later changes.)*
3. [x] Write Part 2 lessons, then review. *(All 8 written and reviewed 2026-10-26.)*
4. [x] Write Part 3 lessons, then review. *(All 8 written and reviewed 2026-10-26.)*
5. [x] Commit the new project to git and push to GitHub: https://github.com/Jaydeep-Lkahani/guj-to-eng *(Done 2026-10-26)*
6. [x] Decide where to host the site. *(Live on Vercel: https://gujarati-to-english.vercel.app, told 2026-10-28.)*
8. [ ] **SEO steps only I can do** (code side done 2026-10-28):
   - [x] Push to GitHub so Vercel deploys the new build *(pushed 2026-10-28)*
   - [ ] Google Search Console: add the site, paste the verification code into `GOOGLE_SITE_VERIFICATION` in `src/seo.ts` (or use the HTML-file method), then submit `/sitemap.xml`
   - [ ] Bing Webmaster Tools: same (`BING_SITE_VERIFICATION`), it also feeds DuckDuckGo
   - [ ] Consider an own domain (e.g. gujaratitoenglish.in). Change `SITE_URL` in `src/seo.ts` and `public/robots.txt` if so
   - [ ] Get links from other sites (Gujarati groups, YouTube descriptions, forums); Google ranks a new site mainly by links
9. [ ] **Natural-voice audio for "Listen"** (free voice, all 1060 recordings made 2026-10-31):
   - [x] ~~OpenAI key~~ not needed any more: switched to the free `edge-tts` tool with the voice Neerja (chosen by me 2026-10-31)
   - [x] `npm run audio` made all 1060 recordings (17 MB) in `public/audio/` and `src/audio-manifest.json`
   - [x] Committed and pushed `public/audio/` and `src/audio-manifest.json` *(2026-10-31, Vercel deploys it)*
   - [ ] Listen to a few lessons on her Android phone after Vercel deploys, and tell Claude if any sentence sounds wrong
   - After adding or changing a lesson, run `npm run audio` again (it only makes the new sentences). Needs `pip install edge-tts` once on this Mac
7. [x] **Integrate the sentence-pattern work** (how to form English sentences from Gujarati). *(Done 2026-10-26: lesson p1-t11, plus a word-order tip and practice questions in p1-t05 to p1-t10. Extended into Part 2 and Part 3 on 2026-10-26, see the log.)*

### Ideas for later (not agreed yet, ask before building)
- "Listen" button on English words using the browser's built-in speech
- More practice types (type the answer, match pairs)
- A way to reset progress from the site

### Study gaps found on 2026-10-28 (not agreed yet, ask before building)
Grammar never taught (all common daily-use, and hard for Gujarati speakers).
Agreed 2026-10-28: each one becomes a new Part 1 lesson, placed where it fits, written one at a time. Planned Part 1 order:
Alphabet, Letter Sounds, First Words, Numbers, Greetings, Family, Pronouns, **me/him/her + 's**, am/is/are, **a/an/the**, **this/that/these + plurals**, **in/on/under**, **There is/are**, **have/has**, Colours/Days/Months, **Telling the time**, Daily-Life Phrases, **Can I / Could you**, Sentence Patterns (last).

- [x] "the" (only a/an is taught; Gujarati has no articles). *Lesson p1-t12 written 2026-10-28*
- [x] this/that/these/those, and plurals (book → books, child → children). *Lesson p1-t13 written 2026-10-28*
- [x] Place words: in/on/under/near/behind/next to ("It's on the table"). *Lesson p1-t14 written 2026-10-28*
- [x] have/has for owning ("I have two children"); only used as the Present Perfect helper now. *Lesson p1-t16 written 2026-10-28*
- [x] There is / There are (not used anywhere). *Lesson p1-t15 written 2026-10-28*
- [x] me/him/her/us/them and Ravi's (possessive 's). *Lesson p1-t17 written 2026-10-28*
- [ ] some/any, much/many, a lot of
- [x] Telling the time ("It's half past four"); "What time is it?" is asked but never answered. *Lesson p1-t18 written 2026-10-28. Dates (the 5th of May) not covered yet*
- [x] Polite requests: Can I…? / Could you…? / Would you like…? *Lesson p1-t19 written 2026-10-28. All 8 planned Part 1 lessons are now in; Part 1 has 19 lessons*
- [ ] Later: Past Continuous (was/were + -ing), used to

Everyday word themes missing (First Words has only 30 nouns):
- [ ] Kitchen and cooking, vegetables and fruits, clothes, rooms of the house
- [ ] Health and doctor ("I have a fever"), places in town and directions (turn left/right), transport, jobs
- [ ] ~30 common action verbs, feelings, and opposites (big/small, hot/cold)

Ways of learning missing on the site:
- [x] Sound: no audio anywhere, she only has the Gujarati spelling of the pronunciation. *Done 2026-10-28: tap any example card to hear it; a "સાંભળો" button after each quiz answer*
- [x] Only one practice type (all 310 questions are tap-the-answer). She never builds or types English. Best fit: "put the words in order" for the word-order tips. *Done 2026-10-28: "order" question type, 43 questions in 21 lessons. Typing the answer is still open*
- [ ] No review: wrong answers aren't saved, no "revise old words", no end-of-part test
- [ ] No speaking step ("say it aloud") at the end of a lesson
- [ ] ❌ wrong / ✅ right boxes and small tables instead of 9–11 plain paragraphs
- [ ] Lessons are long for one sitting (up to 39 examples and 12 questions)
- [ ] A word list page ("all words I've learnt" / "my hard words")
- [ ] Transliteration is always shown; could be tap-to-show in Parts 2–3
- [ ] Works offline once opened (installable on the phone), together with hosting (item 6)

### Fluency roadmap (proposed 2026-10-31, not agreed yet, ask before building)
Goal: she can speak, read and write English fluently. The course now reaches about A2; these steps aim for B1–B2.
**Full spec for each step (what to build, files, data, rules, questions to ask me first, checks): `docs/roadmap.md`.** Tick steps here as they are done.
Inside the lessons: 2 (`say` questions), 3 (role-play), 4a (new vocabulary lessons), 5a (`type` questions), 7 (new grammar lessons). New pages outside the lessons: 1 (`/review`), 4b (`/words`), 5b (`/write`), 6 (`/stories`), 8 (`/part/:id/test`, `/level`), 9 (`/talk`).
1. [x] Daily review *(built 2026-10-31, not committed yet)*: 10 minutes a day of old words and questions she got wrong, coming back at growing gaps (1, 3, 7, 14 days). Daily goal and streak.
2. [ ] Speaking practice with the microphone (browser speech recognition, best on Chrome/Android): she says the sentence, the site shows which words it understood. Listen-and-repeat with the natural-voice recordings (item 9).
3. [ ] Role-play conversations: she plays one side (shop, doctor, school, phone call, neighbour) and says her lines aloud.
4. [ ] Everyday vocabulary lessons (kitchen, food, clothes, house, health, town and directions, transport, jobs, verbs, feelings, opposites) and a "my words" page. Target 2,000+ words.
5. [ ] Writing: type-the-answer questions, "turn this Gujarati sentence into English", and a daily "write 3 sentences about your day" prompt.
6. [ ] Story library: short graded stories with audio and tap-a-word-for-meaning, from very easy to longer.
7. [ ] Missing grammar (some/any, much/many, past continuous, used to, dates) and a Part 4 (B1: passive, reported speech, phrasal verbs, present perfect continuous).
8. [ ] Tests: end-of-part test and a level check (A1/A2/B1) so she sees progress.
9. [ ] AI speaking partner: talks with her in English by voice or text, gently corrects mistakes and explains them in Gujarati; also corrects her writing. Needs a small server part (Vercel function) and an API key with a small monthly cost, so it changes the "no backend" rule. My decision.

## 7. How to run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

- `npm test`: runs the tests, including a check of every content file
- `npm run build`: makes the static site in `dist/`, with one pre-rendered HTML file per page, `sitemap.xml` and `404.html` (`scripts/prerender.mjs`). Always use this, not plain `vite build`
- `npm run check`: type check, then tests, then build
- `npm run audio`: makes the "Listen" recordings for any sentence that has none yet (needs `pip install edge-tts` once; no key). `-- --check` only lists what's missing; `-- --try "text"` makes voice samples in `audio-samples/`

How to add a topic is explained in `README.md`.
Project rules for every Claude session (any model) are in `CLAUDE.md`; it is read automatically.

### Files
- `CLAUDE.md`: house rules for Claude sessions (content writing, code patterns, checks)
- `docs/roadmap.md`: detailed specs for the fluency roadmap steps
- `content/parts.json`: parts and topics, in order
- `content/lessons/<id>.json`: one lesson per topic
- `src/components/`: layout, sidebar, practice quiz and shared bits
- `src/pages/`: Home, Part, Topic, Review and not-found pages
- `src/content.ts`: loads the content files
- `src/progress.ts`: saves completed topics in the browser
- `src/review.ts`: daily review (boxes, due dates, streak), saved in the browser; `src/pages/ReviewPage.tsx` and `src/review.css` are its page
- `src/styles.css`: all styling, with light and dark colours at the top
- `src/theme.ts`: light/dark switch (index.html also sets it before the page draws)
- `src/search.ts`: search over topics and lesson examples
- `src/components/Logo.tsx`: the logo (a copy is in `public/favicon.svg`)
- `src/seo.ts`: site address, page titles, descriptions, structured data and the home-page FAQ
- `src/entry-server.tsx` + `scripts/prerender.mjs`: build-time page rendering
- `vercel.json`: clean URLs and caching on Vercel
- `src/speech.ts`: plays a sentence's recording from `public/audio/`, or the device voice if there is none
- `src/spoken-texts.ts` + `scripts/make-audio.mjs`: list of every sentence that can be played, and the script that records them; `src/audio-manifest.json` says which file holds which sentence

## 8. Previous project (for reference)

An earlier, much bigger version of this site was built in this folder before 2026-10-26.

- Git commits `ab33ce2` to `debaa24` (latest: "M3 audit: tick M3.1-M3.11…").
- It used React + Tailwind and had a 9-step lesson player, audio, a video player, 8 exercise types and a 1,132-line spec in the old `pending.md`.
- Its files are deleted in the working copy, but the deletion isn't committed, so it's all still in git history. To see an old file, for example:
  `git show debaa24:pending.md`
- Some old ideas could be reused later: the list of common mistakes Gujarati speakers make (old `pending.md` section 1), audio, and video lessons.

## 9. Conversation log


| Date | What happened |
|---|---|
| 2026-10-26 | Gave the full request: 3 parts, Gujarati-taught lessons, plain layout, static site, progress in the browser. |
| 2026-10-26 | Claude proposed the topic list (3 parts, 26 topics). **Approved.** |
| 2026-10-26 | Claude built the layout and navigation with placeholder content: header, sidebar, phone menu, Home/Part/Topic pages, practice quiz, saved progress, tests. Checked in the browser on desktop and phone. |
| 2026-10-26 | Asked to clean up the old project's leftovers and start this tracker. Replaced `.gitignore` with a fresh one, removed `.prettierignore`, created `pending.md`. |
| 2026-10-26 | Asked to start p1-t01. Claude wrote the full Alphabet lesson: 5 short paragraphs, all 26 letters with name and a sample word, 10 practice questions. Made `src/App.test.tsx` read answers from the lesson so it doesn't break when lessons change. Tests and build pass; checked on a phone-size screen. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t02. Claude wrote the Letter Sounds lesson: 6 short paragraphs (name vs sound, short vowel sounds, C and G with two sounds, V vs W), 31 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t03. Claude wrote the First Words lesson: 4 short paragraphs, 30 everyday words in 4 groups (home, food, body, nature), 10 practice questions. Tests and build pass. Not yet looked at in the browser. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t04. Claude wrote the Numbers lesson: 8 short paragraphs (1–10, -teen vs -ty, Thirteen vs Thirty, tens-then-ones order which is the opposite of Gujarati, 100), 33 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Note: if the test count looks too low after adding a lesson, run `rm -rf node_modules/.vitest-cache`. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t05. Claude wrote the Greetings & Introducing Yourself lesson: 8 short paragraphs (greetings by time of day, Good night only at bedtime, How are you / I am fine, name and Nice to meet you, Please/Thank you/Sorry), 24 examples including a short Meena–Raj conversation, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t06. Claude wrote the Family & People lesson: 7 short paragraphs (main family words, Gujarati has many words for Uncle/Aunt/Grandparents but English has one each, "This is my…", Men/Women/Children), 33 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t07. Claude wrote the Pronouns lesson: 8 short paragraphs (I/You/He/She/It/We/They, Gujarati "તે" becomes He/She/It, one "You" for everyone, I always capital, My/Your/His/Her/Its/Our/Their), 26 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t08. Claude wrote the am/is/are lesson: 7 short paragraphs (am/is/are vs છું/છે/છો/છીએ, which pronoun takes which, never leave the verb out, one vs many, a/an), 23 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t09. Claude wrote the Colours, Days & Months lesson: 7 short paragraphs (colours don't change like Gujarati ones, 7 days, 12 months, capital first letter, "on" with days and "in" with months, Today/Tomorrow), 37 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Waiting for my review. |
| 2026-10-26 | Asked to start p1-t10. Claude wrote the Daily-Life Phrases lesson: 8 short paragraphs (4 groups of phrases, commands with please, "Give me water" word order, shop questions, what to say when you don't understand, wishes), 26 examples, 10 practice questions. This finishes writing all of Part 1. Tests and build pass. Opened all 10 Part 1 lessons at phone width: all show, no sideways scrolling. Waiting for my review of p1-t01 to p1-t10. |
| 2026-10-26 | Said the site looked bad. Claude redesigned it: new colours and fonts, icons everywhere, light/dark mode, header search, custom logo in header and footer, small animations. Added packages `@phosphor-icons/react`, `@fontsource/baloo-bhai-2`, `@fontsource-variable/plus-jakarta-sans`. Tests and build pass; checked in the browser on desktop and phone, light and dark. Committed and pushed. |
| 2026-10-26 | Asked to push all code to https://github.com/Jaydeep-Lkahani/guj-to-eng. Claude committed everything (new site, redesign, Part 1 lessons, removal of the old project's files) and pushed `main`. The old project's commits are in the history too. |
| 2026-10-26 | Asked to start p2-t01 (before reviewing Part 1). Claude wrote the Present Simple lesson: 8 short paragraphs (what it is for, I/You/We/They vs He/She/It + s, es / ies / has, never "I am drink", always/usually/often/sometimes/never, time words), 33 examples, 10 practice questions. Made the "coming soon" test in `src/App.test.tsx` pick any topic with no lesson, because it used p2-t01. Tests and build pass. Not yet looked at in the browser. Not committed. Waiting for my review. |
| 2026-10-26 | Asked to start p2-t02. Claude wrote the Present Continuous lesson: 9 short paragraphs (am/is/are + -ing vs "રહ્યો/રહી છું", which pronoun takes which, never leave am/is/are out, -ing spelling rules, time words like now/right now, difference from Present Simple, verbs like like/want that don't take -ing), 28 examples, 10 practice questions. Also found p2-t01 (Present Simple) already written but not recorded, so marked it "waiting for my review" here. Changed `src/App.test.tsx` so the "coming soon" test picks any topic without a lesson instead of fixed p2-t01. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p2-t03. Claude wrote the Past Simple lesson: 9 short paragraphs (one past form for every pronoun, -ed verbs and spelling rules, 10 common irregular verbs, never use am/is/are with them, was/were, time words like yesterday/ago), 33 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p2-t04. Claude wrote the Future lesson: 8 short paragraphs (will + verb with nothing added, am/is/are going to + verb, when to use which: plans vs quick decisions/promises/guesses, short form I'll, time words like tomorrow/next week/soon), 22 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p2-t05. Claude wrote the Negative Sentences lesson: 9 short paragraphs (not after am/is/are, short forms isn't/aren't/wasn't/weren't/I'm not, don't/doesn't with the plain verb, didn't with the plain verb, won't, -ing with isn't/aren't, one "no" word per sentence), 29 examples, 10 practice questions. Questions are left for p2-t06. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p2-t06. Claude wrote the Questions lesson: 9 short paragraphs (no Gujarati "શું" in English, am/is/are to the front, Do/Does/Did/Will + plain verb, short answers, question words What/Where/When/Who/Why/How/Which/Whose, word order mistake "What you want?", How many/much/old), 32 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p2-t07. Claude wrote the Conversations lesson: 9 short paragraphs (short natural answers, polite words, reactions like Really?/Great!, what to say when you don't understand, And you?, Let's + verb, Here you are, how to practise both roles), 3 short dialogues (friends on the phone, at a shop, asking the way) plus 15 useful phrases (34 examples), 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p2-t08. Claude wrote the Reading Short Passages lesson: 8 short paragraphs (how to read a passage: once for the idea, guess new words from the sentence, ask who/what/where/when, spot the tense, read aloud), 3 short passages (Ravi's day, Meena's Sunday, Next Sunday) with a Gujarati meaning under each line, 8 new words, 10 practice questions that quote the passage line they ask about. This finishes writing all of Part 2 (p2-t01 to p2-t08). Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p3-t01. Claude wrote the Present Perfect lesson: 9 short paragraphs (have/has + third form, regular and 12 irregular third forms, mistakes "I have went" / "He have" / "I am finished", Present Perfect vs Past Simple with a fixed time like yesterday, just/already/yet/ever/never, for vs since, haven't/hasn't and Have you…?), 38 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p3-t02. Claude wrote the Modal Verbs lesson: 9 short paragraphs (three rules: no s, plain verb after, no do/does; mistakes "He cans swim" / "I can to swim" / "Does he can swim?"; can/can't, should/shouldn't, must/mustn't; should is soft advice and must is a strong rule, though Gujarati uses "જોઈએ" for both), 28 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p3-t03. Claude wrote the If Sentences lesson: 9 short paragraphs (two parts and the comma, if + Present Simple with will, mistake "If it will rain", can/should in the result part, always-true facts, imaginary if + would incl. "If I were you", unless), 17 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p3-t04. Claude wrote the Comparisons lesson: 9 short paragraphs ("than" for Gujarati "કરતાં", short words +er, spelling rules big→bigger / happy→happier / large→larger, long words with more, mistakes "more taller" / "taller from" / "more better", the + est / the most, good-better-best and bad-worse-worst, as…as), 27 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p3-t05. Claude wrote the Joining Sentences lesson: 9 short paragraphs (and, but, or, so, because, when/while/before/after; mistake of using "because" and "so" together like Gujarati "કારણ કે… એટલે…"; no will after when/before/after), 25 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p3-t06. Claude wrote the Writing lesson: 9 short paragraphs (capital letters, full stop / question mark / comma / apostrophe, English word order is subject-verb-object unlike Gujarati, complete sentences, plan-write-check, First/Then/Finally, how to write a letter or email), 22 examples including a short email to a friend, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p3-t07. Claude wrote the Idioms & Common Expressions lesson: 9 short paragraphs (what an idiom is, why word-for-word translation fails, wording can't be changed, 6 easy idioms, 5 proverbs, everyday expressions like Get well soon / Long time no see, wishes for guests and festivals, don't overuse), 22 examples, 10 practice questions. Tests and build pass. Not yet looked at in the browser. Committed and pushed. |
| 2026-10-26 | Asked to start p3-t08. Claude wrote the Fluent Listening & Speaking lesson: 9 short paragraphs (listen for the main idea, daily listening and shadowing, spoken short forms gonna/wanna/gotta, speak even with mistakes, thinking words like Well/Actually, voice up for yes/no questions and down for statements, a daily speaking routine, a recap of the main mistakes from all lessons), a short phone conversation plus 24 examples in total, 10 practice questions. This finishes writing all of Part 3. **All 26 lessons are now written; none are reviewed yet.** Since every topic now has a lesson, the "coming soon" test in `src/App.test.tsx` now hides one lesson on purpose to check the note still works. Tests and build pass. Not yet looked at in the browser. |
| 2026-10-26 | Asked to push all code to git. Claude committed p2-t01 to p3-t08, the test change and this tracker, and pushed `main` to GitHub. |
| 2026-10-26 | Asked if sentence-construction patterns (Gujarati → English) are covered. Answer: only partly; word-order tips are scattered in p1-t10, p2-t06, p3-t06, with no dedicated lesson. Nothing changed in the site; added the idea to "Ideas for later". |
| 2026-10-26 | Asked to add a Gujarati → English sentence patterns lesson. Claude added it as **p1-t11** at the end of Part 1 (new ID, so nothing was renumbered): 11 short paragraphs (verb last in Gujarati vs second in English, a 5-step method: who → what does → what → where/when → check, am/is/are only when there is no action, a cheat-sheet of 5 patterns, small words like in/on/with/to go before the noun, subject can't be dropped, "મને ભૂખ લાગી છે" → I am hungry), 28 examples, 10 practice questions. Added to `content/parts.json`. Tests and build pass; opened at phone width, no sideways scrolling. Committed and pushed. |
| 2026-10-26 | Asked to add sentence-pattern tips to the other Part 1 lessons too. Claude added a short "word order" tip paragraph and 1–2 practice questions to p1-t05, p1-t06, p1-t07, p1-t08 (plus one example), p1-t09 and p1-t10; each points to lesson 11 for the full method. Fixed p1-t10 wording that called it the last lesson, and added "ભાગ 1 પૂરો થયો!" to the end of p1-t11. Tests and build pass; all 7 lessons open with no sideways scrolling. Committed and pushed. |
| 2026-10-26 | Said everything is done and reviewed (a couple of lessons checked, all as wanted; will send changes if any). Claude ticked all topics except p1-t11, the section 2/3/6 checklists and the "done" test. Remaining: sentence-pattern integration (item 7) and hosting (item 6, not mentioned as done). |
| 2026-10-26 | Said the open things were the sentence-pattern tips in p1-t05 to p1-t10 and lesson p1-t11, and to finish them. They were already built and passing tests, so Claude ticked p1-t11 and item 7. The only open item is hosting (item 6). |
| 2026-10-26 | Asked to do the sentence patterns for Part 2 first, then Part 3. Claude added to every Part 2 lesson (p2-t01 to p2-t08) and every Part 3 lesson (p3-t01 to p3-t08) a short "ક્રમ" (word order) tip paragraph that fits the topic (for example: always before the verb, am/is/are + -ing, "મેં" becomes I, will before the verb, don't before the verb, question word first, "કરતાં" part goes after than, join two small sentences, build a sentence piece by piece), 1–3 practice questions each, and a formula example in most. Tests and build pass; all 16 lessons open with the tip and no sideways scrolling. Committed and pushed. |
| 2026-10-28 | Asked what study material is missing to make learning easier. Claude reviewed all 27 lessons and the site and listed the gaps under "Study gaps found on 2026-10-28" in section 6: 10 grammar points never taught (biggest: "the", There is/are, have for owning, place words, telling the time), missing everyday word themes, and missing learning features (audio, other practice types, review of mistakes, speaking step). Nothing built yet. |
| 2026-10-28 | Said to build the gaps one by one; chose to put the new grammar lessons inside Part 1 in a natural order. Claude wrote **p1-t12 "a / an / the"** (shows as lesson 9, after am/is/are): 10 short paragraphs (a/an = "એક" for something new, the = "એ જ" for something known, first time a then the, the door / the sun, mistake "I am teacher" / "Open door", no a/the with names or my, two sounds ધ/ધી, a big house order), 25 examples, 12 practice questions. Changed the 4 "પાઠ 11" references in p1-t05, p1-t08, p1-t10, p3-t06 to "ભાગ 1 નો છેલ્લો પાઠ", and p1-t08 now says the comes next. Tests (89) and build pass; checked at phone width, no sideways scrolling. Committed (not pushed). |
| 2026-10-28 | Asked to commit p1-t12 and go on. Claude committed it, then wrote **p1-t13 "this / these and plurals"** (shows as lesson 10): 11 short paragraphs (this/that/these/those by near-far and one-many, Gujarati "આ" doesn't change but English does, this/that + is and these/those + are, plural + s, + es after s/sh/ch/x/o, y → ies but boy → boys, man/woman/child/person/foot/tooth, mistake "two book" and "a books", word order and answering What are these? with They are), 26 examples, 12 practice questions. Tests (92) and build pass; checked at phone width, no sideways scrolling. Committed (not pushed). |
| 2026-10-28 | Asked to commit p1-t13 and go on. Claude committed it, then wrote **p1-t14 "in / on / under — વસ્તુ ક્યાં છે?"** (shows as lesson 11): 10 short paragraphs (8 place words in, on, under, near, next to, behind, in front of, between; they go before the place, unlike Gujarati "ટેબલ પર"; in vs on; formula thing + is/are + place word + the place; Where is…? It is… / They are…; mistakes "bag in", missing is, missing the, "near to"; at home / at school / at work with no the), 25 examples, 12 practice questions. Tests (95) and build pass; checked at phone width, no sideways scrolling. Committed (not pushed). |
| 2026-10-28 | Asked to commit p1-t14 and go on. Claude committed it, then wrote **p1-t15 "There is / There are"** (shows as lesson 12): 9 short paragraphs (There is for one, There are for many; "There" here doesn't mean "ત્યાં"; place goes last unlike Gujarati; milk/water/sugar always There is with no a; There is a phone vs The phone is, linked to the a/the lesson; There is no / isn't / aren't; Is there…? Are there…? with short answers; mistakes incl. Indian-English "Milk is there in the fridge"), 21 examples, 12 practice questions. Tests (98) and build pass; checked at phone width, no sideways scrolling. Committed (not pushed). |
| 2026-10-28 | Asked to commit p1-t15 and go on. Claude committed it, then wrote **p1-t16 "have / has — મારી પાસે છે"** (shows as lesson 13): 10 short paragraphs (have with I/You/We/They and has with He/She/It; "મારી પાસે / મારે / તેને" becomes the person first; no am/is/are with have; health: I have a fever / a headache, and "My head is paining"; don't have / doesn't have; Do you have…? Does he have…? with short answers; There is vs have; I've got; the Part 3 "I have eaten" use is different), 22 examples, 12 practice questions. Tests (101) and build pass; checked at phone width, no sideways scrolling. Committed (not pushed). |
| 2026-10-28 | Asked to commit p1-t16 and go on. Claude committed it, then wrote **p1-t17 "મને, તેને અને રવિનું (me / him / Ravi's)"**, placed after Pronouns (shows as lesson 8): 10 short paragraphs (7 pairs I→me, He→him, She→her, We→us, They→them; who does the action vs who it's done to; "મને પાણી આપો" → Give me water order; with/for/to + me/him; his vs him, her for both; Ravi's bag with 's, same order as Gujarati; the ' mark; mistakes Give I, Him is, He's bag), 23 examples, 12 practice questions. Changed the last line of p1-t07, which said full sentences come in the next lesson. Tests (104) and build pass; checked at phone width, no sideways scrolling. Committed (not pushed). |
| 2026-10-28 | Asked to commit p1-t17 and go on. Claude committed it, then wrote **p1-t18 "કેટલા વાગ્યા? — સમય કહેતાં શીખો"**, placed after Colours, Days & Months (shows as lesson 16): 10 short paragraphs (What time is it? / It is…, o'clock only for full hours, easy digital way five ten / five thirty / five oh five, સવા/સાડા/પોણા = quarter past / half past / quarter to, દોઢ and અઢી have no special English word, past/to for other minutes, in the morning/afternoon/evening, at night, a.m./p.m., at + time vs on + day vs in + month, mistakes "Now time is five" and "quarter to four" for પોણા પાંચ, noon/midnight), 25 examples, 12 practice questions. Tests (107) and build pass; checked at phone width, no sideways scrolling. Committed (not pushed). |
| 2026-10-28 | Asked to commit p1-t18 and go on. Claude committed it, then wrote **p1-t19 "નમ્રતાથી માગો — Can I / Could you"**, placed after Daily-Life Phrases (shows as lesson 18): 10 short paragraphs (turn commands into polite questions like Gujarati "જરા … ખોલશો?"; Can you / Could you for asking others, Could is politer; Can I / Could I / May I for yourself; order Could + you + action + thing, where please goes; plain action after Can/Could/May, no to/-s/-ing; Would you like…? with Yes, please / No, thank you; answers Sure / No problem / Sorry, I can't; useful questions for shops, doctors and not understanding; the "can swim" meaning comes in Part 3), 24 examples, 12 practice questions. **This finishes the 8 planned Part 1 lessons; Part 1 now has 19 lessons in the agreed order.** Tests (110) and build pass; checked at phone width, no sideways scrolling. Committed (not pushed). |
| 2026-10-28 | Asked to commit p1-t19, then add a Listen button and a "put the words in order" practice. Claude committed p1-t19, then built: (1) **Listen**: `src/speech.ts` (browser speech, Indian English voice first, slightly slow, cleans text like "book → books"), every example card can be tapped to hear the English (`src/components/ExampleCard.tsx`), and a "સાંભળો" button in the quiz feedback when the right answer is English (`src/components/ListenButton.tsx`); (2) **Word order**: new question type `order` in `src/content.ts` and `src/components/Practice.tsx` (shuffled tiles, tap to place or send back, check button, green/red line, right sentence shown); 43 questions added (3 in p1-t11, 2 each in p1-t08, p1-t12 to p1-t19, p2-t01 to p2-t06, p3-t01 to p3-t05), each built from a sentence the lesson already teaches. Tests for both (116 pass), README updated. Checked in the browser at phone width: speech plays and stops, tiles place and go back, right answer turns green. **Note:** the "Gujarati-English SEO optimization" session was working in this folder at the same time (clean URLs instead of #/, prerender, Vercel, icons) and also edited `src/App.test.tsx`; it committed its work as cf0395a / e944930 (that commit also carried this log line). After it pointed out that the pre-built pages and the browser drew the Listen cards and word tiles differently, Claude made the speech check start as "off" on first draw (`useCanSpeak` in `src/speech.ts`) and made the tile shuffle come from the sentence instead of random, plus a test that tiles never start in the right order. Full `npm run check` passes (116 tests, 39 pre-rendered pages); the built page shows no console errors. Listen/word-order code is not committed. |
| 2026-10-28 | Asked for full SEO so the site ranks first for "gujarati to english". Address given: https://gujarati-to-english.vercel.app. Claude switched to clean URLs (old `#/` links redirect), made the build pre-render all 39 pages with full text, added per-page titles/descriptions/canonical/social tags and JSON-LD (Course, FAQPage, LearningResource, breadcrumbs), sitemap.xml, robots.txt, manifest, PNG icons and a share image, "Gujarati to English" in the header and home heading, and a 6-question Gujarati FAQ on the home page. Tests (110) and build pass; checked in the browser. Committed (not pushed). Another session's unfinished Listen button causes a hydration warning on lesson pages; Claude told that session how to fix it. Left for me: push, Search Console, Bing (item 8). |
| 2026-10-28 | Asked to redesign the home page so it looks more professional, with animations and micro-interactions. Claude rebuilt `src/pages/HomePage.tsx` and moved its styles into a new `src/home.css` (old home styles removed from `src/styles.css`). New: light hero with slowly drifting colour and a dot grid, gradient "નમસ્તે!", badge "મફત · ખાતું જરૂરી નથી", two buttons (continue lesson + "બધા ભાગ જુઓ" which scrolls down), counts (35 પાઠ, 970+ ઉદાહરણ, 449 સવાલ); a live word card (`src/components/WordDemo.tsx`) that moves through 5 words from the lessons every 3.6 s, pauses on hover/touch/focus, has dots to pick a word and a "સાંભળો" button, and tilts slightly with the mouse; floating progress ring and "સરસ! સાચો જવાબ." chip; "how it works" as 3 numbered steps joined by a dashed line; part cards with big 01/02/03, a mouse-following glow and border, and a ચાલુ છે / પૂરો label once started; FAQ beside a sticky heading, opening smoothly; a closing purple band with the continue button. Sections slide in as they scroll into view (Chrome/Safari; others just show them). Layout follows the page-area width, so it works with and without the sidebar. Reduced-motion turns all of it off. Tests (116) and build pass (39 pages pre-rendered); checked in the browser in light and dark, wide and phone width (no sideways scrolling), and the built site has no console warnings. Not committed. |
| 2026-10-28 | Said the Listen voice (e.g. "How are you?" on the home page) doesn't pronounce well enough. Cause: it used the device's built-in voice, which differs per phone; on this Mac it picked an old robotic Indian English voice. Chose pre-recorded audio made by a natural-sounding voice. Claude built it: `scripts/make-audio.mjs` (`npm run audio`) records every sentence the site can play (1060, ~16,000 characters) with OpenAI `gpt-4o-mini-tts`, voice "coral", told to speak clearly and a little slowly like a teacher; files go to `public/audio/`, listed in `src/audio-manifest.json`. `src/speech.ts` now plays the recording first and falls back to the device voice when a sentence has none or it fails to load. Spoken text drops end notes like "(voice goes up)". New tests in `src/speech-audio.test.ts`, plus a check that every listed file exists (122 pass); build passes. Checked in the browser with a stand-in recording: the home card and lesson cards play the file, others use the device voice. **Not done:** the real recordings need my OpenAI key (item 9). Not committed. |
| 2026-10-28 | Asked to push all code. Claude ran the full check (122 tests, 39 pre-rendered pages), then committed everything not yet committed (Listen button and word-order practice with their lesson changes, home page redesign, natural-voice audio setup) and pushed `main` to GitHub, together with the 10 earlier local commits (p1-t12 to p1-t19 and SEO). `.env.local` (the OpenAI key) is not committed. The recordings themselves are still not made (item 9). |
| 2026-10-28 | Asked to redesign the inner pages (lesson and part pages) to look more professional and interactive, with micro-interactions that keep her reading and opening more lessons. Claude rebuilt `src/pages/TopicPage.tsx` and `src/pages/PartPage.tsx` with new components `LessonSteps`, `ExplainList`, `ExampleDeck`, `UpNext` and styles in a new `src/lesson.css` (unused old part-list, pager and done-banner styles removed from `src/styles.css`). See the decision row of the same date for what's on each page. Practice got a streak chip, score ring, burst, retry-only-wrong and a next-lesson button on the result. Every new animation stops when the device asks for reduced motion. Tests (122) and full build pass (39 pages pre-rendered with all lesson text); checked in the browser at 375px and 472px, light and dark, and desktop layout by measurement (no sideways scrolling); the built site shows no console warnings. Committed (b882307) and pushed to GitHub on request, so Vercel deploys it. |
| 2026-10-29 | Said the lesson page looks clunky on mobile (the sticky bar with next and the 3 parts સમજીએ / ઉદાહરણ / પ્રેક્ટિસ), fix mobile only. Claude added a phone-only block at the end of `src/lesson.css` (inside `max-width: 899px`, so desktop can't change): sticky bar 84px → 65px tall with segmented tabs and a matching next button; lesson facts as a 4-column strip; sections without the card frame so content gets the full width; examples one per row in two lines. Checked at 375px and 320px in dark and light (no sideways scrolling, tab labels fit, tapping a tab shows its heading below the bar, hide-meaning still works) and confirmed desktop styles are unchanged by measurement. Full check passes. Not committed. |
| 2026-10-30 | Asked to improve the sidebar (the chapter list) so it is more interactive, professional and good looking. Claude rewrote `src/components/Sidebar.tsx` and moved its styles into a new `src/sidebar.css` (see the decision row of the same date). Checked in the browser on desktop, phone (menu drawer) and dark mode; 122 tests pass and the full build with 39 pre-rendered pages works. Committed and pushed to `main` together with the 2026-10-29 phone lesson-page changes. |
| 2026-10-31 | Asked whether finishing the course will make my wife fluent (speak, read, write like an expert). Claude's answer: no — the 35 lessons take a beginner to about A2 (simple daily English: read short texts, make basic sentences, simple conversations, slowly). Fluency needs months of daily speaking and listening with real people and far more words than the ~970 examples here. Biggest gaps on the site: no speaking practice, no review of old words, small everyday vocabulary (see "Study gaps"). No code changed. |
| 2026-10-31 | Asked what to add so she can reach fluency (speak, read, write). Claude proposed the 9-step "Fluency roadmap" in section 6 (daily review, microphone speaking practice, role-plays, everyday vocabulary, writing practice, story library, more grammar and Part 4, tests, optional AI speaking partner). Nothing built yet; waiting for my choice. |
| 2026-10-31 | Asked whether the roadmap items are part of the lessons, and whether they are written well enough for Sonnet to build. Answer: some go inside lessons, some are new pages; and no, they were one-liners. Asked to create a CLAUDE.md. Claude wrote `CLAUDE.md` (start/end-of-conversation rules, never-changing rules, commands, file map, Gujarati content-writing rules taken from the existing lessons, code patterns for saved data, pre-rendering, new pages and new question types, and the checks before "done") and `docs/roadmap.md` (a full spec per roadmap step: what she sees, how it works, data formats, files, questions to ask me first with defaults, and "done when"). Linked both from section 6 and 7. No site code changed; nothing committed. |
| 2026-10-31 | Asked how to get the Listen audio for free, then chose `edge-tts` and the voice Neerja after hearing samples (Mac `say` voices Rishi/Tara/Aman and edge-tts Neerja/Prabhat were compared). Claude rewrote `scripts/make-audio.mjs` to call `edge-tts` (writes to a temp name first, retries 4 times, `EDGE_TTS` env var can point to the program) and recorded all 1060 sentences (17 MB). `npm run check` passes (122 tests, 39 pre-rendered pages). Checked in the browser at phone width: tapping an example card plays its recording (`/audio/….mp3`, no console errors). Updated `README.md`, `CLAUDE.md`, `.gitignore` comment and item 9. **Not done:** not committed or pushed; not tried on a real Android phone; I have not listened to every sentence, so some may sound odd (numbers and short words like "0, Zero" are worth checking). |
| 2026-10-31 | Said yes to roadmap step 1 (Daily review). Claude built it: `src/review.ts` (boxes 0–4 with gaps 1, 3, 7, 14, 30 days; question id from the text, not the lesson order; streak; seeding of lessons finished earlier; saved under `guj-eng.review.v1`) with 23 unit tests, `onAnswer` and `tags` props on `Practice` (every lesson answer is remembered), the page `/review` (`ReviewPage.tsx`, `review.css`; start screen, quiz with a lesson tag on each question, result with streak and tomorrow's count, "done for today" and "no lessons yet" states), a sidebar link with a count badge, and a card on the home page (shown once she has review questions). The page is pre-rendered with noindex and left out of the sitemap. Tests (149: 23 unit tests and 4 page tests are new) and `npm run check` pass, 40 pages pre-rendered. Checked in the browser at 375px (dark) and 320px (light) and at 1280px: no sideways scrolling, no console errors; seeded 5 finished lessons, ran a set of 8, saw the streak, the done state and the sidebar and home counts. **Not done:** not committed or pushed; not tried on a real phone; the step-2 "say aloud" and other roadmap steps are untouched. Browser test data was cleared. |
