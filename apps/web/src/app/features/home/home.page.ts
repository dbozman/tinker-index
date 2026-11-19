import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { CategorySummary, ProjectListItem } from '@tinker-index/contracts';

import { CatalogApiService } from '../../core/catalog-api.service';
import { formatCostCents, formatDifficulty, formatDurationMinutes } from '../../core/formatters';
import { SeoService } from '../../core/seo.service';
import { CategoryCard } from '../../shared/ui/category-card/category-card';
import { ProjectCard } from '../../shared/ui/project-card/project-card';

@Component({
  selector: 'app-home-page',
  imports: [ProjectCard, CategoryCard],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  private readonly catalogApi = inject(CatalogApiService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly projectsLoading = signal(true);
  readonly categoriesLoading = signal(true);
  readonly projectsError = signal<string | null>(null);
  readonly categoriesError = signal<string | null>(null);
  readonly projects = signal<ProjectListItem[]>([]);
  readonly categories = signal<CategorySummary[]>([]);

  readonly featuredHighlight = computed(() => this.projects()[0] ?? null);

  ngOnInit(): void {
    this.seo.apply({
      title: 'Tinker Index — Discover your next project',
      description:
        'Discover DIY projects across electronics, woodworking, 3D printing, robotics, CNC machining, and home improvement—matched to your skills, tools, time, and budget.',
      path: '/',
    });

    this.catalogApi
      .listProjects(6)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.projects.set(response.data);
          this.projectsLoading.set(false);
          this.projectsError.set(null);
        },
        error: (err: unknown) => {
          this.projectsLoading.set(false);
          this.projectsError.set(
            err instanceof Error ? err.message : 'Unable to load featured projects.',
          );
        },
      });

    this.catalogApi
      .listCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.categoriesLoading.set(false);
          this.categoriesError.set(null);
        },
        error: (err: unknown) => {
          this.categoriesLoading.set(false);
          this.categoriesError.set(
            err instanceof Error ? err.message : 'Unable to load categories.',
          );
        },
      });
  }

  highlightDifficulty(project: ProjectListItem): string {
    return formatDifficulty(project.difficulty.value);
  }

  highlightCost(project: ProjectListItem): string {
    const cost = project.estimatedCost.value;
    return formatCostCents(cost?.amountCents ?? null, cost?.currency ?? 'USD');
  }

  highlightDuration(project: ProjectListItem): string {
    return formatDurationMinutes(project.estimatedDuration.value?.minutes ?? null);
  }
}
