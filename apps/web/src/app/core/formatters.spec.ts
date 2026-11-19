import { formatCostCents, formatDifficulty, formatDurationMinutes } from './formatters';

describe('formatters', () => {
  it('formats difficulty labels', () => {
    expect(formatDifficulty('BEGINNER')).toBe('Beginner');
    expect(formatDifficulty(null)).toBe('Unspecified');
  });

  it('formats currency from cents', () => {
    expect(formatCostCents(2400)).toBe('$24');
    expect(formatCostCents(2599)).toBe('$25.99');
    expect(formatCostCents(null)).toBe('Cost TBD');
  });

  it('formats durations', () => {
    expect(formatDurationMinutes(45)).toBe('45 min');
    expect(formatDurationMinutes(60)).toBe('1 hr');
    expect(formatDurationMinutes(90)).toBe('1h 30m');
    expect(formatDurationMinutes(null)).toBe('Time TBD');
  });
});
