import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';

/**
 * Milestone 1 stub. Later milestones will import Jobs and related modules
 * from apps/api instead of duplicating business logic here.
 */
@Module({
  providers: [WorkerService],
})
export class WorkerModule {}
