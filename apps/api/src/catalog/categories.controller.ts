import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/pagination';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List categories with published project counts' })
  @ApiOkResponse({ description: 'Category summaries' })
  list() {
    return this.categoriesService.listCategories();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a category and its published projects' })
  getBySlug(@Param('slug') slug: string, @Query() query: PaginationQueryDto) {
    return this.categoriesService.getCategoryWithProjects(slug, query);
  }
}
