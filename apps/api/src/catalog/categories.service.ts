import { Injectable, NotFoundException } from '@nestjs/common';
import type { CategorySummary, PaginatedResponse, ProjectListItem } from '@tinker-index/contracts';
import { PublicationStatus } from '../generated/prisma/client';
import { buildPaginationMeta, resolvePagination } from '../common/pagination';
import { PrismaService } from '../prisma/prisma.service';
import { toCategorySummary, toProjectListItem, type ProjectWithRelations } from './catalog.mapper';
import type { PaginationQueryDto } from '../common/pagination';

const projectInclude = {
  category: true,
  creator: true,
  source: true,
  tags: { include: { tag: true } },
  tools: { include: { tool: true } },
  materials: { include: { material: true } },
} as const;

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async listCategories(): Promise<CategorySummary[]> {
    const categories = await this.prisma.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            projects: { where: { status: PublicationStatus.PUBLISHED } },
          },
        },
      },
    });

    return categories.map((category) => toCategorySummary(category, category._count.projects));
  }

  async getCategoryWithProjects(
    slug: string,
    query: PaginationQueryDto,
  ): Promise<{ category: CategorySummary; projects: PaginatedResponse<ProjectListItem> }> {
    const category = await this.prisma.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category not found for slug "${slug}"`);
    }

    const { page, pageSize, skip } = resolvePagination(query);
    const where = {
      categoryId: category.id,
      status: PublicationStatus.PUBLISHED,
    };

    const [totalItems, rows] = await Promise.all([
      this.prisma.prisma.project.count({ where }),
      this.prisma.prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy: [{ publishedAt: 'desc' }, { slug: 'asc' }],
        skip,
        take: pageSize,
      }),
    ]);

    return {
      category: toCategorySummary(category, totalItems),
      projects: {
        data: (rows as ProjectWithRelations[]).map(toProjectListItem),
        meta: buildPaginationMeta(page, pageSize, totalItems),
      },
    };
  }
}
