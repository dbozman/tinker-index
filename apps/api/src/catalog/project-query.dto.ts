import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import type { Difficulty, ProjectSort } from '@tinker-index/contracts';
import { PaginationQueryDto } from '../common/pagination';

const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;
const SORTS = [
  'publishedAt_desc',
  'title_asc',
  'estimatedCost_asc',
  'estimatedCost_desc',
  'estimatedMinutes_asc',
  'estimatedMinutes_desc',
] as const;

export class ProjectListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: SORTS, default: 'publishedAt_desc' })
  @IsOptional()
  @IsEnum(SORTS)
  sort?: ProjectSort = 'publishedAt_desc';
}

export class SearchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Keyword search across title, summary, and tags' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;

  @ApiPropertyOptional({ description: 'Category slug' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ enum: DIFFICULTIES })
  @IsOptional()
  @IsEnum(DIFFICULTIES)
  difficulty?: Difficulty;

  @ApiPropertyOptional({ description: 'Minimum estimated cost in cents' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minCostCents?: number;

  @ApiPropertyOptional({ description: 'Maximum estimated cost in cents' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxCostCents?: number;

  @ApiPropertyOptional({ description: 'Maximum estimated build time in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxMinutes?: number;

  @ApiPropertyOptional({
    description: 'Comma-separated tool slugs; project must include all listed tools',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  tools?: string;

  @ApiPropertyOptional({ enum: SORTS, default: 'publishedAt_desc' })
  @IsOptional()
  @IsEnum(SORTS)
  sort?: ProjectSort = 'publishedAt_desc';
}
