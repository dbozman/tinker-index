import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaService } from '../src/prisma/prisma.service';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl) && process.env.SKIP_DB_INTEGRATION !== '1';

describe.runIf(runIntegration)('PostgreSQL integration', () => {
  const prismaService = new PrismaService();

  beforeAll(async () => {
    const connected = await prismaService.connect();
    expect(connected).toBe(true);
  });

  afterAll(async () => {
    await prismaService.disconnect();
  });

  it('executes a connectivity query', async () => {
    const healthy = await prismaService.checkDatabase();
    expect(healthy).toBe(true);
    expect(prismaService.isConnected()).toBe(true);
  });

  it('can read and write SchemaMeta through Prisma', async () => {
    const key = `m2a-integration-${Date.now()}`;
    const created = await prismaService.prisma.schemaMeta.create({
      data: { key, value: 'ok' },
    });

    const found = await prismaService.prisma.schemaMeta.findUnique({
      where: { key },
    });

    expect(found?.id).toBe(created.id);
    expect(found?.value).toBe('ok');

    await prismaService.prisma.schemaMeta.delete({ where: { key } });
  });
});

describe.runIf(!runIntegration)('PostgreSQL integration (skipped)', () => {
  it('skips when DATABASE_URL is not configured', () => {
    expect(runIntegration).toBe(false);
  });
});
