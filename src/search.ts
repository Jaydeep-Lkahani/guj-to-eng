// Search across topic titles and the example words inside lessons.
import { allTopics, getTopicInfo, lessons } from "./content";

export type SearchResult =
  | {
      kind: "topic";
      key: string;
      topicId: string;
      titleGu: string;
      titleEn: string;
      where: string;
    }
  | {
      kind: "word";
      key: string;
      topicId: string;
      en: string;
      translit: string;
      gu: string;
      where: string;
    };

const clean = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

type Entry = { result: SearchResult; fields: string[] };

function buildIndex(): Entry[] {
  const entries: Entry[] = [];
  for (const topic of allTopics) {
    const info = getTopicInfo(topic.id)!;
    entries.push({
      result: {
        kind: "topic",
        key: `t-${topic.id}`,
        topicId: topic.id,
        titleGu: topic.titleGu,
        titleEn: topic.titleEn,
        where: `ભાગ ${info.part.number} · પાઠ ${info.number}`,
      },
      fields: [clean(topic.titleGu), clean(topic.titleEn)],
    });
  }
  for (const lesson of lessons) {
    const info = getTopicInfo(lesson.topicId);
    if (!info) continue;
    lesson.examples.forEach((ex, i) => {
      entries.push({
        result: {
          kind: "word",
          key: `w-${lesson.topicId}-${i}`,
          topicId: lesson.topicId,
          en: ex.en,
          translit: ex.translit,
          gu: ex.gu,
          where: info.topic.titleGu,
        },
        fields: [clean(ex.en), clean(ex.translit), clean(ex.gu)],
      });
    });
  }
  return entries;
}

let index: Entry[] | null = null;

// Topics first, then words. Matches at the start of a word rank higher.
export function search(query: string, limit = 8): SearchResult[] {
  const q = clean(query);
  if (!q) return [];
  index ??= buildIndex();

  const scored: { result: SearchResult; score: number }[] = [];
  for (const entry of index) {
    let best = -1;
    for (const field of entry.fields) {
      const at = field.indexOf(q);
      if (at === -1) continue;
      const wordStart = at === 0 || /[\s\-–(/]/.test(field[at - 1]);
      best = Math.max(best, at === 0 ? 3 : wordStart ? 2 : 1);
    }
    if (best > 0) scored.push({ result: entry.result, score: best + (entry.result.kind === "topic" ? 3 : 0) });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.result);
}
