// Makes the "Listen" audio: one MP3 per English sentence, read by Microsoft's free neural voice
// (the "edge-tts" tool), so every phone plays the same clear pronunciation. No key or account needed.
//
// One-time setup:  pip install edge-tts   (or set EDGE_TTS to the full path of the edge-tts program)
//
//   npm run audio                          make audio for every sentence that doesn't have it yet
//   npm run audio -- --try "How are you?"  one sample per voice in audio-samples/, to pick a voice
//   npm run audio -- --check               only list sentences that have no audio yet
//
// Files go to public/audio/, and src/audio-manifest.json says which sentence is in which file.
// Changing VOICE below makes everything again with the new voice (old files are removed).
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { createServer } from "vite";

const run = promisify(execFile);
const EDGE_TTS = process.env.EDGE_TTS || "edge-tts";

// A little slower than normal so a beginner hears every word.
const VOICE = { voice: "en-IN-NeerjaNeural", rate: "-10%" };
const SAMPLE_VOICES = ["en-IN-NeerjaNeural", "en-IN-PrabhatNeural"];
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

// Writes the recording to a temporary name first, so a failed run never leaves a half-made file.
async function synthesize(text, out, voice = VOICE) {
  const tmp = out + ".part";
  for (let attempt = 1; ; attempt++) {
    try {
      // "--text=..." form, so a sentence starting with "-" is not read as an option.
      await run(EDGE_TTS, [`--voice=${voice.voice}`, `--rate=${voice.rate}`, `--text=${text}`, `--write-media=${tmp}`]);
      renameSync(tmp, out);
      return;
    } catch (err) {
      rmSync(tmp, { force: true });
      if (err.code === "ENOENT") needTool();
      if (attempt >= 4) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

function needTool() {
  console.error("Can't run edge-tts. Install it with:\n  pip install edge-tts\nor set EDGE_TTS to the full path of the edge-tts program.");
  process.exit(1);
}

// --try "text": the same sentence in several voices, to listen and choose.
async function makeSamples(text) {
  const dir = join(root, "audio-samples");
  mkdirSync(dir, { recursive: true });
  for (const voice of SAMPLE_VOICES) {
    const out = join(dir, `${voice}.mp3`);
    await synthesize(text, out, { ...VOICE, voice });
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
  mkdirSync(audioDir, { recursive: true });
  const failed = [];
  let done = 0;
  const queue = [...missing];
  await Promise.all(
    Array.from({ length: AT_ONCE }, async () => {
      for (let text = queue.shift(); text !== undefined; text = queue.shift()) {
        try {
          await synthesize(text, join(audioDir, fileName(text)));
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
  const voiceLabel = `edge-tts / ${VOICE.voice}`;
  writeFileSync(manifestPath, JSON.stringify({ voice: voiceLabel, files }, null, 2) + "\n");

  console.log(`Audio ready for ${Object.keys(files).length} of ${texts.length} sentences.`);
  if (removed) console.log(`Removed ${removed} old file(s).`);
  if (failed.length) {
    console.error(`${failed.length} failed. Run "npm run audio" again to retry them.`);
    process.exitCode = 1;
  }
}

await main();
