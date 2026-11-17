import { Injectable } from '@nestjs/common';
import { createServiceHealthResponse, type ServiceHealthResponse } from '@tinker-index/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  /** Liveness: process is up. Includes database check without failing the app. */
  async getLiveness(): Promise<ServiceHealthResponse> {
    const databaseUp = await this.prisma.checkDatabase();
    return createServiceHealthResponse('api', databaseUp ? 'up' : 'down');
  }

  /** Readiness: database must be reachable for traffic. */
  async getReadiness(): Promise<{
    ready: boolean;
    body: ServiceHealthResponse;
  }> {
    const databaseUp = await this.prisma.checkDatabase();
    const body = createServiceHealthResponse('api', databaseUp ? 'up' : 'down');
    return { ready: databaseUp, body };
  }
}
