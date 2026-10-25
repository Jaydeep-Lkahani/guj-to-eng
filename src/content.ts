// Loads the course content from the /content folder.
// parts.json lists the parts and their topics in order.
// Each topic's lesson lives in content/lessons/<topic id>.json and is picked up automatically.
import partsData from "../content/parts.json";

export type TopicMeta = {
  id: string;
  titleGu: string;
  titleEn: string;
};

export type Part = {
  id: string;
  number: number;
  titleGu: string;
  titleEn: string;
  introGu: string;
  topics: TopicMeta[];
};

export type Example = {
  en: string;
  translit: string;
  gu: string;
};

export type ChoiceQuestion = {
  type: "choice";
  questionGu: string;
  options: string[];
  answer: number;
  explainGu?: string;
};

export type Question = ChoiceQuestion;

export type Lesson = {
  topicId: string;
  placeholder?: boolean;
  explanationGu: string[];
  examples: Example[];
  practice: Question[];
};

export type TopicInfo = {
  topic: TopicMeta;
  part: Part;
  number: number;
  prev?: TopicMeta;
  next?: TopicMeta;
};

export const parts: Part[] = partsData.parts;

const lessonFiles = import.meta.glob<Lesson>("../content/lessons/*.json", {
  eager: true,
  import: "default",
});

export const lessons: Lesson[] = Object.values(lessonFiles);
const lessonsById = new Map(lessons.map((l) => [l.topicId, l]));

export const allTopics: TopicMeta[] = parts.flatMap((p) => p.topics);

export function getPart(id: string | undefined): Part | undefined {
  return parts.find((p) => p.id === id);
}

export function getLesson(topicId: string): Lesson | undefined {
  return lessonsById.get(topicId);
}

export function getTopicInfo(topicId: string | undefined): TopicInfo | undefined {
  const index = allTopics.findIndex((t) => t.id === topicId);
  if (index === -1) return undefined;
  const topic = allTopics[index];
  const part = parts.find((p) => p.topics.includes(topic))!;
  return {
    topic,
    part,
    number: part.topics.indexOf(topic) + 1,
    prev: allTopics[index - 1],
    next: allTopics[index + 1],
  };
}

export function partOfTopic(topicId: string): Part | undefined {
  return parts.find((p) => p.topics.some((t) => t.id === topicId));
}
