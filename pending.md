# pending.md — Project tracker

The single record of this project: what was asked, what was decided, what is done, and what is still pending.

**Rule:** update this file at the end of every conversation in this folder. Add a line to the conversation log (section 9) and update the checklists.

Last updated: 2026-10-26

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
- [ ] Real lesson content for every topic (see section 4)

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
- [ ] I can open the site, go Home → Part → Topic, read a complete Gujarati-taught lesson, and finish its practice questions. *(Navigation and practice work. Waiting on the real Part 1 lessons.)*

## 3. Process (agreed order of work)

1. [x] Propose the part and topic list in Gujarati and English, and wait for approval. *(Approved 2026-10-26)*
2. [x] Build the layout and navigation with placeholder content. *(Done 2026-10-26)*
3. [ ] Write the content for Part 1 only, then I review it.
4. [ ] After my review: write Part 2, then Part 3 (each reviewed before moving on).

## 4. Approved topic list

Tick a topic when its real lesson is written **and** I've reviewed it.

### ભાગ 1 — શરૂઆત (Basic)
| ✓ | ID | ગુજરાતી | English | Lesson status |
|---|---|---|---|---|
| [ ] | p1-t01 | ABCD — અંગ્રેજી અક્ષરો | The Alphabet | Written 2026-10-26, waiting for my review |
| [ ] | p1-t02 | અક્ષરોના અવાજ | Letter Sounds | Written 2026-10-26, waiting for my review |
| [ ] | p1-t03 | આપણા પહેલા શબ્દો | First Words | Written 2026-10-26, waiting for my review |
| [ ] | p1-t04 | આંકડા 1 થી 100 | Numbers 1–100 | Written 2026-10-26, waiting for my review |
| [ ] | p1-t05 | નમસ્તે અને ઓળખાણ | Greetings & Introducing Yourself | Written 2026-10-26, waiting for my review |
| [ ] | p1-t06 | કુટુંબ અને લોકો | Family & People | Written 2026-10-26, waiting for my review |
| [ ] | p1-t07 | હું, તમે, તે | Pronouns | Written 2026-10-26, waiting for my review |
| [ ] | p1-t08 | am / is / are વાળાં સાદાં વાક્યો | Simple Sentences with am/is/are | Written 2026-10-26, waiting for my review |
| [ ] | p1-t09 | રંગ, વાર અને મહિના | Colours, Days & Months | Written 2026-10-26, waiting for my review |
| [ ] | p1-t10 | રોજબરોજનાં વાક્યો | Daily-Life Phrases | Written 2026-10-26, waiting for my review |

### ભાગ 2 — આગળ વધીએ (Intermediate)
| ✓ | ID | ગુજરાતી | English | Lesson status |
|---|---|---|---|---|
| [ ] | p2-t01 | રોજ શું કરો છો? | Present Simple | Not written |
| [ ] | p2-t02 | અત્યારે શું ચાલે છે? | Present Continuous | Not written |
| [ ] | p2-t03 | ગઈકાલે શું કર્યું? | Past Simple | Not written |
| [ ] | p2-t04 | કાલે શું કરશો? | Future (will / going to) | Not written |
| [ ] | p2-t05 | "ના" વાળાં વાક્યો | Negative Sentences | Not written |
| [ ] | p2-t06 | સવાલ પૂછતાં શીખો | Questions | Not written |
| [ ] | p2-t07 | વાતચીત | Conversations | Not written |
| [ ] | p2-t08 | નાના પાઠ વાંચીએ | Reading Short Passages | Not written |

### ભાગ 3 — પાકું કરીએ (Advanced)
| ✓ | ID | ગુજરાતી | English | Lesson status |
|---|---|---|---|---|
| [ ] | p3-t01 | કામ પૂરું થયું | Present Perfect | Not written |
| [ ] | p3-t02 | can, should, must | Modal Verbs | Not written |
| [ ] | p3-t03 | જો… તો… | If Sentences | Not written |
| [ ] | p3-t04 | સરખામણી | Comparisons | Not written |
| [ ] | p3-t05 | વાક્યો જોડીએ | Joining Sentences | Not written |
| [ ] | p3-t06 | લખતાં શીખો | Writing | Not written |
| [ ] | p3-t07 | રૂઢિપ્રયોગો | Idioms & Common Expressions | Not written |
| [ ] | p3-t08 | સાંભળો અને છૂટથી બોલો | Fluent Listening & Speaking | Not written |

## 5. Decisions made

| Date | Decision | Why |
|---|---|---|
| 2026-10-26 | Start fresh instead of continuing the previous project | The new request is simpler and plain (see section 8) |
| 2026-10-26 | Call phases **ભાગ** ("part") on the site, not તબક્કો | Simpler everyday word |
| 2026-10-26 | Stack: Vite + React + TypeScript, plain CSS | Builds to a static site that can be hosted anywhere |
| 2026-10-26 | Hash URLs (`#/topic/p1-t01`) | Works on any static host with no server setup |
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
| 2026-10-26 | Small animations (hover lift, arrow nudge, right/wrong answer pop and shake, progress fill). All turned off when the device asks for reduced motion | Requested "micro interactions" |

## 6. Pending / next steps

1. [x] **Write the real lessons for Part 1** (10 topics): explanation, examples with transliteration, and practice questions. *(All 10 written 2026-10-26, waiting for review.)*
2. [ ] I review the Part 1 lessons and send changes.
3. [ ] Write Part 2 lessons, then review.
4. [ ] Write Part 3 lessons, then review.
5. [x] Commit the new project to git and push to GitHub: https://github.com/Jaydeep-Lkahani/guj-to-eng *(Done 2026-10-26)*
6. [ ] Decide where to host the site (e.g. GitHub Pages or Netlify) so she can open it on her phone.

### Ideas for later (not agreed yet, ask before building)
- "Listen" button on English words using the browser's built-in speech
- More practice types (type the answer, match pairs)
- A way to reset progress from the site

## 7. How to run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

- `npm test`: runs the tests, including a check of every content file
- `npm run build`: makes the static site in `dist/`
- `npm run check`: type check, then tests, then build

How to add a topic is explained in `README.md`.

### Files
- `content/parts.json`: parts and topics, in order
- `content/lessons/<id>.json`: one lesson per topic
- `src/components/`: layout, sidebar, practice quiz and shared bits
- `src/pages/`: Home, Part, Topic and not-found pages
- `src/content.ts`: loads the content files
- `src/progress.ts`: saves completed topics in the browser
- `src/styles.css`: all styling, with light and dark colours at the top
- `src/theme.ts`: light/dark switch (index.html also sets it before the page draws)
- `src/search.ts`: search over topics and lesson examples
- `src/components/Logo.tsx`: the logo (a copy is in `public/favicon.svg`)

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
| 2026-10-26 | Said the site looked bad. Claude redesigned it: new colours and fonts, icons everywhere, light/dark mode, header search, custom logo in header and footer, small animations. Added packages `@phosphor-icons/react`, `@fontsource/baloo-bhai-2`, `@fontsource-variable/plus-jakarta-sans`. Tests and build pass; checked in the browser on desktop and phone, light and dark. Not committed. |
| 2026-10-26 | Asked to push all code to https://github.com/Jaydeep-Lkahani/guj-to-eng. Claude committed everything (new site, redesign, Part 1 lessons, removal of the old project's files) and pushed `main`. The old project's commits are in the history too. |
