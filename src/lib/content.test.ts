import { describe, expect, it } from 'vitest';
import { makeBundle, toFiles } from '../test/contentFixture';
import {
  approvedVideos,
  buildContent,
  ContentError,
  findTopic,
  lessonsOfTopic,
} from './content';

function build() {
  return buildContent(toFiles(makeBundle()));
}

describe('buildContent', () => {
  it('builds typed content from valid files', () => {
    const content = build();
    expect(content.phases).toHaveLength(1);
    expect(content.words).toHaveLength(2);
    expect(content.videos).toHaveLength(1);
  });

  it('puts the lessons of each topic in their own order', () => {
    const bundle = makeBundle();
    bundle.lessonsT01.lessons.reverse();
    const content = buildContent(toFiles(bundle));
    expect(lessonsOfTopic(content, 'p1-t01').map((l) => l.order)).toEqual([
      1, 2,
    ]);
  });

  it('sorts phases by their order', () => {
    const bundle = makeBundle();
    const second = {
      ...bundle.phases.phases[0]!,
      id: 'p2' as const,
      order: 2 as const,
    };
    bundle.phases.phases.unshift(second);
    expect(buildContent(toFiles(bundle)).phases.map((p) => p.id)).toEqual([
      'p1',
      'p2',
    ]);
  });

  it('throws a ContentError when a file does not match its schema', () => {
    const files = toFiles(makeBundle());
    files['phases.json'] = { phases: 'nope' };
    expect(() => buildContent(files)).toThrow(ContentError);
  });

  it('throws when phases.json or videos.json is missing', () => {
    const files = toFiles(makeBundle());
    delete files['videos.json'];
    expect(() => buildContent(files)).toThrow(ContentError);
    const noPhases = toFiles(makeBundle());
    delete noPhases['phases.json'];
    expect(() => buildContent(noPhases)).toThrow(/phases\.json/);
  });
});

describe('content helpers', () => {
  it('findTopic returns the topic with its phase', () => {
    const found = findTopic(build(), 'p1-t02');
    expect(found?.topic.id).toBe('p1-t02');
    expect(found?.phase.id).toBe('p1');
  });

  it('findTopic returns undefined for an unknown topic', () => {
    expect(findTopic(build(), 'p9-t99')).toBeUndefined();
  });

  it('lessonsOfTopic returns an empty list for a topic without lessons', () => {
    const bundle = makeBundle();
    const files = toFiles(bundle);
    delete files['lessons/p1-t02.json'];
    expect(lessonsOfTopic(buildContent(files), 'p1-t02')).toEqual([]);
  });

  it('approvedVideos shows only approved videos', () => {
    const bundle = makeBundle();
    const candidate = {
      ...bundle.videos.videos[0]!,
      id: 'v-TEST_VIDEO2',
      youtubeId: 'TEST_VIDEO2',
      status: 'candidate' as const,
    };
    const rejected = {
      ...bundle.videos.videos[0]!,
      id: 'v-TEST_VIDEO3',
      youtubeId: 'TEST_VIDEO3',
      status: 'rejected' as const,
    };
    bundle.videos.videos.push(candidate, rejected);
    const content = buildContent(toFiles(bundle));
    const ids = [
      'v-TEST_VIDEO2',
      'v-TEST_VIDEO1',
      'v-TEST_VIDEO3',
      'v-missing',
    ];
    expect(approvedVideos(content, ids).map((v) => v.id)).toEqual([
      'v-TEST_VIDEO1',
    ]);
  });

  it('approvedVideos keeps the order of the ids', () => {
    const bundle = makeBundle();
    bundle.videos.videos.push({
      ...bundle.videos.videos[0]!,
      id: 'v-TEST_VIDEO2',
      youtubeId: 'TEST_VIDEO2',
    });
    const content = buildContent(toFiles(bundle));
    expect(
      approvedVideos(content, ['v-TEST_VIDEO2', 'v-TEST_VIDEO1']).map(
        (v) => v.id,
      ),
    ).toEqual(['v-TEST_VIDEO2', 'v-TEST_VIDEO1']);
  });
});
