# Pending — "Learn English from Gujarati" Website

> Master plan **and build specification** for the website and the full English curriculum.
> This file is in English. **Everything on the website (menus, buttons, explanations, instructions, feedback) is in Gujarati.** Only the English being taught is shown in English.
> Builder: **Claude Sonnet 5.5** (`claude-sonnet-5-5`) in Claude Code. Builder rules are in `CLAUDE.md` and section 7.
> Tick `[x]` only as defined in "Checkbox rules" below.

## How to use this file (builder: read this first)

1. Read **this whole file** and `CLAUDE.md` before writing any code, at the start of every session.
2. Sections 0–6 say **what** to teach. Section 7 says **how** to build it. Section 8 lists open decisions and the default to use until the user answers.
3. Build **one milestone at a time** (section 7.13), in order, as small **steps** (10–20 minutes each). After each step: step gate (7.12), tick, commit, continue. After each milestone: full milestone gate, report, and **wait for the user's go-ahead**.
4. If something is unclear, or two parts of this file disagree, **stop and ask the user**. Never guess. Never quietly change the plan.
5. "The user" = the person giving instructions in chat (the learner's husband). "The learner" = his wife, who uses the website.

### Checkbox rules
| Where | Tick `[x]` when… | Who ticks |
|---|---|---|
| Section 0 lesson steps | the lesson player supports that step | builder |
| Section 1 (`GS-xx`) | at least one lesson lists that ID in `targetsMistakes` **and** has a drill for it | builder |
| Sections 3–5 curriculum items | lessons that teach the item exist and `npm run validate:content` passes | builder |
| 🎥 lines | that topic has at least 1 video with status `approved` | builder, **only after the user approved the video in chat** |
| V.1, V.5 and section 6 | the website feature that supports it exists and works | builder |
| Section 7 items | built, tested, and passing the milestone's acceptance checks | builder |
| Section 8 questions | the user has answered | builder writes the answer next to it |

### Numbering (used everywhere, never reuse a number for something else)
- Curriculum topics: `P1.1 … P1.10`, `P2.1 … P2.9`, `P3.1 … P3.7` (P = phase). In code: `p1-t01 … p3-t07`.
- Video rules: `V.1 … V.5`.
- Gujarati-speaker problems: `GS-01 … GS-26`.
- Website spec: `7.1 … 7.15`. Milestones: `M1 … M12`.

---

## 0. Who This Is For & How We Teach

### Learner profile
- Native language: Gujarati (reads and writes Gujarati script).
- English level: **absolute beginner (zero)** — starts from the alphabet.
- Goal: **speak, read and write English fluently** in daily life.
- Most likely device: mobile phone → the site must be **mobile-first**.

### Teaching approach (teacher with 25+ years of experience)
1. **Explain in Gujarati, practise in English.** Every new idea is explained in simple Gujarati first, then shown with English examples.
2. **Transliteration as a bridge, then removed.** Phase 1 shows English words with Gujarati pronunciation (Apple → ઍપલ). Phase 2 shows it only on tap. Phase 3 never shows it.
3. **Speak from day one.** Every lesson ends with something to say out loud.
4. **Real life first.** Vocabulary comes from her own day: kitchen, family, market, children's school, doctor, phone calls, travel.
5. **Small daily doses beat long weekly sessions.** 30–45 minutes per day.
6. **Spaced repetition.** Old words and rules come back after 1, 3, 7, 14 and 30 days.
7. **Mistakes are welcome.** Feedback is gentle and always shows the correct version with a reason in Gujarati.
8. **4 skills in natural order:** Listening → Speaking → Reading → Writing.

### Standard lesson structure (every lesson follows this)
- [x] 1. Warm-up — quick review of yesterday (2 min)
- [x] 2. **🎥 Watch the videos first** — 1 to 3 short videos where a tutor explains the topic **in Gujarati** (10–15 min). Topic videos play in the **first** lesson of each topic; later lessons show their own video if they have one. See section 2.
- [x] 3. Detailed explanation on the page, in Gujarati — same topic, step by step, with tables and examples (5–10 min)
- [x] 4. Examples with audio (5 min)
- [x] 5. Guided practice — tap / match / fill-in (10 min)
- [ ] 6. Speak aloud — repeat after audio, then say it alone (5 min)
- [ ] 7. Write — type or handwrite 3–5 sentences (5 min)
- [x] 8. Mini quiz — 5 questions (3 min)
- [x] 9. "Use it today" task — one real-life sentence to use at home

> Why videos first: watching and hearing a tutor explain in her own language makes the idea easy to understand. The written explanation then fills in the details and stays there to re-read anytime.

### Estimated timeline (at 30–45 min/day)
| Phase | Level (CEFR) | Duration |
|---|---|---|
| Phase 1 — Basic | A0 → A1 | 3–4 months |
| Phase 2 — Intermediate | A2 → B1 | 5–6 months |
| Phase 3 — Advanced | B2 → C1 | 6–9 months |

---

## 1. Common Problems for Gujarati Speakers (teach these on purpose)

These are the mistakes almost every Gujarati speaker makes. Each one needs its own lesson, practice drill and repeated review. Lessons reference them by ID in `targetsMistakes`.

### Pronunciation
- [ ] `GS-01` **V vs W** — Gujarati has only "વ". English has two sounds: *van* vs *one/water*.
- [ ] `GS-02` **Z vs J** — "zoo" is not "જૂ". Teach the buzzing "z" sound.
- [ ] `GS-03` **Extra vowel before S-clusters** — "school" not "ઇસ્કૂલ", "station" not "ઇસ્ટેશન", "sport" not "ઇસ્પોર્ટ".
- [ ] `GS-04` **TH sounds** — *think* (θ) is not "થિંક", *this* (ð) is not "દિસ".
- [ ] `GS-05` **F vs PH(ફ)** — English "f" uses lip + teeth, not aspirated "ફ".
- [ ] `GS-06` **Short vs long vowels** — ship/sheep, full/fool, live/leave.
- [ ] `GS-07` **Bad vs Bed (æ vs e)** — man/men, bat/bet.
- [ ] `GS-08` **Schwa (ə)** — the weak "uh" sound in *about, banana, teacher*.
- [ ] `GS-09` **Word stress** — PHOto vs phoTOgraphy; Gujarati stress is flatter.
- [ ] `GS-10` **Silent letters** — knife, write, hour, island, Wednesday.

### Grammar
- [ ] `GS-11` **Word order** — Gujarati is Subject-Object-Verb: "હું શાળાએ જાઉં છું". English is Subject-Verb-Object: "I go to school".
- [ ] `GS-12` **Articles (a / an / the)** — Gujarati has none, so they are forgotten.
- [ ] `GS-13` **He / She confusion** — Gujarati "તે" covers both; English must choose.
- [ ] `GS-14` **No grammatical gender** — English nouns (table, book) are not masculine/feminine.
- [ ] `GS-15` **"You" has one form** — no તું / તમે difference; respect is shown with *please, could you, sir/madam*.
- [ ] `GS-16` **Prepositions come before the noun** — Gujarati "ઘરમાં" (house-in) → English "in the house".
- [ ] `GS-17` **Overusing continuous tense** — "I am having two children" → "I have two children".
- [ ] `GS-18` **Questions need helper verbs** — "You are coming?" → "Are you coming?"; "Where you live?" → "Where do you live?"
- [ ] `GS-19` **Uncountable nouns** — not "informations, furnitures, luggages".
- [ ] `GS-20` **"Isn't it?" for everything** — learn correct question tags.
- [ ] `GS-21` **Self-introduction habits** — "Myself Hetal" → "My name is Hetal" / "I am Hetal".
- [ ] `GS-22` **Said vs Told** — "He said me" → "He told me" / "He said to me".
- [ ] `GS-23` **Since vs For** — "since 2 years" → "for 2 years".

### Reading & Writing
- [ ] `GS-24` **English spelling is not phonetic** — unlike Gujarati script, the same letter can make many sounds. Explain this early so she does not get discouraged.
- [ ] `GS-25` **Capital letters** — Gujarati has none. Teach: sentence start, "I", names, days, months, places.
- [ ] `GS-26` **Punctuation** — full stop, comma, question mark, apostrophe.

---

## 2. Video Lessons (Gujarati tutor)

Every curriculum topic (P1.1 … P3.7) **starts with videos**: a tutor explains the topic **in Gujarati**, then the detailed written lesson follows. Every topic in sections 3–5 has a 🎥 line to track this.

### V.1 How videos fit into each topic
- [ ] Each topic has 1–3 **topic videos**, played in a fixed order: intro → main explanation → examples/practice
- [ ] Topic videos are shown at the top of the topic page **and** as step 2 of the topic's **first** lesson
- [ ] Any lesson may also have its own short video (optional). A lesson with no own video (and not the first in its topic) skips step 2 and shows a "watch the topic videos again" link instead
- [ ] Each video is 5–15 minutes. A long video can be cut to one part with start/end times
- [ ] The written lesson is **never locked** behind videos (a topic may have no approved video yet, or the internet may be off). The page shows videos first, plus a gentle Gujarati hint to watch them before reading
- [ ] She can rewatch any video from the topic page or the video library

### V.2 Quality checklist (every video must pass before it is approved)
A good teacher checks the teacher. Many Gujarati-medium English videos have mistakes, so each video is reviewed against this list:
- **Language:** explained in clear, simple, everyday Gujarati (not heavy textbook Gujarati, not mostly Hindi or English)
- **Correct English:** the tutor's English examples are grammatically correct
- **Correct pronunciation:** the tutor does not make the common mistakes from section 1 (e.g. "ઇસ્કૂલ", V/W mix-up, "જૂ" for zoo). If they do, the video is rejected
- **Teaches well:** explains step by step, uses a board or on-screen text, gives many examples, compares with Gujarati sentences
- **Right level:** matches the topic and phase (no advanced grammar inside a Phase 1 video)
- **Clear audio and video:** no loud background noise, text readable on a phone screen
- **On topic:** covers this topic only; no long intros, selling or off-topic talk
- **Family-friendly** and free to watch
- **Still available:** the link works (all links re-checked every 3 months)

### V.3 Where videos come from, and who approves them
- Start with existing Gujarati-language English-teaching videos on YouTube, embedded on the site
- **The builder (AI) cannot judge a video's teaching quality or pronunciation.** A person (the user or the learner) must watch every video and approve it
- Workflow for every video:
  1. Builder searches for candidate videos for a topic (2–5 candidates per topic).
  2. Builder confirms each video exists with YouTube oEmbed: `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json` must return HTTP 200. The original title and channel name are copied **exactly** from that response.
  3. Builder adds it to `content/videos.json` with `status: "candidate"` and lists it in `video-review.md` (topic code, original title, channel, full link, duration if known).
  4. The user watches it, checks it against V.2, and tells the builder in chat: approve or reject (with a reason).
  5. Builder sets `status` to `"approved"` or `"rejected"` and fills `reviewedBy`, `reviewedAt`, `reviewNote`.
- **Never invent, guess or "remember" a YouTube ID.** Only IDs confirmed in step 2 may be written anywhere
- Only `approved` videos appear on the website. If a topic has none, the page shows "આ વિષયનો વિડિયો ટૂંક સમયમાં આવશે" and continues with the written lesson
- `video-review.md` also keeps a shortlist of trusted tutors/channels (prefer the same tutor across one phase) and a "needs own video" list for topics with no good video (we may record our own later, M12)

### V.4 Information stored for each video
Exact fields are in the `Video` schema (section 7.4): YouTube ID, original title, Gujarati title, channel, duration, optional start/end time, topic(s), order, Gujarati "what you will learn" note, key words, quick-check questions, review status and review details, last link check date.

### V.5 Video features on the website
- [ ] Embedded player (YouTube, privacy-enhanced) at the top of the topic page and in lesson step 2
- [ ] "Watched ✔" mark and progress per video, saved in her progress
- [ ] Resume from where she stopped
- [ ] Speed control (0.75x and 1x)
- [ ] Notes box under each video (she writes what she understood)
- [ ] "Words from this video" — key English words of the **topic**, with audio and Gujarati meaning
- [ ] 2–3 quick questions after the video. They test the **topic**, not details only the video shows (the builder cannot watch videos)
- [ ] Video library page: all approved videos by phase and topic, with watched/unwatched filter
- [ ] Without internet: Gujarati message "વિડિયો જોવા માટે ઇન્ટરનેટ જોઈએ" and the written lesson continues (YouTube cannot play offline)

---

## 3. Phase 1 — Basic (Beginner, A0 → A1)

**Goal:** Read and write the alphabet, recognise ~600 everyday words, make simple present-tense sentences, introduce herself, and handle basic daily conversations.

### P1.1 The Alphabet
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Capital letters A–Z (recognise, say, write)
- [ ] Small letters a–z (recognise, say, write)
- [ ] Matching capital ↔ small letters
- [ ] Letter names vs letter sounds (A = "એ" name, but sound "ઍ" in *apple*)
- [ ] Vowels (a, e, i, o, u) and consonants
- [ ] Handwriting on four-line guide (stroke order for each letter)
- [ ] Alphabet song / chant
- [ ] Alphabetical order (useful for dictionaries and lists)
- [ ] Practice: letter tracing, letter recognition games, "find the letter"

### P1.2 Phonics & Basic Pronunciation
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Single consonant sounds (b, c, d, f, g, …)
- [ ] Short vowel sounds (a as in cat, e bed, i sit, o hot, u cup)
- [ ] Long vowel sounds (cake, tree, bike, home, cute)
- [ ] Magic "e" rule (cap → cape, kit → kite)
- [ ] Consonant blends (bl, cr, st, tr, sp, …)
- [ ] Digraphs (sh, ch, th, ph, wh, ck, ng)
- [ ] Vowel teams (ee, ea, oa, ai, ay, oo, ou, ow)
- [ ] Basic silent letters (kn, wr, mb, gh)
- [ ] Gujarati-speaker sound drills (V/W, Z/J, TH, F, S-clusters — see section 1)
- [ ] Practice: listen-and-choose, minimal pairs, repeat-after-me with recording

### P1.3 First Reading
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Blending sounds into 3-letter words (c-a-t → cat)
- [ ] Sight words — top 100 (the, is, and, a, to, in, it, you, of, …)
- [ ] Sight words — next 120 (Dolch list complete)
- [ ] Reading 2–3 word phrases ("a red pen")
- [ ] Reading short simple sentences ("This is my cup.")
- [ ] Reading signs around her: EXIT, PUSH, PULL, OPEN, CLOSED, TOILET, NO PARKING
- [ ] Reading labels: food packets, medicine boxes (name, dose, expiry date)
- [ ] Practice: picture-word match, read-aloud with recording

### P1.4 First Writing & Spelling
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Copying words and short sentences
- [ ] Writing her own name, family names, address, phone number
- [ ] Spelling 3- and 4-letter words
- [ ] Capital letter rules (start of sentence, "I", names, days, months, cities)
- [ ] Full stop and question mark
- [ ] Spaces between words
- [ ] Dictation — listen and write single words, then short sentences
- [ ] Filling simple forms (name, age, address, date of birth)
- [ ] Practice: typing practice on phone keyboard, handwriting upload/self-check

### P1.5 Numbers, Time & Calendar
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Numbers 0–20, then 20–100, then hundreds, thousands, lakh vs hundred thousand, million
- [ ] Ordinal numbers (first, second, third, …)
- [ ] Money: rupees, prices ("How much is this?", "It is 50 rupees.")
- [ ] Telling time (o'clock, half past, quarter to, 7:45)
- [ ] Days of the week
- [ ] Months of the year
- [ ] Dates (25th October 2026, saying vs writing)
- [ ] Seasons and weather words

### P1.6 Core Vocabulary (~600 words, by theme)
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Greetings & polite words (hello, thank you, sorry, please, excuse me)
- [ ] Family & relations (mother, husband, son, daughter, mother-in-law, cousin)
- [ ] Body parts
- [ ] Colours & shapes
- [ ] Home — rooms & furniture
- [ ] Kitchen — utensils, cooking actions (cut, boil, fry, mix)
- [ ] Food — vegetables, fruits, grains, spices, dishes
- [ ] Clothes & accessories
- [ ] Daily routine verbs (wake up, brush, cook, clean, sleep)
- [ ] Market & shopping
- [ ] Animals & birds
- [ ] Transport (bus, train, auto-rickshaw, ticket)
- [ ] Places in town (hospital, bank, temple, school, market, post office)
- [ ] Jobs (doctor, teacher, driver, shopkeeper)
- [ ] Feelings (happy, sad, tired, angry, hungry)
- [ ] Common adjectives (big/small, hot/cold, new/old, good/bad)
- [ ] Flashcards with picture (emoji) + audio + Gujarati meaning for every word

### P1.7 Basic Grammar
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] What is a sentence? (subject + verb) — explained with Gujarati comparison
- [ ] Nouns — people, places, things
- [ ] Singular & plural (book → books, box → boxes, child → children)
- [ ] Personal pronouns: I, you, he, she, it, we, they
- [ ] Articles: a / an (a book, an apple) and basic "the"
- [ ] Verb "to be": am / is / are (I am, she is, they are)
- [ ] Negative of "to be" (I am not, he isn't)
- [ ] Questions with "to be" (Are you tired? Is it hot?)
- [ ] This / That / These / Those
- [ ] Possessive adjectives: my, your, his, her, its, our, their
- [ ] Possessive 's (Riya's bag)
- [ ] Have / Has (I have a phone. She has two sons.)
- [ ] There is / There are
- [ ] Simple present tense — positive (I cook. She cooks.)
- [ ] Simple present — negative with do/does (I don't cook. She doesn't cook.)
- [ ] Simple present — questions (Do you cook? Does she cook?)
- [ ] Present continuous — happening now (I am cooking.)
- [ ] Simple present vs present continuous (daily habit vs right now)
- [ ] Basic adjectives and their position (a red saree, not "a saree red")
- [ ] Prepositions of place: in, on, under, near, behind, next to, between
- [ ] Can / can't (ability and permission)
- [ ] Imperatives (Sit down. Open the door. Please come.)
- [ ] Question words: what, where, when, who, why, how, which, how much, how many
- [ ] Object pronouns: me, you, him, her, it, us, them
- [ ] Conjunctions: and, but, or

### P1.8 Sentence Building
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] SVO pattern drill — Gujarati sentence → reorder into English (હું ચા પીઉં છું → I drink tea)
- [ ] Sentence building with word tiles (drag-and-drop)
- [ ] Making positive → negative → question from one sentence
- [ ] Adding details: time (every day), place (at home), adjective (hot tea)
- [ ] Joining two sentences with and / but
- [ ] Describing a picture in 3 sentences
- [ ] Writing 5 sentences about herself

### P1.9 Speaking Basics
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Greetings for morning, afternoon, evening, night
- [ ] Introducing herself (name, city, family, what she likes)
- [ ] Asking and answering "How are you?"
- [ ] Survival phrases (I don't understand. Please speak slowly. Can you repeat? What does this mean?)
- [ ] Asking prices and buying things
- [ ] Asking for and giving simple directions (left, right, straight)
- [ ] Talking about her family
- [ ] Talking about her daily routine
- [ ] Polite requests with "please" and "can I"
- [ ] Practice: repeat-after-me, record & compare, speech recognition check

### P1.10 Listening Basics
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Listen and pick the correct picture
- [ ] Listen to numbers, prices, times
- [ ] Listen to slow, short dialogues (shop, home, phone)
- [ ] Traditional public-domain nursery rhymes (no copyrighted songs)
- [ ] Very slow English videos with Gujarati + English subtitles

### ✅ Phase 1 Final Test
- [ ] Alphabet & phonics test
- [ ] Vocabulary test (picture → word, word → meaning)
- [ ] Grammar test (am/is/are, simple present, pronouns, articles)
- [ ] Reading test (short paragraph + questions)
- [ ] Writing test (5 sentences about herself)
- [ ] Speaking test (self-introduction recorded)
- [ ] Listening test (short dialogue + questions)
- [ ] Phase 1 certificate / badge on the website

---

## 4. Phase 2 — Intermediate (A2 → B1)

**Goal:** Talk about past, present and future; handle real situations alone (doctor, bank, school, phone); read simple stories and messages; write short paragraphs, messages and informal emails. Vocabulary ~2,500 words.

### P2.1 Verbs in Depth
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] What a verb is — action vs state verbs
- [ ] The 3 verb forms (go – went – gone)
- [ ] Regular verbs and the -ed ending
- [ ] Top 100 irregular verbs (in groups: same–same–same, different–same–same, all different)
- [ ] Helping (auxiliary) verbs: be, do, have
- [ ] Main verb vs helping verb
- [ ] Verb + -ing (gerund) basics (I like cooking.)
- [ ] Verb + to (infinitive) basics (I want to learn.)
- [ ] Stative verbs not used in continuous (know, like, want, have-own)
- [ ] Common phrasal verbs — 50 everyday ones (wake up, turn on, look for, give up, pick up)

### P2.2 Tenses (core 8)
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Simple past — positive (I cooked. I went.)
- [ ] Simple past — negative & questions with did
- [ ] Past continuous (I was cooking when he called.)
- [ ] Future with will (I will call you.)
- [ ] Future with going to (I am going to visit my mother.)
- [ ] Present continuous for future plans (I am meeting her tomorrow.)
- [ ] Present perfect (I have finished. Have you eaten?)
- [ ] Present perfect vs simple past (I have seen vs I saw yesterday)
- [ ] Time words for each tense (yesterday, already, yet, just, ever, never, since, for)
- [ ] Tense timeline chart in Gujarati (visual)

### P2.3 Grammar
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Countable vs uncountable nouns
- [ ] Some / any / much / many / a lot of / a few / a little
- [ ] Articles in detail: a/an vs the vs no article
- [ ] Comparatives (bigger, more beautiful, better)
- [ ] Superlatives (biggest, most beautiful, best)
- [ ] Adverbs of manner (slowly, carefully)
- [ ] Adverbs of frequency (always, usually, sometimes, never) and their position
- [ ] Prepositions of time: in, on, at (in May, on Monday, at 5 o'clock)
- [ ] Prepositions of movement: to, into, from, through, across
- [ ] Modal verbs: should, must, have to, may, might, could, would
- [ ] Polite requests with could / would (Could you help me?)
- [ ] Possessive pronouns: mine, yours, his, hers, ours, theirs
- [ ] Reflexive pronouns: myself, yourself, herself
- [ ] Conjunctions: because, so, although, when, if, before, after, while
- [ ] First conditional (If it rains, I will stay home.)
- [ ] Question tags (It's hot, isn't it? You cook, don't you?)
- [ ] Wh-questions in all learned tenses
- [ ] Subject vs object questions (Who called you? / Who did you call?)
- [ ] Too / enough / very
- [ ] Used to (I used to live in a village.)

### P2.4 Spelling Rules
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Plurals: -s, -es, -ies, -ves (cats, boxes, babies, knives)
- [ ] Irregular plurals (man/men, woman/women, foot/feet, tooth/teeth)
- [ ] Adding -ing (make → making, run → running, lie → lying)
- [ ] Adding -ed (stop → stopped, cry → cried, like → liked)
- [ ] Comparative/superlative spelling (big → bigger, happy → happier)
- [ ] Doubling the final consonant rule
- [ ] Dropping silent "e" rule
- [ ] "i before e except after c" and its exceptions
- [ ] Homophones (there/their/they're, to/too/two, your/you're, its/it's)
- [ ] Commonly misspelled words for Indian learners (necessary, Wednesday, receive, separate, February)
- [ ] Weekly spelling test with dictation

### P2.5 Vocabulary (~1,900 new words → total ~2,500)
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Health, doctor, hospital, medicines, symptoms
- [ ] Bank, money, ATM, online payments, UPI
- [ ] Children's school — teacher meetings, homework, notices
- [ ] Travel — railway station, airport, hotel, booking
- [ ] Phone & technology words (charge, download, message, call back)
- [ ] Emotions & personality
- [ ] Work & office basics
- [ ] Festivals, culture & describing Indian traditions in English
- [ ] Synonyms & antonyms
- [ ] Common collocations (make tea, do homework, take a bath, have breakfast)
- [ ] Words that confuse (borrow/lend, say/tell, bring/take, look/see/watch)
- [ ] Personal word bank — she saves new words she meets in daily life

### P2.6 Reading
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Graded readers — Level 1 and 2 short stories
- [ ] Reading messages, WhatsApp texts, notices
- [ ] Reading menus, bills, receipts, timetables
- [ ] Reading school circulars and children's homework instructions
- [ ] Simple news for learners
- [ ] Reading for main idea vs reading for detail
- [ ] Guessing word meaning from context
- [ ] Reading speed practice (timed reading)

### P2.7 Writing
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Writing a paragraph (topic sentence + details + ending)
- [ ] Daily diary — 5 to 8 sentences per day
- [ ] Writing WhatsApp / SMS messages correctly
- [ ] Informal email (to a friend or relative)
- [ ] Writing a leave note / note to children's teacher
- [ ] Describing a person, place, and event
- [ ] Writing about past events (my last holiday)
- [ ] Writing about future plans
- [ ] Punctuation: comma, apostrophe, exclamation mark, quotation marks
- [ ] Self-correction checklist (capital letter? full stop? verb tense? article?)

### P2.8 Speaking
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Talking about the past (what I did yesterday)
- [ ] Talking about plans (what I will do this weekend)
- [ ] At the doctor
- [ ] At the bank
- [ ] Parent–teacher meeting
- [ ] Phone calls — making, receiving, leaving a message
- [ ] Ordering food at a restaurant
- [ ] Shopping, bargaining, returning an item
- [ ] Asking for help from strangers
- [ ] Giving opinions simply (I think…, I like…, I don't agree…)
- [ ] Sentence stress and intonation (rising for questions, falling for statements)
- [ ] Contractions in speech (I'm, don't, can't, won't, it's)
- [ ] Scripted role-play dialogues (an AI conversation partner is a later option, M12)
- [ ] Practice: 2-minute talk on a topic, recorded weekly to hear progress

### P2.9 Listening
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Slow-English podcasts
- [ ] Short videos with English subtitles only
- [ ] Indian English vs British vs American accent exposure
- [ ] Listening for specific information (numbers, names, times)
- [ ] Dictation of full sentences
- [ ] Children's cartoons in English (simple, clear speech)

### ✅ Phase 2 Final Test
- [ ] Grammar & tenses test
- [ ] Spelling & dictation test
- [ ] Vocabulary test
- [ ] Reading test (story + questions)
- [ ] Writing test (one informal email + one paragraph)
- [ ] Speaking test (role-play: doctor or bank + 2-minute talk)
- [ ] Listening test
- [ ] Phase 2 certificate / badge

---

## 5. Phase 3 — Advanced (B2 → C1)

**Goal:** Speak fluently and confidently with anyone, understand native-speed English, read newspapers and books, write formal emails, letters and essays, and use English at work or in interviews.

### P3.1 Complete Tense System (all 12)
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Present perfect continuous (I have been waiting for an hour.)
- [ ] Past perfect (I had eaten before he came.)
- [ ] Past perfect continuous
- [ ] Future continuous (I will be cooking at 7.)
- [ ] Future perfect (I will have finished by Monday.)
- [ ] Future perfect continuous
- [ ] All 12 tenses — comparison chart and mixed practice
- [ ] Choosing the right tense in real conversations

### P3.2 Advanced Grammar
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Passive voice in all common tenses (The food is cooked. The letter was sent.)
- [ ] Reported (indirect) speech — statements, questions, commands
- [ ] Conditionals: zero, first, second, third, mixed
- [ ] Wish / if only / I'd rather
- [ ] Relative clauses: who, which, that, whose, where (defining & non-defining)
- [ ] Modals in the past (should have, could have, must have, might have)
- [ ] Gerund vs infinitive — verbs that change meaning (stop doing / stop to do)
- [ ] Causative: have / get something done (I got my phone repaired.)
- [ ] Articles — advanced and exceptions
- [ ] Linking words for writing (however, therefore, moreover, despite, whereas)
- [ ] Inversion basics (Never have I seen…, Not only… but also)
- [ ] Emphasis (I do like it. What I need is…)
- [ ] Common Indian-English errors — final cleanup list

### P3.3 Advanced Vocabulary (target 5,000+ words)
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Phrasal verbs — 150 more (put up with, come across, look forward to)
- [ ] Idioms & expressions used daily (piece of cake, break the ice, once in a blue moon)
- [ ] Formal vs informal words (buy/purchase, help/assist, ask/enquire)
- [ ] Word formation — prefixes (un-, re-, dis-, mis-) and suffixes (-ful, -less, -ness, -tion)
- [ ] Word families (decide, decision, decisive, decisively)
- [ ] Collocations — advanced (heavy rain, strong tea, make a decision)
- [ ] Topic vocabulary: work, current affairs, environment, health, technology, education, money
- [ ] Polite & diplomatic language (I'm afraid…, Would you mind…, I see your point, but…)

### P3.4 Reading
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Graded readers — Levels 3 to 5
- [ ] Newspaper-style articles (original texts written in the style of Indian and international English news — never copied)
- [ ] Opinion articles — understanding the writer's view
- [ ] Short novels / full books in simple English
- [ ] Official documents: forms, agreements, bank letters, instructions
- [ ] Skimming (fast, main idea) and scanning (find specific information)
- [ ] Making notes and summaries in English while reading

### P3.5 Writing
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Formal email (complaint, request, enquiry)
- [ ] Formal letter format (to bank, society, school principal)
- [ ] Essay writing — introduction, body, conclusion
- [ ] Opinion writing (agree / disagree with reasons)
- [ ] Summary writing
- [ ] Writing a CV / resume and cover letter
- [ ] Social-media posts and reviews
- [ ] Editing own writing: grammar, word choice, linking, tone
- [ ] Weekly long-writing task (200–300 words) with feedback

### P3.6 Speaking & Fluency
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Speaking without translating in the head (think in English drills)
- [ ] Fillers and natural speech (Well…, Actually…, You know…, Let me think…)
- [ ] Discussions and debates — giving and defending opinions
- [ ] Telling stories and personal experiences
- [ ] Explaining a process (how to make dhokla in English)
- [ ] Job interview practice
- [ ] Short presentations (3–5 minutes)
- [ ] Small talk with strangers, neighbours, colleagues
- [ ] Handling disagreements and complaints politely
- [ ] Connected speech — linking, weak forms, reductions (wanna, gonna, gotta — understanding)
- [ ] Clear, neutral accent practice (not removing Indian accent — making it clear)
- [ ] Practice: weekly 5-minute free speaking recording, monthly progress comparison

### P3.7 Listening
- [ ] 🎥 **Videos first:** 1–3 Gujarati tutor videos picked, quality-checked (V.2) and added
- [ ] Native-speed podcasts and interviews
- [ ] News broadcasts (BBC, NDTV English)
- [ ] TV series and movies — first with English subtitles, then without
- [ ] Understanding different accents (Indian, British, American, Australian)
- [ ] Listening to long talks and taking notes
- [ ] Understanding humour, sarcasm and indirect meaning

### ✅ Phase 3 Final Test
- [ ] Full grammar test (all 12 tenses, passive, reported speech, conditionals)
- [ ] Vocabulary & idioms test
- [ ] Reading test (newspaper article + questions)
- [ ] Writing test (formal email + 250-word essay)
- [ ] Speaking test (5-minute interview-style conversation)
- [ ] Listening test (native-speed audio)
- [ ] Phase 3 certificate / "Fluent English" badge
- [ ] Optional: prepare for an official test (IELTS / Cambridge B2) — not built unless the user asks

---

## 6. Daily Habits (all phases)

- [ ] Daily lesson (20–30 min)
- [ ] Daily review of due flashcards (5–10 min)
- [ ] One "Use it today" sentence spoken at home
- [ ] Phase 2+: diary entry in English (5 min)
- [ ] Phase 2+: 10 minutes of English listening (song, video, podcast)
- [ ] Weekly: speaking recording to track progress
- [ ] Weekly: spelling / dictation test
- [ ] Monthly: revision week (no new topics, only review)
- [ ] Family support: one "English-only" 15 minutes at home every day (shown as a tip on the Help page)

---

## 7. Website — Build Specification

### 7.1 Locked technical decisions
Do not change any of these without asking the user first.

| Area | Decision |
|---|---|
| Language | TypeScript with `strict: true`. No `any` unless a comment explains why |
| Build tool | Vite (current stable), React + TypeScript template |
| UI library | React (current stable) |
| Routing | React Router (current stable) used as a library in a plain Vite single-page app (`createBrowserRouter` + `RouterProvider`). **Do not** use React Router "framework mode", Next.js or Remix |
| Styling | Tailwind CSS (current stable; follow the official install guide for Vite for that exact version) |
| State | React Context + `useReducer` for progress. No Redux, Zustand or similar |
| Validation | `zod`. Content and progress schemas are defined once in zod; TypeScript types come from `z.infer` |
| Saved progress | `localStorage`, key `gujeng.progress` (section 7.5) |
| Voice recordings | IndexedDB via `idb-keyval` |
| Fonts | Self-hosted with `@fontsource/noto-sans-gujarati` and `@fontsource/noto-sans` (needed for offline). No Google Fonts `<link>` |
| Icons | `lucide-react` |
| Charts | No chart library. Simple bars with HTML/CSS or inline SVG |
| Audio | Browser `speechSynthesis` (7.7) |
| Speech check | Browser `SpeechRecognition` / `webkitSpeechRecognition` (7.7) |
| Video | YouTube IFrame Player API with host `https://www.youtube-nocookie.com` (7.7) |
| Offline | `vite-plugin-pwa` (milestone M8) |
| Tests | Vitest + React Testing Library (unit/component); Playwright (end-to-end, Chromium, phone viewport 360×800) |
| Lint / format | ESLint (typescript-eslint, react-hooks) + Prettier |
| Node.js | Current LTS (22 or newer) |
| Package manager | npm; commit `package-lock.json` |
| Version control | git: `git init` in M1, commit after every finished step |
| Hosting | Static build (`dist/`). Default: Vercel with an SPA rewrite so deep links work. The user creates the hosting account |
| Backend / login | **None.** Only in M12, and only after the user decides |

Exact package versions = current stable on the day M1 starts. Record them in `package.json`. Never upgrade a major version mid-project without asking.

> M1 note: TypeScript is `~6.0.3`, not 7.x. typescript-eslint 8.72 only supports TypeScript below 6.1, and ESLint with typescript-eslint is a locked decision. Move to TypeScript 7 only after typescript-eslint supports it, and ask the user first.

### 7.2 Folder structure
```
guj-eng/
├── CLAUDE.md                  # rules for the builder (auto-loaded by Claude Code)
├── pending.md                 # this file — source of truth
├── video-review.md            # video candidates waiting for the user's review
├── content/                   # ALL learning content as JSON. No lesson content inside src/
│   ├── phases.json            # 3 phases, 26 topics, recommended lesson order
│   ├── videos.json            # every video, any status
│   ├── vocab/p1.json p2.json p3.json
│   ├── lessons/p1-t01.json …  # one file per topic, holding all lessons of that topic
│   ├── tests/p1-final.json p2-final.json p3-final.json
│   └── outlines/p1.md p2.md p3.md   # lesson outlines approved by the user before writing lessons
├── scripts/validate-content.ts      # npm run validate:content
├── src/
│   ├── main.tsx  App.tsx  router.tsx
│   ├── i18n/gu.ts             # EVERY Gujarati UI string, one typed object
│   ├── schema/content.ts      # zod schemas for content
│   ├── schema/progress.ts     # zod schema for saved progress + migrations
│   ├── lib/                   # pure logic, fully unit-tested: normalize, grading, srs, streak, unlock, minutes, dates, order
│   ├── services/              # browser APIs: storage, tts, speech, recorder, youtube
│   ├── state/                 # ProgressProvider (context + reducer)
│   ├── components/            # UI pieces (En, AudioButton, VideoPlayer, Exercise*, BottomNav, …)
│   └── pages/                 # one file per route (7.8)
├── tests/e2e/                 # Playwright specs
└── public/                    # app icons, manifest images
```

### 7.3 IDs (exact formats — the validator enforces them)
| Thing | Format | Example |
|---|---|---|
| Phase | `p{n}` | `p1` |
| Topic | `p{n}-t{nn}` | `p1-t01` (= P1.1) |
| Lesson | `{topicId}-l{nn}` | `p1-t01-l03` |
| Exercise / item | `{lessonId}-{section}-{nn}`, section ∈ `warmup practice speak write quiz` | `p1-t01-l03-quiz-02` |
| Test item | `{testId}-{sectionId}-{nn}` | `p1-final-reading-04` |
| Word | `w-{english-kebab}`; add `-2`, `-3` for another meaning | `w-apple`, `w-light-2` |
| Video | `v-{11-character YouTube ID}` | `v-XXXXXXXXXXX` |
| Test | `p{n}-final` | `p1-final` |
| Gujarati-speaker problem | `GS-{nn}` | `GS-03` |

Topic map (code ↔ ID ↔ title):

| Code | ID | Title | Code | ID | Title |
|---|---|---|---|---|---|
| P1.1 | p1-t01 | The Alphabet | P2.1 | p2-t01 | Verbs in Depth |
| P1.2 | p1-t02 | Phonics & Basic Pronunciation | P2.2 | p2-t02 | Tenses (core 8) |
| P1.3 | p1-t03 | First Reading | P2.3 | p2-t03 | Grammar |
| P1.4 | p1-t04 | First Writing & Spelling | P2.4 | p2-t04 | Spelling Rules |
| P1.5 | p1-t05 | Numbers, Time & Calendar | P2.5 | p2-t05 | Vocabulary |
| P1.6 | p1-t06 | Core Vocabulary | P2.6 | p2-t06 | Reading |
| P1.7 | p1-t07 | Basic Grammar | P2.7 | p2-t07 | Writing |
| P1.8 | p1-t08 | Sentence Building | P2.8 | p2-t08 | Speaking |
| P1.9 | p1-t09 | Speaking Basics | P2.9 | p2-t09 | Listening |
| P1.10 | p1-t10 | Listening Basics | P3.1 | p3-t01 | Complete Tense System |
| | | | P3.2 | p3-t02 | Advanced Grammar |
| | | | P3.3 | p3-t03 | Advanced Vocabulary |
| | | | P3.4 | p3-t04 | Reading |
| | | | P3.5 | p3-t05 | Writing |
| | | | P3.6 | p3-t06 | Speaking & Fluency |
| | | | P3.7 | p3-t07 | Listening |

### 7.4 Content data (schemas — write these in zod in `src/schema/content.ts`)
```ts
// content/phases.json
type PhasesFile = { phases: Phase[] };
type Phase = {
  id: "p1" | "p2" | "p3";
  order: 1 | 2 | 3;
  titleGu: string; titleEn: string;
  levelCefr: string;              // "A0–A1"
  goalGu: string;
  finalTestId: string;            // "p1-final"
  topics: Topic[];
  recommendedOrder: string[];     // every lessonId of this phase, exactly once (see 7.6)
};
type Topic = {
  id: string; code: string;       // "p1-t01", "P1.1"
  order: number;
  titleGu: string; titleEn: string;
  introGu: string;                // 1–3 sentences: what she will learn
  videoIds: string[];             // topic videos in play order; only "approved" ones are shown
};

// content/lessons/p1-t01.json
type LessonsFile = { topicId: string; lessons: Lesson[] };
type Lesson = {
  id: string; topicId: string; order: number;
  titleGu: string; titleEn: string;
  estimatedMinutes: number;       // 15–35
  videoIds: string[];             // the lesson's OWN videos (topic videos are added automatically to the first lesson)
  explanation: Block[];           // step 3
  examples: Example[];            // step 4 — at least 5
  practice: Exercise[];           // step 5 — 6 to 12
  speak: SpeakItem[];             // step 6 — 3 to 6
  write: WriteTask[];             // step 7 — 1 to 3
  quiz: Exercise[];               // step 8 — exactly 5
  useToday: { en: string; gu: string };  // step 9
  newWordIds: string[];           // words introduced here; each must exist in vocab
  targetsMistakes: string[];      // GS ids drilled in this lesson
  reviewedGu: boolean;            // true ONLY after the user says a native speaker checked the Gujarati
};
type Example = { en: string; gu: string; translit?: string; noteGu?: string };
type Block =
  | { type: "heading"; gu: string }
  | { type: "text"; gu: string }  // English inside Gujarati text is written {{en:word}} and rendered with <En> + tap-to-hear
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "compare"; gu: string; en: string; noteGu?: string }        // Gujarati sentence vs English sentence
  | { type: "mistake"; wrong: string; right: string; whyGu: string; gsId?: string }  // "સામાન્ય ભૂલ" box ❌ / ✅
  | { type: "tip"; gu: string }
  | { type: "example"; en: string; gu: string; translit?: string };

type ExerciseBase = {
  id: string;                     // format in 7.3
  promptGu: string;               // the instruction/question in Gujarati
  explainGu: string;              // WHY the right answer is right (shown after answering)
};
type Exercise = ExerciseBase & (
  | { type: "mcq"; options: string[]; answer: number; promptEn?: string; audio?: string }  // 2–4 options, exactly one correct
  | { type: "trueFalse"; statementEn: string; answer: boolean }
  | { type: "fill"; sentence: string; answers: string[] }       // sentence contains exactly one "___"
  | { type: "order"; tiles: string[]; answers: string[] }       // tiles are shuffled at runtime; answers = full accepted sentences
  | { type: "match"; pairs: { left: string; right: string }[] } // 3–6 pairs
  | { type: "listenChoose"; audio: string; options: string[]; answer: number }
  | { type: "listenType"; audio: string; answers: string[] }
  | { type: "translate"; gu: string; answers: string[] }        // Gujarati → typed English
);
// "audio" = English text spoken by text-to-speech.
// MCQ/listenChoose options may be English or Gujarati, depending on the question.

type SpeakItem = { id: string; en: string; gu: string; translit?: string };
type WriteTask = {
  id: string; kind: "type" | "handwrite"; promptGu: string;
  model?: string;                 // sample answer, shown AFTER she submits
  minWords?: number;              // for "type"
  letters?: string;               // for "handwrite" tracing, e.g. "Aa"
};

// content/vocab/p1.json
type VocabFile = { words: Word[] };
type Word = {
  id: string; en: string; gu: string; translit: string;
  pos: "noun" | "verb" | "adjective" | "adverb" | "pronoun" | "preposition" | "conjunction" | "phrase" | "number" | "other";
  phaseId: string; topicId: string;
  emoji?: string;                 // picture = emoji only. No image files or external image URLs
  exampleEn?: string; exampleGu?: string;
};

// content/videos.json
type VideosFile = { videos: Video[] };
type Video = {
  id: string;                     // "v-" + youtubeId
  youtubeId: string;              // exactly 11 chars [A-Za-z0-9_-], confirmed by oEmbed (V.3)
  titleOriginal: string;          // copied exactly from oEmbed
  channel: string;                // copied exactly from oEmbed (author_name)
  titleGu: string;
  aboutGu: string;                // "what you will learn in this video"
  durationSeconds?: number;
  startSeconds?: number; endSeconds?: number;
  topicIds: string[];
  keyWordIds: string[];           // topic words, must exist in vocab
  checkQuestions: Exercise[];     // 0–3, about the TOPIC (builder cannot watch videos)
  status: "candidate" | "approved" | "rejected";
  foundAt: string;                // YYYY-MM-DD
  reviewedBy?: string; reviewedAt?: string; reviewNote?: string;   // required when approved/rejected
  lastLinkCheck?: string;         // YYYY-MM-DD
};

// content/tests/p1-final.json
type TestFile = {
  id: string; phaseId: string; titleGu: string;
  passPercent: 70;
  sections: {
    id: string;                   // "grammar", "reading", …
    titleGu: string;
    skill: "alphabet" | "vocabulary" | "grammar" | "spelling" | "reading" | "listening" | "writing" | "speaking";
    passageEn?: string;           // for reading sections
    exercises?: Exercise[];       // auto-graded
    write?: WriteTask[];          // self-checked
    speak?: SpeakItem[];          // self-checked (recorded)
  }[];
};
```

### 7.5 Saved progress (schema in `src/schema/progress.ts`)
```ts
type Progress = {
  schemaVersion: 1;
  createdAt: string;                    // ISO date-time
  learnerName: string;                  // "" until she types it on first launch
  lastBackupAt?: string;
  lessons: Record<string, { status: "in_progress" | "completed"; step: number; bestQuiz: number; quizAttempts: number; completedAt?: string }>;
  videos: Record<string, { lastPosition: number; duration: number; watched: boolean; watchedAt?: string }>;
  srs: Record<string, { box: 1 | 2 | 3 | 4 | 5; due: string; right: number; wrong: number }>;   // key = wordId, due = YYYY-MM-DD
  mistakes: { exerciseId: string; lessonId: string; answer: string; at: string }[];         // newest first, max 300
  tests: Record<string, { bestPercent: number; attempts: number; passedAt?: string }>;
  days: Record<string, { lessons: number; reviews: number; tests: number; minutes: number }>; // key = YYYY-MM-DD
  notes: Record<string, string>;                                                            // key = videoId or lessonId
  wordBank: { id: string; en: string; gu: string; note?: string; addedAt: string }[];
  writings: Record<string, { text: string; at: string }[]>;                                 // key = write task id, keep last 5
  recordings: Record<string, { key: string; at: string }[]>;                                // IndexedDB keys, keep last 3 per item
  settings: {
    transliteration: "auto" | "always" | "tap" | "never";   // auto = Phase 1 always, Phase 2 tap, Phase 3 never
    voiceLang: "en-IN" | "en-GB" | "en-US";
    voiceRate: number;                                      // default 0.9
    dailyGoalMinutes: number;                               // default 30
    unlockAll: boolean;                                     // default false
  };
};
```
**Never lose her progress:**
- [x] Load → parse with zod. If parsing fails, **do not overwrite**: copy the raw text to `gujeng.progress.broken.<timestamp>`, show a Gujarati message, offer "download backup", then start fresh only after she confirms.
- [x] Every schema change bumps `schemaVersion` and adds a migration function + unit test. Never remove or rename a field without a migration.
- [x] Save 500 ms after each change and immediately on `visibilitychange` (hidden) and `pagehide`.
- [ ] On first launch call `navigator.storage.persist()`.
- [ ] Settings → "બેકઅપ લો" downloads `gujeng-backup-YYYY-MM-DD.json`; "બેકઅપ પાછું લાવો" imports a file (validate with zod, confirm before overwriting). Dashboard shows a backup reminder if `lastBackupAt` is missing or older than 14 days.
- [x] Never call `localStorage.clear()`.

### 7.6 Learning rules (exact behaviour)
**Recommended order and unlocking**
- [ ] Each phase has `recommendedOrder`: every lesson of the phase exactly once. It **interleaves topics** so she speaks from day one:
  - the first lesson of Phase 1 is a speaking lesson (greetings + "My name is …"), from P1.9;
  - alphabet and phonics lessons (P1.1, P1.2) are spread over the first weeks, alternating with speaking (P1.9), vocabulary (P1.6) and listening (P1.10) lessons;
  - inside one topic, lessons always keep their own order (`l01` before `l02`);
  - a lesson never uses a word or grammar point that comes later in the order (except its own `newWordIds`).
- [x] A lesson is **unlocked** when the lesson before it in `recommendedOrder` is completed. The first lesson of an unlocked phase is unlocked.
- [x] The phase final test unlocks when every lesson of the phase is completed.
- [x] The next phase unlocks when the previous phase's final test is passed.
- [x] `settings.unlockAll = true` unlocks everything (for the user to look around). Label: "બધા પાઠ ખોલો".

**Lessons**
- [x] Step 1 warm-up is generated automatically (no content field): up to 3 flashcards that are due, else up to 3 quiz questions from the previous completed lesson. Skipped when there is nothing to review (e.g. the very first lesson). Not scored.
- [x] The lesson player saves the current step. Reopening the lesson resumes at that step.
- [x] Practice: a wrong answer shows ✖, the correct answer and `explainGu`, saves the mistake, and lets her try again.
- [x] Quiz: 5 questions, no retry inside one attempt. **Lesson completed when the score is ≥ 3 / 5.** Below that: encouraging message, and "quiz again" (options reshuffled) or "read the lesson again".
- [x] Completing a lesson adds each `newWordId` to SRS in box 1, due tomorrow.
- [x] Speaking and writing steps **never block** progress (always an "આગળ વધો" button).

**Spaced repetition (flashcards)**
- [ ] Intervals by box: 1 → 1 day, 2 → 3 days, 3 → 7 days, 4 → 14 days, 5 → 30 days.
- [ ] "મને આવડ્યું" (knew it): box + 1 (max 5), due = today + interval of the new box.
- [ ] "ફરી બતાવો" (show again): box 1; the card is shown again at the end of today's session; due = tomorrow.
- [ ] Max 30 due cards per day, oldest due date first. New words come only from completed lessons.
- [ ] Card front: English word + emoji + audio. Back: Gujarati meaning + transliteration (per setting) + example. Cards in box ≥ 3 are shown the other way round (Gujarati first).

**Days, streak and minutes**
- [ ] Dates are the device's local date as `YYYY-MM-DD`, from one `today()` helper with an injectable clock (for tests).
- [ ] A day is **active** if it has ≥ 1 completed lesson, or ≥ 10 flashcard reviews, or ≥ 1 test attempt.
- [ ] Streak = number of consecutive active days ending today; if today is not active yet, ending yesterday (with a "keep it going today" message).
- [ ] Minutes: completed lesson adds its `estimatedMinutes`; each flashcard review adds 0.2; a watched video adds its duration rounded to whole minutes. Daily goal bar uses this.

**Answer checking (`src/lib/normalize.ts`, `grading.ts`)**
- [x] For typed answers and word tiles: trim, collapse spaces, lower-case, curly quotes/apostrophes → straight, remove a final `.`, `!` or `?`. Then compare with every string in `answers`.
- [x] Content must list **every** acceptable answer (e.g. both "I'm" and "I am"). The code never guesses synonyms.
- [x] If the answer is right but the first letter of a sentence answer is not a capital: mark correct and show the tip "વાક્યની શરૂઆત કૅપિટલ અક્ષરથી કરો".
- [x] Match: correct only when every pair is right; a wrong tap flashes ✖ for 1 second.
- [ ] Test score = auto-graded items only. Pass = score ≥ `passPercent` **and** all self-check sections done.

### 7.7 Browser features (exact behaviour)
**Text-to-speech**
- [x] Voices load asynchronously — wait for `voiceschanged`. Pick the first voice whose language matches `settings.voiceLang` (treat `en-IN` and `en_IN` as the same), else `en-GB`, else `en-US`, else any `en-*`.
- [x] Normal speed = `settings.voiceRate` (default 0.9); slow ("🐢") = 0.6. Cancel any current speech before speaking.
- [x] No English voice found → hide speaker buttons and show one Gujarati notice with how to add an English voice (Android: Settings → Text-to-speech).

**Speech check**
- [ ] Feature-detect `SpeechRecognition || webkitSpeechRecognition`. `lang = settings.voiceLang`, `interimResults = false`, `maxAlternatives = 3`.
- [ ] Score = longest common word sequence between normalized result and target ÷ target word count (best of the alternatives).
- [ ] ≥ 80 %: "ખૂબ સરસ!" · 50–79 %: "સારું! ફરી એક વાર બોલો" · < 50 %: "ફરી પ્રયત્ન કરો".
- [ ] Not supported, or microphone permission denied → Gujarati explanation and "record and compare" mode only. Never block progress.

**Recording**
- [ ] `MediaRecorder`; choose the type with `MediaRecorder.isTypeSupported` (`audio/webm`, else `audio/mp4`). Max 60 s per item, 5 min for the weekly talk.
- [ ] Store in IndexedDB; keep the last 3 per item and every weekly talk. Play back next to the model audio.

**YouTube**
- [x] Load `https://www.youtube.com/iframe_api` once. Create players with `host: "https://www.youtube-nocookie.com"`, `playerVars: { playsinline: 1, rel: 0, start, end }`.
- [x] While playing, save the position every 5 s. **Watched** = `ENDED` event, or position ≥ 90 % of the playable length (`(end ?? duration) − (start ?? 0)`).
- [x] Resume from `lastPosition` unless already watched. Speed buttons 0.75x / 1x via `setPlaybackRate`.
- [x] Offline, or the API has not loaded within 10 s → "વિડિયો જોવા માટે ઇન્ટરનેટ જોઈએ" and the lesson continues.
- [x] Only videos with `status: "approved"` are ever rendered.

### 7.8 Pages and routes
Bottom navigation, always visible, 5 items: **હોમ** `/` · **શીખો** `/learn` · **પુનરાવર્તન** `/review` · **પ્રગતિ** `/progress` · **વધુ** `/more`.

| Route | Page | Contents |
|---|---|---|
| `/` | Dashboard | "નમસ્તે, {name}", big "આજનો પાઠ" button (resume in-progress lesson, else next unlocked lesson in `recommendedOrder`), due flashcards count, streak, today's minutes vs goal, current phase progress bar, backup reminder |
| `/welcome` | First launch | asks her name, explains the site in 3 short Gujarati screens; shown once |
| `/learn` | Learning path | 3 phases → topics with progress; locked items greyed with the reason in Gujarati |
| `/topic/:topicId` | Topic page | `introGu`, approved topic videos, list of its lessons with status |
| `/lesson/:lessonId` | Lesson player | steps 1–9 (section 0), step progress bar, exit saves the step |
| `/review` | Flashcards | today's due cards (7.6) |
| `/practice` | Practice zone | replay exercises from completed lessons by type, mistakes practice, minimal-pair drills, weekly dictation, weekly 2-minute talk |
| `/test/:testId` | Phase final test | sections, then result with score per skill |
| `/progress` | Progress | "this week" summary (lessons, words, minutes, what to revise), last 30 days bars, completion per phase/topic, words learned, test results with phase badges/certificates, weekly talk recordings |
| `/more` | Menu | videos, my words, mistakes, settings, help |
| `/videos` | Video library | approved videos by phase/topic, watched filter |
| `/words` | My words | all learned words + her own saved words, search |
| `/mistakes` | Mistakes notebook | list + "practise these" |
| `/settings` | Settings | name, transliteration, voice, speed, daily goal, unlock all, backup / restore |
| `/help` | Help | how to use the site, how to add an English voice, daily study tips (incl. "15 minutes English-only time with family") |
| `*` | Not found | Gujarati message + home button |

### 7.9 Design rules
- [ ] Mobile first: designed at **360 px** width, works from 320 px to desktop. Content max width 640 px, centred.
- [ ] `<html lang="gu">`. Every piece of English is inside the `<En>` component (`<span lang="en">` + English font). This keeps fonts, text-to-speech and screen readers correct.
- [ ] Fonts: Noto Sans Gujarati for Gujarati, Noto Sans for English. Gujarati body ≥ 18 px, line height 1.6. English learning text ≥ 22 px.
- [ ] Tap targets ≥ 48 × 48 px, at least 8 px apart.
- [ ] Colour tokens as CSS variables: `--primary #C2410C`, `--success #15803D`, `--error #B91C1C`, `--bg #FFFBF5`, `--surface #FFFFFF`, `--text #1F2937`, `--muted #6B7280`. Text contrast ≥ 4.5 : 1. Light theme only.
- [ ] Right/wrong is never shown by colour alone: also ✔ / ✖ and words.
- [ ] Tone is always encouraging. Wrong answer: "ખોટું, પણ વાંધો નહીં! સાચો જવાબ: …" + `explainGu`. Lesson done: "શાબાશ!".
- [ ] No timers or countdowns, no ads, no external links except the YouTube player.
- [ ] Respect `prefers-reduced-motion`. Every icon-only button has a Gujarati `aria-label`.
- [ ] Every page has Gujarati loading, empty and error states.

### 7.10 Gujarati UI text rules and glossary
- [ ] All UI strings live in `src/i18n/gu.ts`. No UI text (Gujarati or English) is typed directly inside components. Lesson content comes only from `content/`.
- [ ] Address the learner with respectful **તમે** and plural verb forms ("તમે શીખ્યા", "તમે પૂરું કર્યું") — this also avoids gender mistakes in Gujarati verbs.
- [ ] Everyday Gujarati. English loanwords that Gujarati speakers already use (મોબાઇલ, વિડિયો, ક્વિઝ) are fine.
- [ ] Use English digits 0–9 everywhere (she must learn them anyway).
- [ ] Use these exact terms:

| English | Gujarati | English | Gujarati |
|---|---|---|---|
| Home | હોમ | Next | આગળ |
| Learn | શીખો | Back | પાછળ |
| Review | પુનરાવર્તન | Check | તપાસો |
| Progress | પ્રગતિ | Continue | ચાલુ રાખો |
| More | વધુ | Start | શરૂ કરો |
| Phase | તબક્કો | Move on | આગળ વધો |
| Topic | વિષય | Listen | સાંભળો |
| Lesson | પાઠ | Listen slowly | ધીમે સાંભળો |
| Today's lesson | આજનો પાઠ | Speak | બોલો |
| Video | વિડિયો | Write | લખો |
| Practice | અભ્યાસ | Record | રેકોર્ડ કરો |
| Quiz | ક્વિઝ | Correct! | સાચું! |
| Final test | પરીક્ષા | Wrong | ખોટું |
| Words | શબ્દો | Try again | ફરી પ્રયત્ન કરો |
| My words | મારા શબ્દો | Well done! | શાબાશ! |
| Mistakes | ભૂલો | Completed | પૂર્ણ |
| Notes | નોંધ | Locked | લૉક |
| Settings | સેટિંગ્સ | Watched | જોયેલું |
| Help | મદદ | Streak | સળંગ દિવસ |
| Backup | બેકઅપ | I knew it | મને આવડ્યું |
| Common mistake | સામાન્ય ભૂલ | Show again | ફરી બતાવો |

### 7.11 Content writing guide (the builder writes as a teacher with 25+ years of experience)
**Process**
- [ ] Before writing any lessons of a phase, write `content/outlines/p{n}.md`: every lesson in `recommendedOrder` with ID, title, the one idea it teaches, its new words, and the GS ids it covers. **The user approves the outline before lesson writing starts.**
- [ ] Write lessons in `recommendedOrder`. After every 5 lessons: run the quality gates, commit, give the user a short report.

**English**
- [ ] 100 % correct, natural, modern standard English. **British spelling** (colour, centre, practise as a verb), as used in Indian schools.
- [ ] Indian context: Gujarati names (Hetal, Ravi, Meena …), Indian food, places, ₹, lakh/crore alongside million.
- [ ] None of the GS mistakes from section 1 may appear anywhere, except inside a ❌ "wrong" example.
- [ ] Proofread every English sentence twice before saving.
- [ ] All reading passages, dialogues and stories are **original** text written for this site. Never copy articles, books, video transcripts or song lyrics. Songs/rhymes: only traditional public-domain nursery rhymes.

**Gujarati**
- [ ] Short sentences, everyday words, respectful તમે. Explain *why*, not only *what*. Compare with the Gujarati sentence structure when it helps.
- [ ] `reviewedGu` stays `false`. It becomes `true` only when the user says in chat that a native speaker checked that lesson.

**Lesson shape**
- [ ] One new idea per lesson. New words per lesson: Phase 1 ≤ 8, Phase 2 ≤ 12, Phase 3 ≤ 15.
- [ ] Each concept: explanation → at least 5 examples → a "સામાન્ય ભૂલ" box when a GS problem applies.
- [ ] Every exercise has an `explainGu` that says *why* the answer is right.
- [ ] MCQ: exactly one correct option; wrong options are believable but clearly wrong; no trick questions.
- [ ] Use only words and grammar already taught earlier in `recommendedOrder`, plus this lesson's new words.
- [ ] Real life: her kitchen, family, market, children's school, doctor, phone, travel. Family-friendly; avoid religious and political topics.

**Transliteration (a help only — the audio is the reference)**

| Sound | Write with | Examples |
|---|---|---|
| a as in *cat* (æ) | ઍ / ૅ | apple → ઍપલ, cat → કૅટ |
| o as in *hot* (ɒ) | ઑ / ૉ | hot → હૉટ, doctor → ડૉક્ટર |
| w | વ | water → વૉટર, one → વન (audio shows the rounded lips) |
| z | ઝ | zoo → ઝૂ (never જૂ) |
| f | ફ | fish → ફિશ |
| th in *think* (θ) | થ | think → થિંક |
| th in *this* (ð) | ધ | this → ધિસ, the → ધ |
| s + consonant at the start | no extra vowel | school → સ્કૂલ (never ઇસ્કૂલ), station → સ્ટેશન |
| short vs long i | િ / ી | ship → શિપ, sheep → શીપ |
| short vs long u | ુ / ૂ | book → બુક, food → ફૂડ |

### 7.12 Quality gates
There are two levels. The **step gate** is quick and runs after every step. The **milestone gate** is the full check and runs at the end of each milestone.

**Step gate** (after every step, a few minutes):
- `npm run typecheck` and `npm run lint` pass with zero errors and zero warnings.
- `npx vitest run --changed` passes (tests related to the changed files), plus any test files written in this step.
- If `content/` or a schema changed: `npm run validate:content` passes.
- If this step added or changed an e2e spec: run only that spec (`npx playwright test <file>`).
- If the UI changed: one quick look at the changed page in the browser preview at 360 × 800, console clean.
- Then commit. Do **not** run the full `npm run check` or the full e2e suite at every step.

**Milestone gate** (end of each milestone — everything below must pass):
- [ ] `npm run check` = `typecheck` + `lint` + `test` + `validate:content` + `build`, all passing with **zero** errors and zero warnings.
- [ ] `npm run e2e` passing.
- [ ] Open the app in the browser preview at 360 × 800, click through every page changed in this step, and confirm the browser console has no errors or warnings.
- [ ] Unit tests for every function in `src/lib/`, including edge cases: month and year boundaries for dates, empty progress, corrupted progress, every exercise type right and wrong, unlock rules, SRS box changes, streak gaps.
- [x] **Content validator errors** (fail the build): schema; ID formats (7.3); all IDs unique across all files; every reference exists (`videoIds`, `newWordIds`, `keyWordIds`, `topicIds`, `targetsMistakes`, `finalTestId`); `recommendedOrder` holds every lesson of its phase exactly once and keeps each topic's lesson order; counts (examples ≥ 5, practice 6–12, speak 3–6, write 1–3, quiz exactly 5, MCQ 2–4 options with a valid answer index, match 3–6 pairs); `fill` sentence has exactly one `___`; for `order`, the tiles joined with spaces equal one accepted answer after normalization; no empty strings; every `gu` and `*Gu` field contains Gujarati letters (U+0A80–U+0AFF); English fields (`en`, `titleEn`, `statementEn`, `promptEn`, `audio`, `answers`, `tiles`, `sentence`, `model`, `passageEn`, `exampleEn`) contain no Gujarati letters; `youtubeId` matches `^[A-Za-z0-9_-]{11}$`; approved/rejected videos have `reviewedBy` and `reviewedAt`.
- [x] **Content validator warnings** (printed, do not fail): lessons with `reviewedGu: false`; topics with no approved video; GS ids not yet covered; vocab words not used in any lesson.
- [x] The validator has its own tests: one broken fixture per error rule, each proven to fail.
- [ ] End-to-end minimum: fresh start → welcome → dashboard → today's lesson → complete every step → lesson shows completed → reload → still completed; flashcard review; backup export then import round-trip; video step with no approved video shows the placeholder.
- [ ] No `console.log`, no commented-out code, no `TODO` without a matching unticked item in this file.

### 7.13 Milestones and steps (in order — stop after each milestone and wait for the user)
**M1 — Project setup and app shell**
- [x] `git init`, `.gitignore`, Vite + React + TypeScript, Tailwind, ESLint, Prettier, Vitest, Playwright, self-hosted fonts
- [x] `src/i18n/gu.ts` with the glossary (7.10); `<En>` component; colour tokens (7.9)
- [x] All routes from 7.8 as placeholder pages with their Gujarati title; bottom navigation; not-found page
- [x] npm scripts: `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `e2e`, `validate:content` (placeholder that passes), `check`
- [x] Fill in the "Commands" section of `CLAUDE.md`
- Accept when: quality gates pass; every route shows its Gujarati title at 360 px; no English UI text visible; no console errors.

**M2 — Content system**
- [x] zod schemas (7.4), content loader (`import.meta.glob` over `content/`), full validator (7.12) with its fixture tests
- [x] `content/phases.json` with 3 phases and all 26 topics (Gujarati titles and intros); empty `videos.json`; `video-review.md` template
- [x] One complete sample lesson `p1-t01-l01` (+ its vocab), following every rule in 7.11; `recommendedOrder` for now = this one lesson
- [x] Learning path and topic pages render from content
- Accept when: validator passes on real content and fails on every broken fixture; `/learn` shows all 26 topics.

#### How steps work (M3 onwards)
- Each milestone is split into **steps** (`M3.1`, `M3.2`, …). One step ≈ 10–20 minutes of work.
- Do the steps **in order**, one at a time. For each step: build only that step → run the **step gate** (7.12) → tick its box → commit with a message starting with the step number (e.g. `M3.4: Lesson player frame with step bar and resume`) → write a one-line progress note → go straight on to the next step. **Do not wait for the user between steps**, except at steps marked 🛑.
- At the **end of each milestone**: run the full **milestone gate** (7.12), report (7.15), and wait for the user's go-ahead.
- If a step grows past ~30 minutes, it is too big: commit the part that passes the step gate, add the rest as a new step right after it (e.g. `M3.4b`) in this file, and continue.
- A step is not done if its gate fails. Never commit failing code to move on.

**M3 — Lesson player**
- [ ] **M3.1 Answer checking** — `src/lib/normalize.ts` + `grading.ts` for all 8 exercise types and the capital-letter tip (7.6). Unit tests: each type right and wrong, every normalization rule.
- [ ] **M3.2 Saved progress** — progress zod schema (7.5), storage service (load, zod parse, keep broken copy, 500 ms debounced save, save on `visibilitychange`/`pagehide`), `ProgressProvider` + reducer, `BrokenProgress` screen. Unit tests incl. empty and corrupted data.
- [ ] **M3.3 Unlocking** — `src/lib/dates.ts` (`today()` with injectable clock) and `unlock.ts` (recommended order, phase test, next phase, `unlockAll`). Learn and topic pages show locked/unlocked/completed from progress. Unit tests.
- [ ] **M3.4 Lesson player frame** — `/lesson/:lessonId`: which steps a lesson has (`lessonSteps.ts`: warm-up rule, video step only when it applies), step progress bar, next/back, save and resume the current step, exit, guard for locked or unknown lessons.
- [ ] **M3.5 Explanation and examples steps** — renderer for every `Block` type, `{{en:…}}` markup, examples list, transliteration per setting (`auto` by phase).
- [ ] **M3.6 Text-to-speech** — tts service (voice choice, `voiceschanged`, normal/slow rate, cancel) and `AudioButton`; no-English-voice notice. Unit tests with a mocked `speechSynthesis`.
- [ ] **M3.7 Exercises, part 1** — `mcq`, `trueFalse`, `fill`, `translate` + shared feedback (✔/✖, correct answer, `explainGu`, retry in practice, mistake saved). Component tests.
- [ ] **M3.8 Exercises, part 2** — `order` (word tiles), `match`, `listenChoose`, `listenType`. Component tests.
- [ ] **M3.9 Practice, quiz and finish** — practice step, quiz step (5 questions, no retry, score, ≥ 3/5 completes, fail path), "use it today" step, "શાબાશ!" finish screen. On completion: lesson status, new words into SRS box 1 due tomorrow, day stats and minutes.
- [ ] **M3.10 Video step** — youtube service (load API once, 10 s timeout, offline detection) and `VideoPlayer` (nocookie host, `playsinline`, start/end, save position every 5 s, watched at 90 %, resume, 0.75x/1x). Approved-only filter, placeholder, offline message, notes box, "words from this video", quick-check questions. Topic page shows topic videos. Tests with a mocked `YT`.
- [ ] **M3.11 Speak and write steps (simple version)** — show speak items with `AudioButton` and write tasks with a text box, both with "આગળ વધો" (full recording and handwriting come in M5).
- [ ] **M3.12 Milestone check** — e2e: full sample-lesson flow, reload keeps progress, zero approved videos, network off. Full milestone gate, report, wait.

**M4 — Progress and daily habits**
- [ ] **M4.1 Days, streak, minutes** — logic per 7.6 with unit tests (month/year boundaries, gaps, today not active yet).
- [ ] **M4.2 Spaced repetition** — `srs.ts` per 7.6 with unit tests (box up/down, due dates, 30-card cap, oldest first).
- [ ] **M4.3 Flashcards page** — `/review`: front/back, reversed cards from box 3, "ફરી બતાવો" re-queue, empty state.
- [ ] **M4.4 Welcome flow** — `/welcome` (name + 3 short screens, shown once), first-launch redirect, `navigator.storage.persist()`.
- [ ] **M4.5 Dashboard** — greeting, "આજનો પાઠ" button, due cards, streak, minutes vs goal, phase progress bar, backup reminder.
- [ ] **M4.6 Settings** — every field in 7.5 `settings` plus name; "બધા પાઠ ખોલો".
- [ ] **M4.7 Backup** — export/import (zod check, confirm before overwrite, `lastBackupAt`). e2e round-trip.
- [ ] **M4.8 Mistakes and my words** — `/mistakes` with "practise these"; `/words` with learned words, own words (add/delete) and search.
- [ ] **M4.9 Progress page** — "this week" summary, 30-day bars, completion per phase/topic, words learned, test results area.
- [ ] **M4.10 Milestone check** — full milestone gate, report, wait.

**M5 — Speaking and writing**
- [ ] **M5.1 Recorder** — recorder service (`MediaRecorder` type choice, 60 s / 5 min limits), IndexedDB storage, clean-up rules. Unit tests with mocks.
- [ ] **M5.2 Speech check** — speech service (feature detection, best of 3 alternatives, word-sequence score, 80/50 thresholds, permission denied). Unit tests.
- [ ] **M5.3 Speak step (full)** — listen, record, play back next to model audio, speech check result, fallbacks; never blocks.
- [ ] **M5.4 Write step: typing** — min words, save last 5 writings, model answer after submit, self-check list.
- [ ] **M5.5 Write step: handwriting** — tracing canvas with dotted letter guide, pointer events, clear button, self-marked.
- [ ] **M5.6 Milestone check** — test mic denied and no speech recognition; full milestone gate, report, wait.

**M6 — Phase 1 content, part 1**
- [ ] **M6.1 Phase 1 outline** — write `content/outlines/p1.md` (7.11): every Phase 1 lesson in recommended order with ID, title, the one idea, new words, GS ids. 🛑 **Stop: the user approves the outline before any lesson is written.**
- [ ] **M6.2 Video candidates P1.1–P1.5** — search, confirm with oEmbed, add as `candidate`, list in `video-review.md` (V.3).
- [ ] **M6.3 Video candidates P1.6–P1.10** — same. Then tell the user `video-review.md` is ready. (Lesson writing continues while the user reviews; do not wait.)
- [ ] **M6.4 … M6.n Lesson batches** — 3 lessons per step, in recommended order, with their vocab, until the first half of Phase 1 is written. Add one checkbox per batch here when the outline is approved (e.g. `M6.4 Lessons 1–3`). Each batch: validator passes, English proofread twice, commit.
- [ ] **M6.x Video decisions** — when the user has answered, set `approved`/`rejected` with review details. Tick 🎥 lines only for approved videos.
- [ ] **M6.last Milestone check** — full milestone gate, report, wait.

**M7 — Phase 1 content, part 2**
- [ ] **M7.1 … M7.n Lesson batches** — 3 lessons per step for the rest of Phase 1 (add one checkbox per batch, as in M6).
- [ ] **M7.a Final test content** — `content/tests/p1-final.json` covering every skill in the Phase 1 final test list.
- [ ] **M7.b Test page** — `/test/:testId`: sections, auto-graded score, self-check sections (writing, recorded speaking), result per skill, pass rule (7.6).
- [ ] **M7.c Certificate** — Gujarati certificate/badge screen when a final test is passed; also shown on `/progress`.
- [ ] **M7.d Practice zone: replay** — `/practice` replay of exercises from completed lessons, by type.
- [ ] **M7.e Practice zone: drills** — minimal-pair drills (from GS lessons) and weekly dictation.
- [ ] **M7.f Weekly talk** — 2-minute weekly talk recording in `/practice`, listed on `/progress`.
- [ ] **M7.g Milestone check** — all Phase 1 curriculum boxes and Phase 1 GS ids covered; full milestone gate, report, wait.

**M8 — Ready for her to use**
- [ ] **M8.1 Video library** — `/videos`: approved videos by phase/topic, watched filter.
- [ ] **M8.2 Help page** — how to use the site, how to add an English voice, daily study tips (incl. the family English-time tip).
- [ ] **M8.3 Offline app (PWA)** — `vite-plugin-pwa`, manifest, icons, installable, written lessons offline, video offline message. e2e offline test.
- [ ] **M8.4 Polish at phone sizes** — every page at 320 and 360 px: spacing, wrapping, tap targets, loading/empty/error states.
- [ ] **M8.5 Polish at tablet size + accessibility** — every page at 768 px; aria-labels, contrast, keyboard use, reduced motion.
- [ ] **M8.6 Deploy setup** — `vercel.json` with SPA rewrite and a short `DEPLOY.md` for the user.
- [ ] **M8.7 Milestone check** — full milestone gate, report, wait. After this she can start Phase 1.

**M9 — Phase 2**: outline (🛑 user approves) → video candidates → lesson batches of 3 → `p2-final`. Use the same small-step pattern as M6/M7; write the step list here when M9 starts.
**M10 — Phase 3**: same pattern as M9, for Phase 3 and `p3-final`.
**M11 — Full review**: re-run oEmbed link check on all videos; confirm all GS ids covered; fix issues the user reports from her real use.
**M12 — Only if the user decides** (section 8): login + cloud sync, AI conversation partner, our own recorded videos.

### 7.14 Out of scope (do not build unless the user asks)
Login/accounts/backend, payments, ads, analytics or tracking, push notifications, social sharing, more than one learner per device, dark mode, native app, English-language UI, AI features, extra libraries not listed in 7.1.

### 7.15 Reporting
- **After each step:** one line — step number, what now works, step gate passed. Then continue.
- **After each milestone:** what was built (short list), milestone-gate results, anything skipped or not working, decisions that need the user, what the next milestone will do. Tick the checkboxes in this file per the checkbox rules, commit, then **wait**.

---

## 8. Open Questions (with the default to use until the user answers)

| # | Question | Default until answered | Affects |
|---|---|---|---|
| 1 | Phone only, or also laptop/tablet? | Phone (Android Chrome) first; also works on laptop | design |
| 2 | Sync progress across devices (needs login)? | No login; backup file export/import | M12 |
| 3 | Accent for audio? | Indian English voice (`en-IN`), then British; British spelling | 7.7, 7.11 |
| 4 | Any goal or deadline (job, travel, children's school, interview)? | General daily-life fluency | content |
| 5 | More than one learner (other family members)? | One learner per device | 7.14 |
| 6 | Videos: only existing YouTube videos, or also record our own? | Existing YouTube videos only; own videos later (M12) | V.3 |
| 7 | Favourite Gujarati English tutors/channels she already likes? | None; builder searches, user approves | V.3 |
| 8 | Lock the written lesson until videos are watched? | Never locked; videos shown first with a hint | V.1 |
| 9 | Hosting? | Vercel free plan; user creates the account | M8 |
| 10 | Who checks the Gujarati text and approves videos? | The user (and the learner) | 7.11, V.3 |
