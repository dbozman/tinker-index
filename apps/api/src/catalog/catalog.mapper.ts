import type {
  CategorySummary,
  MaterialSummary,
  ProjectDetail,
  ProjectListItem,
  ToolSummary,
} from '@tinker-index/contracts';
import type {
  Category,
  Creator,
  Difficulty,
  Material,
  Project,
  ProjectMaterial,
  ProjectTag,
  ProjectTool,
  Provenance,
  Source,
  Tag,
  Tool,
} from '../generated/prisma/client';

export type ProjectWithRelations = Project & {
  category: Category;
  creator: Creator | null;
  source: Source;
  tags: Array<ProjectTag & { tag: Tag }>;
  tools: Array<ProjectTool & { tool: Tool }>;
  materials: Array<ProjectMaterial & { material: Material }>;
};

function provenanced<T>(value: T | null, provenance: Provenance) {
  return { value, provenance };
}

export function toProjectListItem(project: ProjectWithRelations): ProjectListItem {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    category: { slug: project.category.slug, name: project.category.name },
    tags: project.tags.map((entry) => ({
      slug: entry.tag.slug,
      name: entry.tag.name,
    })),
    difficulty: provenanced<Difficulty | null>(project.difficulty, project.difficultyProvenance),
    estimatedCost: provenanced(
      project.estimatedCostCents === null
        ? null
        : { amountCents: project.estimatedCostCents, currency: project.currency },
      project.costProvenance,
    ),
    estimatedDuration: provenanced(
      project.estimatedMinutes === null ? null : { minutes: project.estimatedMinutes },
      project.timeProvenance,
    ),
    creator: project.creator
      ? { name: project.creator.name, websiteUrl: project.creator.websiteUrl }
      : null,
    sourceUrl: project.sourceUrl,
    isDemo: project.isDemo,
    publishedAt: project.publishedAt?.toISOString() ?? null,
  };
}

export function toProjectDetail(project: ProjectWithRelations): ProjectDetail {
  const tools: ToolSummary[] = project.tools.map((entry) => ({
    slug: entry.tool.slug,
    name: entry.tool.name,
    optional: entry.optional,
  }));

  const materials: MaterialSummary[] = project.materials.map((entry) => ({
    slug: entry.material.slug,
    name: entry.material.name,
    quantity: entry.quantity,
    unit: entry.unit,
  }));

  return {
    ...toProjectListItem(project),
    description: project.description,
    tools,
    materials,
    source: {
      name: project.source.name,
      websiteUrl: project.source.websiteUrl,
      url: project.sourceUrl,
    },
    mainImage: {
      url: project.mainImageUrl,
      attribution: project.mainImageAttribution,
      license: project.mainImageLicense,
      rightsHolder: project.mainImageRightsHolder,
    },
  };
}

export function toCategorySummary(
  category: Category,
  publishedProjectCount: number,
): CategorySummary {
  return {
    slug: category.slug,
    name: category.name,
    description: category.description,
    publishedProjectCount,
  };
}
