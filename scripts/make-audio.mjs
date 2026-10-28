// Makes the "Listen" audio: one MP3 per English sentence, read by OpenAI's natural-sounding voice,
// so every phone plays the same clear pronunciation.
//
// Needs an OpenAI API key in .env.local (this file is never committed):
//   OPENAI_API_KEY=sk-...
//
//   npm run audio                          make audio for every sentence that doesn't have it yet
//   npm run audio -- --try "How are you?"  one sample per voice in audio-samples/, to pick a voice
//   npm run audio -- --check               only list sentences that have no audio yet
//
// Files go to public/audio/, and src/audio-manifest.json says which sentence is in which file.
// Changing VOICE below makes everything again with the new voice (old files are removed).
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const VOICE = {
  model: "gpt-4o-mini-tts",
  voice: "coral",
  instructions:
    "You are a patient English teacher reading aloud to a beginner who is learning English. " +
    "Speak clearly and a little slower than normal conversation, with natural, standard English pronunciation. " +
    "Say every word fully and don't swallow any sounds. Use a warm, calm tone. " +
    "Read exactly the given text, nothing more.",
};
const SAMPLE_VOICES = ["coral", "sage", "nova", "shimmer", "alloy", "ash", "ballad", "echo"];
const AT_ONCE = 4;

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const audioDir = join(root, "public", "audio");
const manifestPath = join(root, "src", "audio-manifest.json");
const args = process.argv.slice(2);

// Load the sentence list through Vite, the same way the site loads its content.
async function loadTexts() {
  const vite = await createServer({
    root,
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true, hmr: false },
  });
  try {
    const mod = await vite.ssrLoadModule("/src/spoken-texts.ts");
    return mod.spokenTexts();
  } finally {
    await vite.close();
  }
}

function fileName(text) {
  const hash = createHash("sha1").update(JSON.stringify(VOICE)).update("\n").update(text).digest("hex");
  return hash.slice(0, 12) + ".mp3";
}

async function synthesize(text, voice = VOICE) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...voice, input: text, response_format: "mp3" }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const retry = res.status === 429 || res.status >= 500;
    if (!retry || attempt >= 4) {
      throw new Error(`OpenAI said ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
}

function needKey() {
  if (process.env.OPENAI_API_KEY) return;
  console.error("No OPENAI_API_KEY found. Put this line in .env.local in the project folder:\n  OPENAI_API_KEY=sk-...");
  process.exit(1);
}

// --try "text": the same sentence in several voices, to listen and choose.
async function makeSamples(text) {
  needKey();
  const dir = join(root, "audio-samples");
  mkdirSync(dir, { recursive: true });
  for (const voice of SAMPLE_VOICES) {
    const out = join(dir, `${voice}.mp3`);
    writeFileSync(out, await synthesize(text, { ...VOICE, voice }));
    console.log(`  ${out}`);
  }
  console.log(`\nListen to them, then set "voice" in scripts/make-audio.mjs to the one you like.`);
}

async function main() {
  const tryIndex = args.indexOf("--try");
  if (tryIndex !== -1) return makeSamples(args[tryIndex + 1] ?? "How are you?");

  const texts = await loadTexts();
  const missing = texts.filter((t) => !existsSync(join(audioDir, fileName(t))));
  const chars = missing.reduce((n, t) => n + t.length, 0);
  console.log(`${texts.length} sentences; ${missing.length} need audio (${chars} characters).`);

  if (args.includes("--check")) {
    missing.forEach((t) => console.log(`  ${t}`));
    return;
  }
  if (missing.length) needKey();

  mkdirSync(audioDir, { recursive: true });
  const failed = [];
  let done = 0;
  const queue = [...missing];
  await Promise.all(
    Array.from({ length: AT_ONCE }, async () => {
      for (let text = queue.shift(); text !== undefined; text = queue.shift()) {
        try {
          writeFileSync(join(audioDir, fileName(text)), await synthesize(text));
        } catch (err) {
          failed.push(text);
          console.error(`\n  Failed: "${text}": ${err.message}`);
        }
        done++;
        process.stdout.write(`\r  ${done}/${missing.length}`);
      }
    }),
  );
  if (missing.length) process.stdout.write("\n");

  // Write the list of what has audio, and remove files no sentence uses any more.
  const files = {};
  for (const text of texts) {
    const name = fileName(text);
    if (existsSync(join(audioDir, name))) files[text] = name;
  }
  const used = new Set(Object.values(files));
  let removed = 0;
  for (const name of readdirSync(audioDir)) {
    if (name.endsWith(".mp3") && !used.has(name)) {
      rmSync(join(audioDir, name));
      removed++;
    }
  }
  const voiceLabel = `${VOICE.model} / ${VOICE.voice}`;
  writeFileSync(manifestPath, JSON.stringify({ voice: voiceLabel, files }, null, 2) + "\n");

  console.log(`Audio ready for ${Object.keys(files).length} of ${texts.length} sentences.`);
  if (removed) console.log(`Removed ${removed} old file(s).`);
  if (failed.length) {
    console.error(`${failed.length} failed. Run "npm run audio" again to retry them.`);
    process.exitCode = 1;
  }
}

await main();
