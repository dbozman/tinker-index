import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Health (e2e)', () => {
  let app: INestApplication<App>;
  let checkDatabase: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    checkDatabase = vi.fn().mockResolvedValue(true);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: vi.fn(),
        onModuleDestroy: vi.fn(),
        checkDatabase,
        isConnected: () => true,
        connect: vi.fn().mockResolvedValue(true),
        disconnect: vi.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns degraded when database is down', async () => {
    checkDatabase.mockResolvedValue(false);

    const response = await request(app.getHttpServer()).get('/api/v1/health').expect(200);

    expect(response.body.status).toBe('degraded');
    expect(response.body.checks.database.status).toBe('down');
    expect(JSON.stringify(response.body)).not.toMatch(/postgresql:\/\//i);
  });

  it('GET /api/v1/health/ready returns 503 when database is down', async () => {
    checkDatabase.mockResolvedValue(false);

    const response = await request(app.getHttpServer()).get('/api/v1/health/ready').expect(503);

    expect(response.body.checks.database.status).toBe('down');
  });

  it('GET /api/v1/health/ready returns 200 when database is up', async () => {
    checkDatabase.mockResolvedValue(true);

    const response = await request(app.getHttpServer()).get('/api/v1/health/ready').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.checks.database.status).toBe('up');
  });
});
