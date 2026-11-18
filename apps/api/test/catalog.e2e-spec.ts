import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';

const runIntegration = Boolean(process.env.DATABASE_URL) && process.env.SKIP_DB_INTEGRATION !== '1';

describe.runIf(runIntegration)('Catalog API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists only published projects with pagination metadata', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/projects')
      .query({ page: 1, pageSize: 5 })
      .expect(200);

    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.pageSize).toBe(5);
    expect(response.body.meta.totalItems).toBeGreaterThanOrEqual(1);
    expect(response.body.data).toHaveLength(Math.min(5, response.body.meta.totalItems));
    for (const project of response.body.data) {
      expect(project.slug).toBeTruthy();
      expect(project.category.slug).toBeTruthy();
      expect(project.sourceUrl).toMatch(/^https:\/\/example\.com\//);
    }
  });

  it('returns a published project by slug with relations', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/projects/demo-led-shelf-lighting')
      .expect(200);

    expect(response.body.title).toContain('Demo:');
    expect(response.body.tools.length).toBeGreaterThan(0);
    expect(response.body.materials.length).toBeGreaterThan(0);
    expect(response.body.difficulty.provenance).toBeTruthy();
    expect(response.body.isDemo).toBe(true);
  });

  it('hides draft projects from public slug lookup', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/projects/demo-draft-router-table-fence')
      .expect(404);
  });

  it('returns 404 for unknown slugs', async () => {
    await request(app.getHttpServer()).get('/api/v1/projects/does-not-exist').expect(404);
  });

  it('lists categories with published counts', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/categories').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(6);
    const electronics = response.body.find(
      (category: { slug: string }) => category.slug === 'electronics',
    );
    expect(electronics.publishedProjectCount).toBeGreaterThan(0);
  });

  it('returns category detail with paginated projects', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/categories/electronics')
      .query({ page: 1, pageSize: 10 })
      .expect(200);

    expect(response.body.category.slug).toBe('electronics');
    expect(response.body.projects.data.length).toBeGreaterThan(0);
  });

  it('supports keyword search', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/search')
      .query({ q: 'ESP32 thermometer' })
      .expect(200);

    expect(response.body.data.some((item: { slug: string }) => item.slug.includes('esp32'))).toBe(
      true,
    );
  });

  it('supports combined filters and sorting', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/search')
      .query({
        category: '3d-printing',
        difficulty: 'BEGINNER',
        maxCostCents: 2000,
        sort: 'estimatedCost_asc',
      })
      .expect(200);

    for (const project of response.body.data) {
      expect(project.category.slug).toBe('3d-printing');
      expect(project.difficulty.value).toBe('BEGINNER');
      expect(project.estimatedCost.value.amountCents).toBeLessThanOrEqual(2000);
    }
  });

  it('supports required tool filtering', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/search')
      .query({ tools: '3d-printer' })
      .expect(200);

    expect(response.body.meta.totalItems).toBeGreaterThan(0);
  });

  it('returns empty results gracefully', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/search')
      .query({ q: 'zzzz-no-such-project-term', category: 'robotics' })
      .expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body.meta.totalItems).toBe(0);
  });

  it('rejects invalid query parameters', async () => {
    await request(app.getHttpServer()).get('/api/v1/projects').query({ pageSize: 999 }).expect(400);

    await request(app.getHttpServer())
      .get('/api/v1/search')
      .query({ difficulty: 'IMPOSSIBLE' })
      .expect(400);
  });
});
