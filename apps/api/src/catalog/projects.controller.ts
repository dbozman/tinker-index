import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectListQueryDto, SearchQueryDto } from './project-query.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('projects')
  @ApiOperation({ summary: 'List published projects' })
  @ApiOkResponse({ description: 'Paginated published projects' })
  list(@Query() query: ProjectListQueryDto) {
    return this.projectsService.listPublished(query);
  }

  @Get('projects/:slug')
  @ApiOperation({ summary: 'Get a published project by slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.projectsService.getPublishedBySlug(slug);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and filter published projects' })
  search(@Query() query: SearchQueryDto) {
    return this.projectsService.search(query);
  }
}
