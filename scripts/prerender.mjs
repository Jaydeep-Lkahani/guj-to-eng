// Runs after `vite build`. Writes one HTML file per page with the full page content and
// its search tags already inside, so search engines can read every lesson.
// Also writes sitemap.xml and 404.html.
//   /                -> dist/index.html
//   /part/p1         -> dist/part/p1.html     (Vercel "cleanUrls" serves it without .html)
//   /topic/p1-t01    -> dist/topic/p1-t01.html
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

const server = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);
const template = readFileSync(join(dist, "index.html"), "utf8");

if (!template.includes("<!--seo-head-->") || !template.includes("<!--app-html-->")) {
  throw new Error("index.html is missing the <!--seo-head--> or <!--app-html--> marker.");
}

function esc(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function page(path, renderPath = path) {
  const meta = server.pageMeta(path);
  const body = server.render(renderPath);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace("<!--seo-head-->", server.headTags(meta))
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-path="${path}">${body}</div>`);
}

function fileFor(path) {
  return path === "/" ? join(dist, "index.html") : join(dist, `${path.slice(1)}.html`);
}

const paths = server.allPaths();
for (const path of paths) {
  const file = fileFor(path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(path));
}

// Vercel (and most static hosts) show 404.html for unknown addresses.
writeFileSync(join(dist, "404.html"), page("/404", "/404"));

// The date a page last changed, from git. Falls back to today when git history is missing
// (for example a shallow clone on the build server).
function lastChanged(files) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (out) return out;
  } catch {
    // no git here
  }
  return new Date().toISOString().slice(0, 10);
}

const contentFiles = ["content"];
const entries = server.indexablePaths().map((path) => {
  const [, kind, id] = path.split("/");
  const files = kind === "topic" ? [`content/lessons/${id}.json`] : contentFiles;
  const priority = path === "/" ? "1.0" : kind === "part" ? "0.8" : "0.7";
  return `  <url>
    <loc>${server.url(path)}</loc>
    <lastmod>${lastChanged(files)}</lastmod>
    <changefreq>${path === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`,
);

rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered ${paths.length} pages + 404.html, sitemap with ${entries.length} URLs.`);
