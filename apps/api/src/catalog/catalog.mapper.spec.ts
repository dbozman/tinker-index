import { describe, expect, it } from 'vitest';
import { Difficulty, Provenance, PublicationStatus } from '../generated/prisma/client';
import { toProjectDetail, toProjectListItem, type ProjectWithRelations } from './catalog.mapper';

function sampleProject(overrides: Partial<ProjectWithRelations> = {}): ProjectWithRelations {
  const base: ProjectWithRelations = {
    id: 'p1',
    slug: 'demo-sample',
    title: 'Demo Sample',
    summary: 'Summary',
    description: 'Description',
    status: PublicationStatus.PUBLISHED,
    difficulty: Difficulty.BEGINNER,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 1000,
    currency: 'USD',
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 60,
    timeProvenance: Provenance.UNKNOWN,
    categoryId: 'c1',
    creatorId: 'cr1',
    sourceId: 's1',
    sourceUrl: 'https://example.com/demo',
    searchText: 'demo sample',
    isDemo: true,
    mainImageUrl: null,
    mainImageAttribution: null,
    mainImageLicense: null,
    mainImageRightsHolder: null,
    publishedAt: new Date('2026-10-01T00:00:00.000Z'),
    createdAt: new Date('2026-10-01T00:00:00.000Z'),
    updatedAt: new Date('2026-10-01T00:00:00.000Z'),
    category: {
      id: 'c1',
      slug: 'electronics',
      name: 'Electronics',
      description: null,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    creator: {
      id: 'cr1',
      name: 'Demo Creator',
      websiteUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    source: {
      id: 's1',
      name: 'Demo Source',
      websiteUrl: 'https://example.com',
      canonicalUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    tags: [],
    tools: [],
    materials: [],
  };

  return { ...base, ...overrides };
}

describe('catalog.mapper', () => {
  it('maps list items with provenance wrappers', () => {
    const item = toProjectListItem(sampleProject());
    expect(item.difficulty).toEqual({
      value: 'BEGINNER',
      provenance: 'SOURCE_VERIFIED',
    });
    expect(item.estimatedCost.value?.amountCents).toBe(1000);
    expect(item.isDemo).toBe(true);
  });

  it('maps detail payload with tools and source attribution', () => {
    const detail = toProjectDetail(
      sampleProject({
        tools: [
          {
            projectId: 'p1',
            toolId: 't1',
            optional: false,
            notes: null,
            tool: {
              id: 't1',
              slug: 'multimeter',
              name: 'Multimeter',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      }),
    );

    expect(detail.description).toBe('Description');
    expect(detail.tools[0]?.slug).toBe('multimeter');
    expect(detail.source.url).toBe('https://example.com/demo');
  });
});
