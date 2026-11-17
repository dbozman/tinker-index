import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  let service: WorkerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [WorkerService],
    }).compile();

    service = moduleRef.get(WorkerService);
  });

  afterEach(() => {
    service.stop();
  });

  it('reports ok health status', () => {
    const status = service.getStatus();
    expect(status.status).toBe('ok');
    expect(status.service).toBe('worker');
  });
});
