import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  PaginatedResponse,
  ProjectDetail,
  ProjectListItem,
  ProjectSort,
} from '@tinker-index/contracts';
import { Prisma, PublicationStatus } from '../generated/prisma/client';
import { buildPaginationMeta, resolvePagination } from '../common/pagination';
import { PrismaService } from '../prisma/prisma.service';
import { toProjectDetail, toProjectListItem, type ProjectWithRelations } from './catalog.mapper';
import type { ProjectListQueryDto, SearchQueryDto } from './project-query.dto';

const projectInclude = {
  category: true,
  creator: true,
  source: true,
  tags: { include: { tag: true } },
  tools: { include: { tool: true } },
  materials: { include: { material: true } },
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublished(query: ProjectListQueryDto): Promise<PaginatedResponse<ProjectListItem>> {
    const { page, pageSize, skip } = resolvePagination(query);
    const where: Prisma.ProjectWhereInput = { status: PublicationStatus.PUBLISHED };
    const orderBy = this.resolveOrderBy(query.sort ?? 'publishedAt_desc');

    const [totalItems, rows] = await Promise.all([
      this.prisma.prisma.project.count({ where }),
      this.prisma.prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy,
        skip,
        take: pageSize,
      }),
    ]);

    return {
      data: (rows as ProjectWithRelations[]).map(toProjectListItem),
      meta: buildPaginationMeta(page, pageSize, totalItems),
    };
  }

  async getPublishedBySlug(slug: string): Promise<ProjectDetail> {
    const project = await this.prisma.prisma.project.findFirst({
      where: { slug, status: PublicationStatus.PUBLISHED },
      include: projectInclude,
    });

    if (!project) {
      throw new NotFoundException(`Published project not found for slug "${slug}"`);
    }

    return toProjectDetail(project as ProjectWithRelations);
  }

  async search(query: SearchQueryDto): Promise<PaginatedResponse<ProjectListItem>> {
    const { page, pageSize, skip } = resolvePagination(query);
    const where = await this.buildSearchWhere(query);
    const orderBy = this.resolveOrderBy(query.sort ?? 'publishedAt_desc');

    const [totalItems, rows] = await Promise.all([
      this.prisma.prisma.project.count({ where }),
      this.prisma.prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy,
        skip,
        take: pageSize,
      }),
    ]);

    return {
      data: (rows as ProjectWithRelations[]).map(toProjectListItem),
      meta: buildPaginationMeta(page, pageSize, totalItems),
    };
  }

  private async buildSearchWhere(query: SearchQueryDto): Promise<Prisma.ProjectWhereInput> {
    const where: Prisma.ProjectWhereInput = {
      status: PublicationStatus.PUBLISHED,
    };

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.difficulty) {
      where.difficulty = query.difficulty;
    }

    if (query.minCostCents !== undefined || query.maxCostCents !== undefined) {
      where.estimatedCostCents = {};
      if (query.minCostCents !== undefined) {
        where.estimatedCostCents.gte = query.minCostCents;
      }
      if (query.maxCostCents !== undefined) {
        where.estimatedCostCents.lte = query.maxCostCents;
      }
    }

    if (query.maxMinutes !== undefined) {
      where.estimatedMinutes = { lte: query.maxMinutes };
    }

    if (query.tools) {
      const toolSlugs = query.tools
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      for (const toolSlug of toolSlugs) {
        // Require each tool independently so AND semantics are preserved.
        where.AND = [
          ...((where.AND as Prisma.ProjectWhereInput[] | undefined) ?? []),
          { tools: { some: { tool: { slug: toolSlug } } } },
        ];
      }
    }

    const keyword = query.q?.trim();
    if (keyword) {
      const matches = await this.prisma.prisma.$queryRaw<Array<{ id: string }>>`
        SELECT "id"
        FROM "Project"
        WHERE "status" = 'PUBLISHED'::"PublicationStatus"
          AND to_tsvector('english', coalesce("searchText", ''))
              @@ plainto_tsquery('english', ${keyword})
      `;
      const ids = matches.map((row) => row.id);
      where.id = { in: ids.length > 0 ? ids : ['__no_match__'] };
    }

    return where;
  }

  private resolveOrderBy(sort: ProjectSort): Prisma.ProjectOrderByWithRelationInput[] {
    switch (sort) {
      case 'title_asc':
        return [{ title: 'asc' }, { slug: 'asc' }];
      case 'estimatedCost_asc':
        return [{ estimatedCostCents: 'asc' }, { slug: 'asc' }];
      case 'estimatedCost_desc':
        return [{ estimatedCostCents: 'desc' }, { slug: 'asc' }];
      case 'estimatedMinutes_asc':
        return [{ estimatedMinutes: 'asc' }, { slug: 'asc' }];
      case 'estimatedMinutes_desc':
        return [{ estimatedMinutes: 'desc' }, { slug: 'asc' }];
      case 'publishedAt_desc':
      default:
        return [{ publishedAt: 'desc' }, { slug: 'asc' }];
    }
  }
}
