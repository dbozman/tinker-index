import { Component, input } from '@angular/core';
import type { CategorySummary } from '@tinker-index/contracts';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {
  readonly category = input.required<CategorySummary>();

  projectCountLabel(): string {
    const count = this.category().publishedProjectCount;
    return count === 1 ? '1 project' : `${count} projects`;
  }
}
