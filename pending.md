# pending.md — Project tracker

The single record of this project: what was asked, what was decided, what is done, and what is still pending.

**Rule:** update this file at the end of every conversation in this folder. Add a line to the conversation log (section 9) and update the checklists.

Last updated: 2026-10-28

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
| [x] | p1-t08 | am / is / are વાળાં સાદાં વાક્યો | Simple Sentences with am/is/are | Written and reviewed 2026-10-26 |
| [ ] | p1-t12 | a / an / the ક્યારે વાપરવા | a, an and the | Written 2026-10-28 (shows as lesson 9). Waiting for my review |
| [ ] | p1-t13 | this / these — એક અને ઘણી વસ્તુઓ | this, that, these, those & Plurals | Written 2026-10-28 (shows as lesson 10). Waiting for my review |
| [ ] | p1-t14 | in / on / under — વસ્તુ ક્યાં છે? | Place Words: in, on, under, near | Written 2026-10-28 (shows as lesson 11). Waiting for my review |
| [ ] | p1-t15 | There is / There are — ક્યાં શું છે? | There is / There are | Written 2026-10-28 (shows as lesson 12). Waiting for my review |
| [ ] | p1-t16 | have / has — મારી પાસે છે | have / has (Owning Things) | Written 2026-10-28 (shows as lesson 13). Waiting for my review |
| [x] | p1-t09 | રંગ, વાર અને મહિના | Colours, Days & Months | Written and reviewed 2026-10-26 |
| [x] | p1-t10 | રોજબરોજનાં વાક્યો | Daily-Life Phrases | Written and reviewed 2026-10-26 |
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
| 2026-10-28 | New grammar lessons go inside Part 1 where they fit, with new IDs (p1-t12, p1-t13, …), so no file is renamed | Chosen by me from three options |
| 2026-10-28 | Lessons refer to the sentence-pattern lesson as "ભાગ 1 નો છેલ્લો પાઠ", not by number | Its number changes as lessons are added |
| 2026-10-26 | Small animations (hover lift, arrow nudge, right/wrong answer pop and shake, progress fill). All turned off when the device asks for reduced motion | Requested "micro interactions" |

## 6. Pending / next steps

1. [x] **Write the real lessons for Part 1** (10 topics): explanation, examples with transliteration, and practice questions. *(All 10 written 2026-10-26, waiting for review.)*
2. [x] I review the Part 1 lessons and send changes. *(Reviewed 2026-10-26: all fine, no changes. I will send any later changes.)*
3. [x] Write Part 2 lessons, then review. *(All 8 written and reviewed 2026-10-26.)*
4. [x] Write Part 3 lessons, then review. *(All 8 written and reviewed 2026-10-26.)*
5. [x] Commit the new project to git and push to GitHub: https://github.com/Jaydeep-Lkahani/guj-to-eng *(Done 2026-10-26)*
6. [ ] Decide where to host the site (e.g. GitHub Pages or Netlify) so she can open it on her phone. *(Not done. Not mentioned as done on 2026-10-26.)*
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
- [ ] me/him/her/us/them and Ravi's (possessive 's)
- [ ] some/any, much/many, a lot of
- [ ] Telling the time and dates ("It's half past four"); "What time is it?" is asked but never answered
- [ ] Polite requests: Can I…? / Could you…? / Would you like…?
- [ ] Later: Past Continuous (was/were + -ing), used to

Everyday word themes missing (First Words has only 30 nouns):
- [ ] Kitchen and cooking, vegetables and fruits, clothes, rooms of the house
- [ ] Health and doctor ("I have a fever"), places in town and directions (turn left/right), transport, jobs
- [ ] ~30 common action verbs, feelings, and opposites (big/small, hot/cold)

Ways of learning missing on the site:
- [ ] Sound: no audio anywhere, she only has the Gujarati spelling of the pronunciation
- [ ] Only one practice type (all 310 questions are tap-the-answer). She never builds or types English. Best fit: "put the words in order" for the word-order tips
- [ ] No review: wrong answers aren't saved, no "revise old words", no end-of-part test
- [ ] No speaking step ("say it aloud") at the end of a lesson
- [ ] ❌ wrong / ✅ right boxes and small tables instead of 9–11 plain paragraphs
- [ ] Lessons are long for one sitting (up to 39 examples and 12 questions)
- [ ] A word list page ("all words I've learnt" / "my hard words")
- [ ] Transliteration is always shown; could be tap-to-show in Parts 2–3
- [ ] Works offline once opened (installable on the phone), together with hosting (item 6)

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
