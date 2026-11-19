import { Component, input } from '@angular/core';
import type { ProjectListItem } from '@tinker-index/contracts';

import {
  formatCostCents,
  formatDifficulty,
  formatDurationMinutes,
} from '../../../core/formatters';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<ProjectListItem>();

  difficultyLabel(): string {
    return formatDifficulty(this.project().difficulty.value);
  }

  costLabel(): string {
    const cost = this.project().estimatedCost.value;
    return formatCostCents(cost?.amountCents ?? null, cost?.currency ?? 'USD');
  }

  durationLabel(): string {
    return formatDurationMinutes(this.project().estimatedDuration.value?.minutes ?? null);
  }
}
