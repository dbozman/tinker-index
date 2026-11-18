import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController, CategoriesController],
  providers: [ProjectsService, CategoriesService],
  exports: [ProjectsService, CategoriesService],
})
export class CatalogModule {}
