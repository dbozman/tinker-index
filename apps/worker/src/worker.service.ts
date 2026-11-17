import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { createHealthStatus } from '@tinker-index/contracts';

@Injectable()
export class WorkerService implements OnModuleDestroy {
  private readonly logger = new Logger(WorkerService.name);
  private heartbeat: ReturnType<typeof setInterval> | undefined;

  start(): void {
    const health = createHealthStatus('worker');
    this.logger.log(`Worker ready (${health.status}) at ${health.timestamp}`);
    this.heartbeat = setInterval(() => {
      this.logger.debug('Worker heartbeat — awaiting job processor in Milestone 5');
    }, 60_000);
  }

  stop(): void {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = undefined;
    }
  }

  onModuleDestroy(): void {
    this.stop();
  }

  getStatus(): ReturnType<typeof createHealthStatus> {
    return createHealthStatus('worker');
  }
}
