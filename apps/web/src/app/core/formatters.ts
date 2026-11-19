import type { Difficulty } from '@tinker-index/contracts';

const difficultyLabels: Record<Difficulty, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
};

export function formatDifficulty(value: Difficulty | null | undefined): string {
  if (!value) {
    return 'Not estimated';
  }
  return difficultyLabels[value];
}

export function formatCostCents(
  amountCents: number | null | undefined,
  currency = 'USD',
): string {
  if (amountCents === null || amountCents === undefined) {
    return 'Not estimated';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
    }).format(amountCents / 100);
  } catch {
    return `$${(amountCents / 100).toFixed(2)}`;
  }
}

export function formatDurationMinutes(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) {
    return 'Not estimated';
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) {
    return hours === 1 ? '1 hr' : `${hours} hrs`;
  }

  return `${hours}h ${remainder}m`;
}
