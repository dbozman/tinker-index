import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: { checkDatabase: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    prisma = {
      checkDatabase: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    controller = module.get(HealthController);
  });

  it('returns ok liveness when the database is up', async () => {
    prisma.checkDatabase.mockResolvedValue(true);

    const result = await controller.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('api');
    expect(result.checks.database.status).toBe('up');
  });

  it('returns degraded liveness when the database is down', async () => {
    prisma.checkDatabase.mockResolvedValue(false);

    const result = await controller.getHealth();

    expect(result.status).toBe('degraded');
    expect(result.checks.database.status).toBe('down');
  });

  it('returns 200 readiness when the database is up', async () => {
    prisma.checkDatabase.mockResolvedValue(true);
    const res = { status: vi.fn() } as unknown as Response;

    const result = await controller.getReady(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(result.status).toBe('ok');
    expect(result.checks.database.status).toBe('up');
  });

  it('returns 503 readiness when the database is down', async () => {
    prisma.checkDatabase.mockResolvedValue(false);
    const res = { status: vi.fn() } as unknown as Response;

    const result = await controller.getReady(res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(result.status).toBe('degraded');
    expect(result.checks.database.status).toBe('down');
  });
});
