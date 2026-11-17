import { Injectable } from '@nestjs/common';
import { createHealthStatus, type HealthStatus } from '@tinker-index/contracts';

@Injectable()
export class HealthService {
  getStatus(): HealthStatus {
    return createHealthStatus('api');
  }
}
