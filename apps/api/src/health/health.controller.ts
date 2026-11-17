import { Controller, Get, Res } from '@nestjs/common';
import type { ServiceHealthResponse } from '@tinker-index/contracts';
import type { Response } from 'express';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth(): Promise<ServiceHealthResponse> {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  async getReady(@Res({ passthrough: true }) res: Response): Promise<ServiceHealthResponse> {
    const { ready, body } = await this.healthService.getReadiness();
    res.status(ready ? 200 : 503);
    return body;
  }
}
