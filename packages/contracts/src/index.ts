/**
 * Shared contracts package.
 * Milestone 1 ships a placeholder health response shape only.
 * Full API DTOs arrive with Milestone 2+.
 */

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  timestamp: string;
}

export function createHealthStatus(service: string, status: HealthStatus['status'] = 'ok'): HealthStatus {
  return {
    status,
    service,
    timestamp: new Date().toISOString(),
  };
}
