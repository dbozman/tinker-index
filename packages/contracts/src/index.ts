/**
 * Shared contracts package.
 * Milestone 2a extends health payloads with database check status.
 * Full API DTOs arrive with Milestone 2b+.
 */

export type HealthStatusValue = 'ok' | 'degraded' | 'error';
export type DependencyStatus = 'up' | 'down';

export interface HealthStatus {
  status: HealthStatusValue;
  service: string;
  timestamp: string;
}

export interface DatabaseCheck {
  status: DependencyStatus;
}

export interface ServiceHealthResponse extends HealthStatus {
  checks: {
    database: DatabaseCheck;
  };
}

export function createHealthStatus(
  service: string,
  status: HealthStatusValue = 'ok',
): HealthStatus {
  return {
    status,
    service,
    timestamp: new Date().toISOString(),
  };
}

export function createServiceHealthResponse(
  service: string,
  databaseStatus: DependencyStatus,
): ServiceHealthResponse {
  const status: HealthStatusValue = databaseStatus === 'up' ? 'ok' : 'degraded';

  return {
    ...createHealthStatus(service, status),
    checks: {
      database: { status: databaseStatus },
    },
  };
}
