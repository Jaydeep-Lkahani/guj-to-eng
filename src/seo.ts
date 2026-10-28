// Search-engine and social-preview details for every page: title, description,
// canonical link, Open Graph / Twitter tags and structured data (JSON-LD).
// Used twice: at build time (scripts/prerender.mjs writes it into each page's HTML)
// and in the browser (components/Seo.tsx updates it when she moves between pages).
import { allTopics, getLesson, getPart, getTopicInfo, lessons, parts } from "./content";

// The live address. Change it here if the site moves to its own domain.
export const SITE_URL = "https://gujarati-to-english.vercel.app";

// Paste the code from Google Search Console / Bing Webmaster Tools here (only the content="…" value).
const GOOGLE_SITE_VERIFICATION = "";
const BING_SITE_VERIFICATION = "";

export const SITE_NAME = "Gujarati to English – ચાલો અંગ્રેજી શીખીએ";
const BRAND = "Gujarati to English";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
  jsonLd: object[];
};

const exampleCount = lessons.reduce((n, l) => n + l.examples.length, 0);
const questionCount = lessons.reduce((n, l) => n + l.practice.length, 0);

export const stats = {
  lessons: allTopics.filter((t) => getLesson(t.id)).length,
  examples: exampleCount,
  questions: questionCount,
};

export function url(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

// Turns lesson text into plain text: drops the [[English]] markers and extra spaces.
function plain(text: string): string {
  return text.replace(/\[\[(.+?)\]\]/g, "$1").replace(/\s+/g, " ").trim();
}

// Search results show about 155 characters, so cut at a word near there.
function clip(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20))}…`;
}

const org = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: BRAND,
  alternateName: "ચાલો અંગ્રેજી શીખીએ",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon-512.png`,
};

const courseRef = { "@id": `${SITE_URL}/#course` };

function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}

// Questions and answers shown on the home page. Kept here so the page and the
// structured data always say the same thing.
export const homeFaq: { q: string; a: string; link?: { to: string; label: string } }[] = [
  {
    q: "આ સાઇટ શું છે?",
    a: `આ [[Gujarati to English]] શીખવાની મફત સાઇટ છે. અહીં ગુજરાતી બોલનાર વ્યક્તિ શરૂઆતથી અંગ્રેજી શીખી શકે છે. દરેક પાઠ સરળ ગુજરાતીમાં સમજાવ્યો છે: ${stats.lessons} પાઠ, ${stats.examples}થી વધુ ઉદાહરણ અને ${stats.questions} પ્રેક્ટિસ સવાલ.`,
  },
  {
    q: "શું આ મફત છે? ખાતું બનાવવું પડે?",
    a: "હા, પૂરેપૂરું મફત છે. કોઈ લૉગિન કે ખાતું નથી જોઈતું. સાઇટ ખોલો અને ભણવાનું શરૂ કરો. મોબાઇલ પર પણ સરસ ચાલે છે.",
  },
  {
    q: "મને જરાય અંગ્રેજી નથી આવડતું. હું શરૂ કરી શકું?",
    a: "હા. ભાગ 1 એકદમ શરૂઆતથી છે: [[ABCD]], અક્ષરોના અવાજ, પહેલા શબ્દો અને આંકડા. પછી ધીમે ધીમે વાક્યો, વ્યાકરણ અને વાતચીત આવે છે.",
    link: { to: "/topic/p1-t01", label: "પહેલો પાઠ: ABCD" },
  },
  {
    q: "ગુજરાતી વાક્યને અંગ્રેજીમાં કેવી રીતે ફેરવવું?",
    a: "ગુજરાતીમાં ક્રિયાપદ છેલ્લે આવે (હું પાણી પીઉં છું), પણ અંગ્રેજીમાં તરત કર્તા પછી આવે ([[I drink water]]). આ ક્રમ અને બીજી પેટર્ન એક ખાસ પાઠમાં ઉદાહરણ સાથે સમજાવી છે.",
    link: { to: "/topic/p1-t11", label: "ગુજરાતી વાક્યને અંગ્રેજીમાં ફેરવો" },
  },
  {
    q: "અંગ્રેજી શબ્દનો ઉચ્ચાર કેવી રીતે ખબર પડે?",
    a: "દરેક અંગ્રેજી શબ્દ સાથે તેનો ઉચ્ચાર ગુજરાતી લિપિમાં અને તેનો ગુજરાતી અર્થ લખ્યો છે, જેમ કે [[Water]] – વૉટર – પાણી.",
  },
  {
    q: "મારી પ્રગતિ ક્યાં સચવાય છે?",
    a: "પૂરા થયેલા પાઠ તમારા જ બ્રાઉઝરમાં સચવાય છે. કોઈ માહિતી ક્યાંય મોકલાતી નથી.",
  },
];

function homeMeta(): PageMeta {
  const description = clip(
    `Free Gujarati to English course: learn English step by step, explained in simple Gujarati. ${stats.lessons} lessons with words, sentences, grammar and practice. ગુજરાતીમાં અંગ્રેજી શીખો.`,
    200,
  );
  return {
    title: "Gujarati to English – Learn English in Gujarati | ગુજરાતીમાં અંગ્રેજી શીખો",
    description,
    path: "/",
    jsonLd: [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: BRAND,
        alternateName: ["Gujarati to English", "ગુજરાતી થી અંગ્રેજી", "ચાલો અંગ્રેજી શીખીએ", "Learn English in Gujarati"],
        url: `${SITE_URL}/`,
        inLanguage: "gu",
        publisher: { "@id": org["@id"] },
      },
      org,
      {
        "@type": "Course",
        "@id": courseRef["@id"],
        name: "Gujarati to English – Learn English in Gujarati",
        alternateName: "ગુજરાતીમાં અંગ્રેજી શીખો",
        description,
        url: `${SITE_URL}/`,
        inLanguage: "gu",
        teaches: "English for Gujarati speakers",
        educationalLevel: "Beginner to Advanced",
        isAccessibleForFree: true,
        provider: { "@id": org["@id"] },
        offers: { "@type": "Offer", price: 0, priceCurrency: "INR", category: "Free" },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: `PT${stats.lessons * 20}M`,
        },
        hasPart: parts.map((p) => ({
          "@type": "Course",
          name: `Part ${p.number}: ${p.titleEn} – ${p.titleGu}`,
          url: url(`/part/${p.id}`),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: homeFaq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
        })),
      },
    ],
  };
}

function partMeta(partId: string): PageMeta | undefined {
  const part = getPart(partId);
  if (!part) return undefined;
  const path = `/part/${part.id}`;
  const topicNames = part.topics.map((t) => t.titleEn).join(", ");
  return {
    title: `Part ${part.number}: ${part.titleEn} English in Gujarati – ભાગ ${part.number}: ${part.titleGu} | ${BRAND}`,
    description: clip(`${part.introGu} Gujarati to English, ${part.titleEn} level: ${topicNames}.`),
    path,
    jsonLd: [
      {
        "@type": "Course",
        name: `Part ${part.number}: ${part.titleEn} English – ${part.titleGu}`,
        description: plain(part.introGu),
        url: url(path),
        inLanguage: "gu",
        educationalLevel: part.titleEn,
        isAccessibleForFree: true,
        provider: { "@id": org["@id"] },
        isPartOf: courseRef,
      },
      {
        "@type": "ItemList",
        name: `ભાગ ${part.number}: ${part.titleGu}`,
        itemListElement: part.topics.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${t.titleEn} – ${t.titleGu}`,
          url: url(`/topic/${t.id}`),
        })),
      },
      breadcrumbs([
        { name: BRAND, path: "/" },
        { name: `ભાગ ${part.number}: ${part.titleGu}`, path },
      ]),
    ],
  };
}

function topicMeta(topicId: string): PageMeta | undefined {
  const info = getTopicInfo(topicId);
  if (!info) return undefined;
  const { topic, part, number } = info;
  const lesson = getLesson(topic.id);
  const path = `/topic/${topic.id}`;
  const intro = lesson ? plain(lesson.explanationGu[0] ?? "") : "";
  const sample = lesson?.examples
    .slice(0, 3)
    .map((e) => `${e.en} – ${e.gu}`)
    .join(", ");
  const description = clip(
    `${topic.titleEn} in Gujarati: ${intro}${sample ? ` Examples: ${sample}.` : ""}`,
  );
  return {
    title: `${topic.titleEn} in Gujarati – ${topic.titleGu} | ${BRAND}`,
    description,
    path,
    type: "article",
    // A topic with no lesson yet is thin, so keep it out of search until it is written.
    noindex: !lesson,
    jsonLd: [
      {
        "@type": "LearningResource",
        name: `${topic.titleEn} – ${topic.titleGu}`,
        headline: `${topic.titleEn} in Gujarati`,
        description,
        url: url(path),
        inLanguage: "gu",
        learningResourceType: "Lesson",
        educationalLevel: part.titleEn,
        teaches: topic.titleEn,
        isAccessibleForFree: true,
        position: number,
        isPartOf: courseRef,
        provider: { "@id": org["@id"] },
        ...(lesson && lesson.practice.length > 0
          ? {
              hasPart: {
                "@type": "Quiz",
                name: `${topic.titleEn} – practice`,
                about: topic.titleEn,
                educationalLevel: part.titleEn,
              },
            }
          : {}),
      },
      breadcrumbs([
        { name: BRAND, path: "/" },
        { name: `ભાગ ${part.number}: ${part.titleGu}`, path: `/part/${part.id}` },
        { name: topic.titleGu, path },
      ]),
    ],
  };
}

function notFoundMeta(path: string): PageMeta {
  return {
    title: `આ પાનું મળ્યું નહીં | ${BRAND}`,
    description: "આ પાનું મળ્યું નહીં. ઘરે જાઓ અને ત્યાંથી પાઠ પસંદ કરો.",
    path,
    noindex: true,
    jsonLd: [],
  };
}

export function pageMeta(pathname: string): PageMeta {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return homeMeta();
  const [, kind, id] = clean.split("/");
  const meta = kind === "part" ? partMeta(id) : kind === "topic" ? topicMeta(id) : undefined;
  return meta ?? notFoundMeta(clean);
}

// Every page that should be in search results, for the sitemap and the build.
export function indexablePaths(): string[] {
  return [
    "/",
    ...parts.map((p) => `/part/${p.id}`),
    ...allTopics.filter((t) => getLesson(t.id)).map((t) => `/topic/${t.id}`),
  ];
}

// Every page the build writes as its own HTML file (includes not-yet-written topics).
export function allPaths(): string[] {
  return ["/", ...parts.map((p) => `/part/${p.id}`), ...allTopics.map((t) => `/topic/${t.id}`)];
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// The <head> tags for a page. Every tag carries data-seo so the browser can swap them on navigation.
export function headTags(meta: PageMeta): string {
  const canonical = url(meta.path);
  const tags = [
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<link rel="alternate" hreflang="gu" href="${canonical}">`,
    `<link rel="alternate" hreflang="x-default" href="${canonical}">`,
    `<meta property="og:type" content="${meta.type ?? "website"}">`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
    `<meta property="og:locale" content="gu_IN">`,
    `<meta property="og:locale:alternate" content="en_IN">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${OG_IMAGE}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(SITE_NAME)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${OG_IMAGE}">`,
  ];
  if (GOOGLE_SITE_VERIFICATION) {
    tags.push(`<meta name="google-site-verification" content="${esc(GOOGLE_SITE_VERIFICATION)}">`);
  }
  if (BING_SITE_VERIFICATION) {
    tags.push(`<meta name="msvalidate.01" content="${esc(BING_SITE_VERIFICATION)}">`);
  }
  if (meta.jsonLd.length > 0) {
    const data = { "@context": "https://schema.org", "@graph": meta.jsonLd };
    // "<" is escaped so lesson text can never close the script tag early.
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`,
    );
  }
  return tags.map((t) => t.replace(/^<(\w+)/, '<$1 data-seo=""')).join("\n    ");
}
