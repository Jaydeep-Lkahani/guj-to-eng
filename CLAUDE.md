# CLAUDE.md — Learn English from Gujarati

A website that teaches English to an adult Gujarati speaker who is a complete beginner (the user's wife). The whole site (menus, explanations, feedback) is in Gujarati; only the English being taught is in English.

**`pending.md` is the source of truth**: curriculum (sections 0–6), build specification (section 7), open decisions with defaults (section 8). This file only holds the rules that must never be broken.

## At the start of every session
1. Read `pending.md` completely.
2. Find the current milestone in `pending.md` section 7.13 (the first one with unticked items). Work only on that milestone.
3. If the user asks for something that conflicts with `pending.md`, point out the conflict and ask which wins. Then update `pending.md` so it stays true.

## Rules that must never be broken
1. **Gujarati UI.** Every UI string comes from `src/i18n/gu.ts`. No UI text typed directly in components. Every English text is wrapped in the `<En>` component. Use the glossary in 7.10. Address the learner with respectful "તમે" and plural verb forms.
2. **Never invent YouTube video IDs.** Follow `pending.md` V.3 exactly: confirm every video with oEmbed, add it as `candidate`, and let the user approve it. Only `approved` videos are shown.
3. **Only the user approves.** Never set a video to `approved`/`rejected` or a lesson to `reviewedGu: true` unless the user said so in chat for that item.
4. **English must be 100 % correct.** Standard British spelling. Proofread every sentence twice. None of the GS mistakes (section 1) may appear, except as a ❌ wrong example.
5. **Original content only.** Never copy articles, books, transcripts or song lyrics. Traditional public-domain nursery rhymes are fine.
6. **Never lose the learner's progress.** Follow 7.5. No schema change without a version bump, a migration and a test. Never clear storage. Never overwrite data that failed to parse.
7. **Stick to the plan.** Use only the decisions in 7.1, stay inside the scope in 7.14, and follow the exact rules in 7.6 and 7.7. Ask before adding a library, page or feature.
8. **When unsure, stop and ask.** Do not guess when the spec is unclear or contradicts itself.
9. **Content lives in `content/` only.** It must pass `npm run validate:content`.
10. **Done means checked.** After every step, run the quick **step gate** in 7.12. At the end of every milestone, run the full **milestone gate** in 7.12 and click through the changed pages in the browser preview at 360 × 800 with no console errors. Never commit failing code. Report failures honestly.
11. **Small steps, one milestone at a time.** Work through the numbered steps in 7.13 (10–20 minutes each). After each step: step gate, tick its box, commit (`M3.4: …`), one-line note, then continue without waiting (except at 🛑 steps). After each milestone: milestone gate, report (7.15), then wait for the user's go-ahead.
12. **Lesson outlines first.** Before writing a phase's lessons, write `content/outlines/p{n}.md` and get the user's approval.

## Commands
Node 22.18 or newer (type stripping is used to run `scripts/*.ts`). First time on a machine: `npm install`, then `npx playwright install chromium`.
- `npm run dev` — start the dev server (http://localhost:5173)
- `npm run build` — typecheck, then build to `dist/`
- `npm run preview` — serve the built `dist/`
- `npm run typecheck` — `tsc -b` (strict)
- `npm run lint` — ESLint with zero warnings allowed, then Prettier `--check`. It also fails on text typed inside JSX in `src/components`, `src/pages` and `src/App.tsx` (rule 1)
- `npm run format` — Prettier `--write`
- `npm run test` — Vitest unit and component tests (`src/**/*.test.ts(x)`, `scripts/*.test.ts`, `tests/unit`)
- `npm run validate:content` — check all JSON in `content/` (errors fail; warnings are only printed). Rules live in `src/lib/validateContent.ts`; every error rule has a broken fixture in its test
- `npm run check` — typecheck + lint + test + validate:content + build (must pass, zero warnings)
- `npm run e2e` — Playwright end-to-end tests at 360 × 800; builds the site and serves it on port 4173 itself. Any browser console error or warning fails a test
