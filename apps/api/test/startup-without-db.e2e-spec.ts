import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module';

describe('API startup without PostgreSQL', () => {
  let app: INestApplication<App>;
  const originalUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgresql://tinker:tinker@127.0.0.1:1/tinker_index_unavailable';
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    if (originalUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalUrl;
    }
    vi.restoreAllMocks();
  });

  it('starts and reports degraded health when PostgreSQL is unavailable', async () => {
    const health = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(health.body.status).toBe('degraded');
    expect(health.body.checks.database.status).toBe('down');

    const ready = await request(app.getHttpServer()).get('/api/v1/health/ready').expect(503);
    expect(ready.body.checks.database.status).toBe('down');
  });
});
